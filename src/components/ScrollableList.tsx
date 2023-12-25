import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { ReservationT } from "../types/ReservationT";
import { RoomT } from "../types/RoomT";

type Props = {
    //isOpen: boolean;
    //setIsOpen: (b: boolean) => void;
    optionsList: ReservationT[];
};

export default function ScrollableList({ optionsList }: Props) {
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
                marginLeft:6,
                "& ul": { padding: 0 },
            }}
        >
            {[0, 1, 2,4,5,6,7,8,9,10,11,12,13,14,15,16].map((item) => (
                <ListItem key={`item-${item}`}>
                    <ListItemText primary={`Item ${item}`} />
                </ListItem>
            ))}
        </List>
    );
}
