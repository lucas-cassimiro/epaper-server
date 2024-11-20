import { Controller, Get, Param, Res } from '@nestjs/common';
import { MinioService } from 'src/infra/minio/minio.service'

@Controller('/documents')
export class FetchUniqueDocumentController {
  constructor(private readonly minioService: MinioService) {}

  @Get(':filePath')
  async handle(@Param('filePath') filePath: string, @Res() res: Response) {
    
  }
}
