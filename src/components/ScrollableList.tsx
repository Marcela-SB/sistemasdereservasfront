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

type Props = {
    //isOpen: boolean;
    //setIsOpen: (b: boolean) => void;
    optionsList: ReservationT[];
};

export default function ScrollableList({ optionsList }: Props) {

    const {roomList} = React.useContext(StateContext);


    return (
        <List
            sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                height: "100%",
                margin: 2,
                marginLeft: 6,
                "& ul": { padding: 0 },
            }}
        >
            {roomList?.map(
                (item : RoomT) => (
                    <ListItem key={`item-${item.name}-${item?.roomNumber}`}>
                        <ListItemText primary={`Item ${item.name} ${item?.roomNumber}`} />
                    </ListItem>
                )
            )}
        </List>
    );
}
