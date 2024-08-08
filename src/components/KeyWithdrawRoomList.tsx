import {
    Checkbox,
    Divider,
    ListItem,
    ListItemSecondaryAction,
} from "@mui/material";
import { RoomT } from "../types/RoomT.ts";
import { useEffect, useState } from "react";

type Props = {
    room: RoomT;
    changeRoomList: (room: RoomT) => void;
    checkSucess: boolean;
};

export default function KeyWithdrawRoomList({
    room,
    changeRoomList,
    checkSucess,
}: Props) {

    useEffect(() => {
        if (checkSucess) {
            console.log("updateidou");
            setChecked(false)
        }
    }, [checkSucess]);

    const [checked, setChecked] = useState(false)

    return (
        <>
            <ListItem key={`modroomlist-${room.id}`}>
                {room.name} {room.roomNumber}
                <ListItemSecondaryAction>
                    <Checkbox
                        onChange={() => {
                            setChecked(!checked)
                            changeRoomList(room);
                        }}
                        checked={checked}
                    ></Checkbox>
                </ListItemSecondaryAction>
            </ListItem>
            <Divider key={`modroomlistdivider-${room.id}`} variant="middle" />
        </>
    );
}
