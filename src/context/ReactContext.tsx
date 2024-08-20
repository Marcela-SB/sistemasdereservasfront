import dayjs, { Dayjs } from "dayjs";
import React, { ReactElement, createContext, useState } from "react";
import { RoomT } from "../types/RoomT";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { UserT } from "../types/UserT";
import { ReservationT } from "../types/ReservationT";
import { KeyT } from "../types/KeyDeliveryT";
import { AlertColor } from "@mui/material";

export type GlobalContent = {
    date: Dayjs;
    setDate: (c: Dayjs) => void;
    roomList: RoomT[];
    userList: UserT[];
    reservationList: ReservationT[];
    keyList: KeyT[];
    loggedUser: unknown | null;
    setLoggedUser: (u: unknown) => void;
    snackBarText: string;
    setSnackBarText: (s: string) => void;
    snackBarSeverity: AlertColor;
    setSnackBarSeverity: (s: AlertColor) => void;
};

export const StateContext = createContext<GlobalContent>({
    date: dayjs(),
    setDate: () => {},
    roomList: [],
    userList: [],
    reservationList: [],
    keyList: [],
    loggedUser: null,
    setLoggedUser: () => {},
    snackBarText: "",
    setSnackBarText: () => {},
    snackBarSeverity: "success",
    setSnackBarSeverity: () => {},
});

type Props = { children: ReactElement };

function ReactContext({ children }: Props) {
    const [date, setDate] = useState<Dayjs>(dayjs());

    const { data: roomList } = useQuery({
        queryKey: ["roomListContext"],
        queryFn: async () => {
            const response = await axiosInstance.get("room/list");
            return response.data;
        },
    });

    const { data: userList } = useQuery({
        queryKey: ["userListContext"],
        queryFn: async () => {
            const response = await axiosInstance.get("user/list");
            return response.data;
        },
    });

    const { data: reservationList } = useQuery({
        queryKey: ["reservationListContext"],
        queryFn: async () => {
            const response = await axiosInstance.get("reservation/list");
            return response.data;
        },
    });

    const { data: keyList } = useQuery({
        queryKey: ["keyListContext"],
        queryFn: async () => {
            const response = await axiosInstance.get("keydelivery/list");
            return response.data;
        },
    });

    const [loggedUser, setLoggedUser] = React.useState<unknown | null>(
        localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user")).user
            : null
    );

    const [snackBarText, setSnackBarText] = useState<string>("");

    const [snackBarSeverity, setSnackBarSeverity] =
        useState<AlertColor>("success");

    return (
        <StateContext.Provider
            value={{
                date,
                setDate,
                roomList,
                userList,
                reservationList,
                keyList,
                loggedUser,
                setLoggedUser,
                snackBarText,
                setSnackBarText,
                snackBarSeverity,
                setSnackBarSeverity,
            }}
        >
            {children}
        </StateContext.Provider>
    );
}

export default ReactContext;
