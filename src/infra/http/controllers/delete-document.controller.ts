import { Controller, Delete, Param } from '@nestjs/common'
import { DocumentsService } from '../services/document.service'

@Controller('/documents')
export class DeleteDocumentController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Delete(':id')
  async handle(@Param('id') id: number): Promise<void> {
    await this.documentsService.deleteDocumentById(id)
  }
}
