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
                    // se existir primeiro ele procura se ja esta na base schedule se ja estiver adiciona um no span se não estiver ele cria
                    if(h){
                        let isInBaseSchedule = false
                        baseSchedule.forEach((baseScheduleItem : any) => {
                            console.log(baseScheduleItem[0])
                            if(baseScheduleItem[0]?.id == reserv.id){
                                        baseScheduleItem[1]++
                                        isInBaseSchedule = true
                                        baseSchedule.pop()
                                    }
                        })
                        if(!isInBaseSchedule){
                            baseSchedule[index + 1] = [reserv, 1]
                        }
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

    return [headers, finalSchedule]
}
