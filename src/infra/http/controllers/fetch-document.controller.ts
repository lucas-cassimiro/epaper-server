import { Controller, Get, HttpCode, Req } from '@nestjs/common'
import { DocumentsService } from '../services/document.service'
import {
  nestControllerContract,
  NestControllerInterface,
  NestRequestShapes,
  TsRest,
} from '@ts-rest/nest'
import { z } from 'zod'
import { initContract } from '@ts-rest/core'

const c = initContract()

const fetchDocumentBodySchema = z.object({
  id: z.number(),
  title: z.string().max(255),
  emitter: z.string().max(255),
  totalTaxes: z.coerce.number(),
  netValue: z.coerce.number(),
  originId: z.coerce.number().min(1),
  typeId: z.coerce.number().min(1),
  filePath: z.string().max(255),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const contract = c.router({
  handle: {
    method: 'GET',
    path: '/documents',
    responses: {
      200: fetchDocumentBodySchema.array(),
    },
    summary: 'Get a document',
  },
})

const nestController = nestControllerContract(contract)
type RequestShapes = NestRequestShapes<typeof nestController>

@Controller('/documents')
export class FetchDocumentsController
  implements NestControllerInterface<typeof nestController>
{
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @HttpCode(200)
  @TsRest(nestController.handle)
  async handle(): Promise<{
    status: 200
    body: z.infer<typeof fetchDocumentBodySchema>[]
  }> {
    // Busca os documentos do serviço
    const documents = await this.documentsService.findAll()

    // Converte os documentos para garantir que estão no formato do esquema
    
    return {
      status: 200,
      body: documents,
    }
  }
}

