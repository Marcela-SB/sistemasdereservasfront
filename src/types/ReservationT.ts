import { Courses } from "./Courses";

export type ReservationT = {
    id: string;
    roomsId: string[];
    reservationResponsibleId: string;
    reservatedToId: string;
    creationDate: string; 
    schedule: boolean[][];
    reservationStart: string; 
    reservationEnd: string; 
    name:string;
    comment:string;
    course: Courses;
    slots: number;
  };
  
