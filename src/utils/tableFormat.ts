import dayjs, { Dayjs } from "dayjs";
import { ReservationT } from "../types/ReservationT";
import { RoomT } from "../types/RoomT";

export default function tableFormat(
    date: Dayjs,
    reservationList: ReservationT[],
    roomList: RoomT[]
) {
    const dayOfWeek = date.day()-1
    if(dayOfWeek < 0 ){
        console.log("domingo")
        return
    }
    let filteredReservations = reservationList;
    filteredReservations = filteredReservations.filter((r: ReservationT) => {
        const rStart = dayjs(r.reservationStart);
        const rEnd = dayjs(r.reservationEnd);
        if (date.isSame(rStart, "day") || date.isSame(rEnd, "day")) {
            return true;
        }
        if (date.isAfter(rStart) && date.isBefore(rEnd)) {
            return true;
        }
    });

    const filteredReservationsByRooms: any[] = [];

    roomList.forEach((room: RoomT, index) => {
        filteredReservationsByRooms.push([room]);

        filteredReservations.forEach((reservation: ReservationT) => {
            if (reservation.roomId == room.id) {
                filteredReservationsByRooms[index].push(reservation);
            }
        });
    });

    const finalSchedule: any[] = [];

    let baseSchedule = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];
    filteredReservationsByRooms.forEach((array, indexOfRoom) => {
        array.forEach((reserv : ReservationT | RoomT, indexOfReserv) => {
            if (indexOfReserv == 0) {
                baseSchedule = [
                    reserv,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ];
            } else {
                reserv.schedule[dayOfWeek].forEach((h:boolean, index : number) => {
                    if(h){
                        baseSchedule[index + 1] = reserv
                    }
                })
            }
        })
        
        finalSchedule.push(baseSchedule)

    });

    const headers = []

    finalSchedule.forEach((obj,) =>  {
        const head = obj.shift()
        headers.push(head)      
    })

    console.log(finalSchedule)
    return [headers, finalSchedule]
}
