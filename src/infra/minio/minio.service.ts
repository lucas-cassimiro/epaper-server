import * as Minio from 'minio'
import { Injectable } from '@nestjs/common'
import { DocumentParserService } from '../document-parser/document-parser.service'

@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client

  constructor(private readonly documentParserService: DocumentParserService) {
    this.minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'ROOTNAME',
      secretKey: 'CHANGEME123',
    })
  }

  async upload(bucket: string, file: Express.Multer.File): Promise<string> {
    const bucketExists = await this.minioClient.bucketExists(bucket)
    if (!bucketExists) {
      await this.minioClient.makeBucket(bucket, 'us-east-1')
    }

    const metaData: Record<string, string> = {
      'Content-Type': file.mimetype,
    }

    const objectName = `${Date.now()}_${file.originalname}`

    try {
      await this.minioClient.putObject(
        bucket,
        objectName,
        file.buffer,
        metaData as any,
      )
      return objectName
    } catch (error) {
      console.error('Error uploading file to MinIO:', error)
      throw error
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    await this.minioClient.removeObject('documents', filePath)
  }

  async handleDocumentUpload(
    file: Express.Multer.File,
    originId: number,
    typeId: number,
  ) {
    const { title, emitter, totalTaxes, netValue } =
      await this.documentParserService.extractPdfData(file)

    const filePath = await this.upload('documents', file)

    const documentData = {
      title,
      emitter,
      totalTaxes,
      netValue,
      originId,
      typeId,
      filePath,
    }

    return { documentData }
  }
}
