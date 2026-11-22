import { DocumentType } from '@prisma/client';

export function documentTypeKey(type: DocumentType) {
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
