export type ReservationT = {
    id: string;
    roomId: string;
    reservationResponsibleId: string;
    reservatedToId: string;
    creationDate: string; 
    schedule: boolean[][];
    reservationStart: string; 
    reservationEnd: string; 
  };
  
