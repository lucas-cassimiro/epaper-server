import { Controller, Get, Query } from '@nestjs/common'
import { DocumentsService } from '../services/document.service'

@Controller('/aa')
export class FindDocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async handle(
    @Query('createdAt') createdAt?: string,
    @Query('typeId') typeId?: string,
    @Query('emitter') emitter?: string,
    @Query('totalTaxes') totalTaxes?: string,
    @Query('netValue') netValue?: string,
  ) {

    const filters = {
      createdAt,
      typeId: typeId ? parseInt(typeId, 10) : undefined,
      emitter,
      totalTaxes: totalTaxes ? parseFloat(totalTaxes) : undefined,
      netValue: netValue ? parseFloat(netValue) : undefined,
    }

    return await this.documentsService.getDocumentByParam(filters)
  }
}
