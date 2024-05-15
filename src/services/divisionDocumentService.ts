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
  static documentPrettyType(type: DocumentType) {
    switch (type) {
      case DocumentType.BUDGET:
        return 'Budget';
      case DocumentType.BUSINESS_PLAN:
        return 'Verksamhetsplan';
      case DocumentType.BUSINESS_REPORT:
        return 'Verksamhetsrapport';
      case DocumentType.FINANCIAL_REPORT:
        return 'Ekonomisk rapport';
      case DocumentType.MISC:
        return 'Annat';
      case DocumentType.PROTOCOL:
        return 'Protokoll';
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

    return data.map((document) => ({
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
    divisionGroupId: string,
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
            gammaSuperGroupId: divisionGroupId
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
