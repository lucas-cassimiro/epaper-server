import { Module } from '@nestjs/common'

import { DrizzleModule } from '../database/database.module'
import { MinioModule } from '../minio/minio.module'
import { DocumentParserModule } from '../document-parser/document-parser.module'

import {
  DeleteDocumentController,
  FetchDocumentsController,
  CreateDocumentController,
  FetchUniqueDocumentController,
  FindDocumentsController,
} from './controllers'
import { DocumentsService } from './services/document.service'

@Module({
  imports: [DrizzleModule, MinioModule, DocumentParserModule],
  controllers: [
    CreateDocumentController,
    FetchDocumentsController,
    DeleteDocumentController,
    FetchUniqueDocumentController,
    FindDocumentsController,
  ],
  providers: [DocumentsService],
})
export class HttpModule {}
