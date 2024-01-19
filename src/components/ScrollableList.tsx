import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { tableSchedule } from "../types/tableSchedules";
import { Checkbox, ListItemSecondaryAction } from "@mui/material";

type Props = {
    formSchedule: boolean[];
    setFormSchedule: (b: boolean[]) => void;
};

export default function ScrollableList({
    formSchedule,
    setFormSchedule,
}: Props) {
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        hIndex: number
    ) => {
        const holder = formSchedule;
        holder[hIndex] = event.target.checked;
        console.log(holder);
        setFormSchedule([...holder]);
    };

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
            }}
        >
            {tableSchedule.map((item, index) => (
                <ListItem
                    key={`item-${item.shift}-${item.hourly}`}
                    sx={{
                        borderBottom: "1px solid gray",
                    }}
                >
                    <ListItemText
                        primary={`${item.shift}${item.hourly} ${item.startTime}-${item.endTime}`}
                    />
                    <ListItemSecondaryAction>
                        <Checkbox
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                handleChange(event, index);
                            }}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
}
