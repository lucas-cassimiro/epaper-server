import { Module } from '@nestjs/common'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { PG_CONNECTION } from '../../constants'
import * as schema from './drizzle/schema'
import { ConfigService } from '@nestjs/config'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

@Module({
  providers: [
    {
      provide: PG_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>('DATABASE_URL')
        const pool = new Pool({
          connectionString,
        })

        return drizzle(pool, {
          schema,
          logger: true,
        }) as NodePgDatabase<typeof schema>
      },
    },
  ],
  exports: [PG_CONNECTION],
})
export class DrizzleModule {}
