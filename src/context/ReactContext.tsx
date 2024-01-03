import dayjs, { Dayjs } from "dayjs";
import React, { ReactElement, createContext, useState } from "react";
import { RoomT } from "../types/RoomT";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserT } from "../types/UserT";
import { ReservationT } from "../types/ReservationT";
import { KeyT } from "../types/KeyDeliveryT";

export type GlobalContent = {
    date: Dayjs;
    setDate: (c: Dayjs) => void;
    roomList: RoomT[],
    userList: UserT[],
    reservationList: ReservationT[],
    keyList: KeyT[], 
    loggedUser: unknown | null,
    setLoggedUser: (u: unknown) => void
};

export const StateContext = createContext<GlobalContent>({
    date: dayjs(),
    setDate: () => {},
    roomList: [],
    userList: [],
    reservationList: [],
    keyList: [],
    loggedUser: null,
    setLoggedUser: () => {}

});

type Props = { children: ReactElement };

function ReactContext({ children }: Props) {
    const [date, setDate] = useState<Dayjs>(dayjs());

    const { data: roomList } = useQuery({
        queryKey: ["roomListContext"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:8080/room/list");
            return response.data;
        },
    });

    const { data: userList } = useQuery({
        queryKey: ["userListContext"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:8080/user/list");
            return response.data;
        },
    });

    const { data: reservationList } = useQuery({
        queryKey: ["reservationListContext"],
        queryFn: async () => {
            const response = await axios.get(
                "http://localhost:8080/reservation/list"
            );
            return response.data;
        },
    });

    const { data: keyList } = useQuery({
        queryKey: ["keyListContext"],
        queryFn: async () => {
            const response = await axios.get(
                "http://localhost:8080/keydelivery/list"
            );
            return response.data;
        },
    });

    const [loggedUser, setLoggedUser] = React.useState<unknown | null>(null)

    return (
        <StateContext.Provider value={{ date, setDate, roomList, userList, reservationList, keyList, loggedUser, setLoggedUser }}>
            {children}
        </StateContext.Provider>
    );
}

export default ReactContext;
