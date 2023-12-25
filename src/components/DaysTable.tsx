import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { tableSchedule } from "../types/tableSchedules";
import { Box, Container, Divider, Tooltip } from "@mui/material";
import { weekDays } from "../types/weekDays";

export default function DaysTable() {
    return (
        <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        {tableSchedule.map((schedule) => {
                            return (
                                <>
                                    <Tooltip
                                        title={
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
                                            sx={{
                                                borderLeft: "1px solid rgba(81, 81, 81, 1);"
                                            }}
                                        >
                                            {schedule.shift + schedule.hourly}
                                        </TableCell>
                                    </Tooltip>
                                </>
                            );
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {weekDays.map((wd) => (
                        <TableRow key={wd.name}>
                            <TableCell align="center">{wd.name}</TableCell>

                            {tableSchedule.map((schedule) => {
                                return (
                                    <Tooltip title={""}>
                                        <TableCell
                                            padding="normal"
                                            key={
                                                "row" +
                                                schedule.shift +
                                                schedule.hourly
                                            }
                                            size="medium"
                                            align="center"
                                            sx={{
                                                borderLeft: "1px solid rgba(81, 81, 81, 1);"
                                            }}
                                        ></TableCell>
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
