import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '../../database/drizzle/schema'
import { PG_CONNECTION } from 'src/constants'
import { MinioService } from 'src/infra/minio/minio.service'

import { and, eq, ilike } from 'drizzle-orm'

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(PG_CONNECTION)
    private readonly connection: NodePgDatabase<typeof schema>,
    private readonly minioService: MinioService,
  ) {}

  async findAll() {
    try {
      return await this.connection.query.documentsTable.findMany()
    } catch (error) {
      return error
    }
  }

  async createDocument(
    file: Express.Multer.File,
    originId: number,
    typeId: number,
  ) {
    try {
      const data = await this.minioService.handleDocumentUpload(
        file,
        originId,
        typeId,
      )

      const dataWithStrings = {
        ...data.documentData,
        totalTaxes: data.documentData.totalTaxes.toString(),
        netValue: data.documentData.netValue.toString(),
      }

      const insertedDocument = await this.connection
        .insert(schema.documentsTable)
        .values(dataWithStrings)
        .returning()

      return insertedDocument[0]
    } catch (error) {
      console.error('Falha ao criar o documento:', error)
      throw new Error('Falha ao criar o documento')
    }
  }

  async deleteDocumentById(id: number) {
    const document = await this.connection
      .select()
      .from(schema.documentsTable)
      .where(eq(schema.documentsTable.id, id))

    if (!document || !document[0].filePath) {
      throw new Error('Documento ou arquivo não encontrado')
    }

    await this.minioService.deleteFile(document[0].filePath)

    return await this.connection
      .delete(schema.documentsTable)
      .where(eq(schema.documentsTable.id, id))
  }

  async getDocumentByParam(filters: {
    createdAt?: string
    typeId?: number
    emitter?: string
    totalTaxes?: number
    netValue?: number
  }) {
    const conditions = []

    if (filters.createdAt) {
      conditions.push(eq(schema.documentsTable.createdAt, filters.createdAt))
    }

    if (filters.typeId) {
      conditions.push(eq(schema.documentsTable.typeId, filters.typeId))
    }

    if (filters.emitter) {
      conditions.push(
        ilike(schema.documentsTable.emitter, `%${filters.emitter}%`),
      )
    }

    if (filters.totalTaxes) {
      conditions.push(
        eq(schema.documentsTable.totalTaxes, filters.totalTaxes.toString()),
      )
    }

    if (filters.netValue) {
      conditions.push(
        eq(schema.documentsTable.netValue, filters.netValue.toString()),
      )
    }

    return await this.connection.query.documentsTable.findMany({
      where: and(...conditions),
    })
  }
}
