import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { ReservationT } from "../types/ReservationT";
import { RoomT } from "../types/RoomT";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { StateContext } from "../context/ReactContext";
import { tableSchedule } from "../types/tableSchedules";
import { Checkbox, IconButton, ListItemSecondaryAction } from "@mui/material";
import getRoomById from "../utils/getRoomById";
import { Send } from "@mui/icons-material";
import dayjs from "dayjs";
import { KeyT } from "../types/KeyDeliveryT";

type Props = {
    setSelectedKey: (k: KeyT) => void;
};

export default function KeyScrollableList({ setSelectedKey }: Props) {
    const { keyList, roomList, userList } = React.useContext(StateContext);

    return (
        <List
            sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: "24rem",
                "& ul": { padding: 0 },
                "&::-webkit-scrollbar": { display: "none" },
                marginLeft:2    ,
                marginTop:2,
                borderRadius:"2%"
            }}
        >
            {keyList.map((item) => {
                const room = getRoomById(item.roomId, roomList);
                let roomDisplayName = room?.name;
                if (room?.roomNumber) {
                    roomDisplayName = roomDisplayName + " " + room.roomNumber;
                }

                const withdratime = dayjs(item.withdrawTime).format("HH:mm");

                const returnPrevision = dayjs(item.returnPrevision).format(
                    "HH:mm"
                );

                return (
                    <ListItem
                        key={item.id}
                        sx={{
                            borderBottom: "1px solid gray",
                        }}
                    >
                        <ListItemText
                            primary={`${roomDisplayName} ${withdratime}  -     ${returnPrevision}`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => setSelectedKey(item)}>
                                <Send></Send>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                );
            })}
        </List>
    );
}
