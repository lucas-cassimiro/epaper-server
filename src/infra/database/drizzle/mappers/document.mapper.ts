export class DocumentMapper {
  static toResponse(data: any) {
    return {
      id: data.id,
      title: data.title,
      emitter: data.emitter,
      totalTaxes: Number(data.totalTaxes),
      netValue: Number(data.netValue),
      originId: data.originId,
      typeId: data.typeId,
      filePath: data.filePath,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
  }
}
