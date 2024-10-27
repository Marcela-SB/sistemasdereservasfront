import dayjs, { Dayjs } from "dayjs";
import { ReservationT } from "../types/ReservationT";
import { RoomT } from "../types/RoomT";

export default function tableFormat(
    date: Dayjs,
    reservationList: ReservationT[],
    roomList: RoomT[]
) {
    const dayOfWeek = date.day() - 1;
    if (dayOfWeek < 0) {
        return;
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
            reservation.roomsId.forEach((roomId) => {
                if (roomId == room.id) {
                    filteredReservationsByRooms[index].push(reservation);
                }
            });
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
    filteredReservationsByRooms.forEach((reservationsInARoom, indexout) => {
        let shouldPrint = false;
        shouldPrint = reservationsInARoom[0].name == "SALA 22 -" ? true : false;
        reservationsInARoom.forEach(
            (reserv: ReservationT | RoomT, indexOfReserv: number) => {
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
                    reserv.schedule[dayOfWeek].forEach(
                        (h: boolean, index: number) => {
                            if (h) {
                                if (shouldPrint) {
                                    console.log(reserv.name);
                                }
                                baseSchedule[index + 1] = [reserv, 1];
                            }
                        }
                    );
                }
            }
        );

        let controlVector = 1;
        let softCap = 0;

        while (controlVector < baseSchedule.length && softCap < 20) {
            if (
                baseSchedule[controlVector] &&
                baseSchedule[controlVector + 1]
            ) {
                if (
                    baseSchedule[controlVector][0].id ==
                    baseSchedule[controlVector + 1][0].id
                ) {
                    baseSchedule[controlVector][1]++;
                    baseSchedule.splice(controlVector + 1, 1);
                } else {
                    controlVector++;
                }
            } else {
                controlVector++;
            }

            softCap++;
        }

        finalSchedule.push(baseSchedule);
    });
    const headers = [];

    finalSchedule.forEach((obj) => {
        const head = obj.shift();
        headers.push(head);
    });

    return [headers, finalSchedule];
}
