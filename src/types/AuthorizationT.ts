export type AuthorizationT = {
    id: string;
    roomsId: string[];
    authorizationProfessorId: string;
    authorizationResponsibleId: string;
    authorizatedToId: string;
    creationDate: string | null;
    authorizationStart: string;
    authorizationEnd: string;
    comment: string | null;
};
