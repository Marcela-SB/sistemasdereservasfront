import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { baseInternalSchedule, tableSchedule } from "../types/tableSchedules";
import { Checkbox, Tooltip } from "@mui/material";
import { weekDays } from "../types/weekDays";

type Props = {
    formSchedule: boolean[][];
    setFormSchedule: (b: boolean[][]) => void;
};

export default function FullScreenTableDialog({
    formSchedule,
    setFormSchedule,
}: Props) {
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        wIndex: number,
        hIndex: number
    ) => {
        const holder = formSchedule;
        console.log(event.target.checked);
        holder[wIndex][hIndex] = event.target.checked;
        console.log(holder);
        setFormSchedule([...holder]);
    };


    React.useEffect(() => {
        if (formSchedule) {
            setFormIntern(formSchedule);
        }
    }, [formSchedule]);

    return (
        <TableContainer
            component={Paper}
            sx={{ marginTop: 4, marginX: "auto" }}
        >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                                return (
                                    <Tooltip
                                        title={""}
                                        key={weekIndex + hourIndex}
                                    >
                                        <TableCell
                                            padding="checkbox"
                                            key={
                                                "row" +
                                                schedule.shift +
                                                schedule.hourly
                                            }
                                            size="medium"
                                            align="center"
                                        >
                                            {formSchedule[weekIndex][
                                                hourIndex
                                            ] ? (
                                                <Checkbox
                                                    sx={{
                                                        "& .MuiSvgIcon-root": {
                                                            fontSize: 52,
                                                        },
                                                    }}
                                                    checked={
                                                        formSchedule[weekIndex][
                                                            hourIndex
                                                        ]
                                                    }
                                                    onChange={(e) => {
                                                        handleChange(
                                                            e,
                                                            weekIndex,
                                                            hourIndex
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <Checkbox
                                                    sx={{
                                                        "& .MuiSvgIcon-root": {
                                                            fontSize: 52,
                                                        },
                                                    }}
                                                    checked={
                                                        formSchedule[weekIndex][
                                                            hourIndex
                                                        ]
                                                    }
                                                    onChange={(e) => {
                                                        handleChange(
                                                            e,
                                                            weekIndex,
                                                            hourIndex
                                                        );
                                                    }}
                                                />
                                            )}
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
