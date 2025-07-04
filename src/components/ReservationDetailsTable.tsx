import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Tooltip,
    TableBody,
    Checkbox,
} from "@mui/material";
import React from "react";
import { tableSchedule } from "../types/tableSchedules";
import { weekDays } from "../types/weekDays";

type Props = {
    formSchedule: boolean[][];
};

export default function ReservationDetailsTable({ formSchedule }: Props) {
    return (
        <TableContainer component={Paper} sx={{ marginX: "auto" }}>
            <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        {tableSchedule.map((schedule) => {
                            return (
                                <Tooltip
                                    title={
                                        schedule.startTime +
                                        "-" +
                                        schedule.endTime
                                    }
                                    key={
                                        schedule.startTime +
                                        "-" +
                                        schedule.endTime
                                    }
                                >
                                    <TableCell
                                        padding="none"
                                        key={
                                            "row" +
                                            schedule.shift +
                                            schedule.hourly
                                        }
                                        size="small"
                                        align="center"
                                    >
                                        {schedule.shift + schedule.hourly}
                                    </TableCell>
                                </Tooltip>
                            );
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {weekDays.map((wd, weekIndex) => (
                        <TableRow key={wd.name}>
                            <TableCell align="center">{wd.name}</TableCell>

                            {tableSchedule.map((schedule, hourIndex) => {
                                console.log(formSchedule);

                                const valorTratado = () => {
                                    let value = false;
                                    try {
                                        value =
                                            formSchedule[weekIndex][hourIndex];
                                    } catch (error) {
                                        console.log(error);
                                        
                                    }
                                    return value;
                                };

                                return (
                                    <Tooltip
                                        title={""}
                                        key={weekIndex + hourIndex}
                                    >
                                        <TableCell
                                            padding="none"
                                            key={
                                                "row" +
                                                schedule.shift +
                                                schedule.hourly
                                            }
                                            size="medium"
                                            align="center"
                                        >
                                            <Checkbox
                                                sx={{
                                                    "& .MuiSvgIcon-root": {
                                                        fontSize: 26,
                                                    },
                                                }}
                                                checked={
                                                     valorTratado()
                                                }
                                            />
                                        </TableCell>
                                    </Tooltip>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
