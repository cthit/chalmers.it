import prisma from '@/prisma';

export interface DivisionDocument {
  id: number;
  title: string;
  description: string;
  url: string;
  divisionGroupName: string;
  divisionGroupId: number;
}

export default class DivisionDocumentService {
  static async get() {
    const data = await prisma.divisionDocument.findMany({
      select: {
        id: true,
        titleSv: true,
        titleEn: true,
        descriptionSv: true,
        descriptionEn: true,
        media: {
          select: {
            sha256: true
          }
        },
        DivisionGroup: {
          select: {
            id: true,
            prettyName: true
          }
        }
      }
    });

    return data.map((document) => ({
      id: document.id,
      title: document.titleEn,
      description: document.descriptionEn,
      url: `/api/media/${document.media.sha256}`,
      divisionGroupName: document.DivisionGroup.prettyName,
      divisionGroupId: document.DivisionGroup.id
    }));
  }

  static async add(
    divisionGroupId: string,
    titleSv: string,
    titleEn: string,
    descriptionSv: string,
    descriptionEn: string,
    mediaId: string
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
        descriptionEn
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
