import {
  Controller,
  HttpCode,
  Post,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { DocumentsService } from '../services/document.service'
import { initContract } from '@ts-rest/core'
import {
  nestControllerContract,
  NestControllerInterface,
  NestRequestShapes,
  TsRest,
  TsRestRequest,
} from '@ts-rest/nest'
import { z } from 'zod'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response as ExpressResponse } from 'express'
import { DocumentMapper } from 'src/infra/database/drizzle/mappers/document.mapper'

const c = initContract()

const createDocumentBodySchema = z.object({
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
  message: z.string(),
})

const contract = c.router({
  handle: {
    method: 'POST',
    path: '/documents',
    contentType: 'multipart/form-data',
    body: z.object({
      originId: z.coerce.number(),
      typeId: z.coerce.number(),
      file: z.instanceof(File),
    }),
    responses: {
      201: createDocumentBodySchema,

    },
    summary: 'Create a document',
  },
})

const nestController = nestControllerContract(contract)
type RequestShapes = NestRequestShapes<typeof nestController>

@Controller('/documents')
export class CreateDocumentController
  implements NestControllerInterface<typeof nestController>
{
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  @TsRest(nestController.handle)
  async handle(
    @UploadedFile() file: Express.Multer.File,
    @TsRestRequest() { body }: RequestShapes['handle'],
  ) {
    const { originId, typeId } = body

    const response = await this.documentsService.createDocument(
      file,
      originId,
      typeId,
    )

    const data = DocumentMapper.toResponse(response)

    return {
      status: 201 as const,
      body: {
        data,
        message: 'Documento cadastrado com sucesso.'
      },
    }
  }
}
