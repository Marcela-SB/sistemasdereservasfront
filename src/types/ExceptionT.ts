import { Courses } from "./Courses";
import { ReservationT } from "./ReservationT";

export type ExceptionT = {
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
    reserva: ReservationT
  };
  
