import * as pdfParse from 'pdf-parse'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DocumentParserService {
  async extractPdfData(file: Express.Multer.File) {
    const pdfData = await pdfParse(file.buffer)
    const text = pdfData.text

    const title = this.extractField(text, 'Nome do documento:')
    const emitter = this.extractField(text, 'Emitente:')
    const totalTaxes = parseFloat(
      this.extractField(text, 'Valor total dos tributos:'),
    )
    const netValue = parseFloat(this.extractField(text, 'Valor líquido:'))

    return { title, emitter, totalTaxes, netValue }
  }

  private extractField(text: string, label: string): string {
    const regex = new RegExp(`${label}\\s*(.+)`, 'i')
    const match = text.match(regex)
    return match ? match[1].trim() : null
  }
}
