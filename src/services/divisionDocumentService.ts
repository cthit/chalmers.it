import prisma from '@/prisma';
import { DocumentType } from '@prisma/client';

export interface DivisionDocument {
  id: number;
  titleSv: string;
  titleEn: string;
  descriptionSv: string;
  descriptionEn: string;
  url: string;
  divisionGroupName: string;
  divisionGroupId: number;
  gammaSuperGroupId: string;
  createdAt: Date;
  type: DocumentType;
}

export default class DivisionDocumentService {
  static documentTypeKey(type: DocumentType) {
    switch (type) {
      case DocumentType.BUDGET:
        return 'budget';
      case DocumentType.BUSINESS_PLAN:
        return 'businessPlan';
      case DocumentType.BUSINESS_REPORT:
        return 'businessReport';
      case DocumentType.FINANCIAL_REPORT:
        return 'financialReport';
      case DocumentType.MISC:
        return 'misc';
      case DocumentType.PROTOCOL:
        return 'protocol';
    }
  }

  static async get(): Promise<DivisionDocument[]> {
    const data = await prisma.divisionDocument.findMany({
      select: {
        id: true,
        titleSv: true,
        titleEn: true,
        descriptionSv: true,
        descriptionEn: true,
        createdAt: true,
        type: true,
        media: {
          select: {
            sha256: true
          }
        },
        DivisionGroup: {
          select: {
            id: true,
            gammaSuperGroupId: true,
            prettyName: true
          }
        }
      }
    });

    return this.cleanDocuments(data);
  }

  static async filter(
    locale: string,
    q?: string,
    gid?: string,
    type?: DocumentType
  ): Promise<DivisionDocument[]> {
    const data = await prisma.divisionDocument.findMany({
      select: {
        id: true,
        titleSv: true,
        titleEn: true,
        descriptionSv: true,
        descriptionEn: true,
        createdAt: true,
        type: true,
        media: {
          select: {
            sha256: true
          }
        },
        DivisionGroup: {
          select: {
            id: true,
            gammaSuperGroupId: true,
            prettyName: true
          }
        }
      },
      where: {
        type,
        DivisionGroup: {
          gammaSuperGroupId: gid
        },
        ...(locale === 'en'
          ? {
              titleEn: {
                contains: q,
                mode: 'insensitive'
              }
            }
          : {
              titleSv: {
                contains: q,
                mode: 'insensitive'
              }
            })
      }
    });

    return this.cleanDocuments(data);
  }

  private static cleanDocuments(documents: any[]) {
    return documents.map((document) => ({
      id: document.id,
      titleSv: document.titleSv,
      titleEn: document.titleEn,
      descriptionSv: document.descriptionSv,
      descriptionEn: document.descriptionEn,
      url: `/api/media/${document.media.sha256}`,
      divisionGroupName: document.DivisionGroup.prettyName,
      divisionGroupId: document.DivisionGroup.id,
      createdAt: document.createdAt,
      type: document.type,
      gammaSuperGroupId: document.DivisionGroup.gammaSuperGroupId
    }));
  }

  static async add(
    divisionSuperGroupId: string,
    titleSv: string,
    titleEn: string,
    descriptionSv: string,
    descriptionEn: string,
    mediaId: string,
    type?: DocumentType
  ) {
    return await prisma.divisionDocument.create({
      data: {
        DivisionGroup: {
          connect: {
            gammaSuperGroupId: divisionSuperGroupId
          }
        },
        media: {
          connect: {
            sha256: mediaId
          }
        },
        titleSv,
        titleEn,
        descriptionSv,
        descriptionEn,
        type
      }
    });
  }

  static async remove(documentId: number) {
    return await prisma.divisionDocument.delete({
      where: {
        id: documentId
      }
    });
  }
}
