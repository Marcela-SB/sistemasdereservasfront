export type KeyWithdrawal = {
    id: string;
    roomId: string;
    withdrawResponsibleId: string;
    responsibleForTheKeyId: string;
    withdrawTime: string;
    returnPrevision: string;
    returnTime: string | null;
    isKeyReturned: boolean;
    keyReturnedById: string | null;
  };
  