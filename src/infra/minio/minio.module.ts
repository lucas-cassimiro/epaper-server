import { Module } from '@nestjs/common'
import { MinioService } from './minio.service'
import { DocumentParserModule } from '../document-parser/document-parser.module'

@Module({
  imports: [DocumentParserModule],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
