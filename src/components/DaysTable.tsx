import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { tableSchedule } from "../types/tableSchedules";
import { Box, Container, Divider, Tooltip, Typography } from "@mui/material";
import { weekDays } from "../types/weekDays";
import { StateContext } from "../context/ReactContext";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import tableFormat from "../utils/tableFormat";

export default function DaysTable() {
    const { roomList, userList, reservationList, loggedUser } =
        React.useContext(StateContext);

    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(
        dayjs()
    );

    const currentTime = dayjs();
    let percent = "0%";
    if (currentTime.hour() > 6) {
        percent =
            ((currentTime.hour() * 60 + currentTime.minute() - 7 * 60) / 915) *
                100 +
            7;
    }

    const [finalSchedule, setFinalSchedule] = React.useState([]);

    React.useEffect(() => {
        if ((roomList, reservationList)) {
            setFinalSchedule(
                tableFormat(selectedDate, reservationList, roomList)
            );
        }
    }, [roomList, reservationList, selectedDate]);

    return (
        <>
            <DemoContainer components={["DatePicker"]} sx={{ marginBottom: 1 }}>
                <DatePicker
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    sx={{ width: "10%" }}
                />
            </DemoContainer>
            <TableContainer
                component={Paper}
                sx={{
                    position: "relative",
                    "--width": `${percent}%`,
                    "::before": {
                        content: '""',
                        position: "absolute",
                        backgroundColor: "hsla(120, 100%, 25%, 0.2)",
                        display: "flex",
                        width: "var(--width, 0)",
                        minWidth: "7.1rem",
                        height: "100%",
                        overflow: "hidden",
                        borderRight: "0.1rem solid hsla(120, 100%, 25%, 1)",
                        pointerEvents: "none",
                    },
                    width: "100%",
                }}
            >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: "transparent",
                            }}
                        >
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
                                                    borderLeft:
                                                        "1px solid rgba(81, 81, 81, 1);",
                                                }}
                                            >
                                                {schedule.shift +
                                                    schedule.hourly}
                                            </TableCell>
                                        </Tooltip>
                                    </>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {finalSchedule[1]?.map((array, arrayIndex) => (
                            <TableRow key={finalSchedule[0][arrayIndex]}>
                                <TableCell align="center">
                                    {finalSchedule[0][arrayIndex].name}
                                </TableCell>

                                {array?.map((schedule, index) => {
                                    console.log(finalSchedule[1]);
                                    return (
                                        <Tooltip title={schedule.name}>
                                            <TableCell
                                                padding="normal"
                                                key={schedule.id + index}
                                                size="medium"
                                                align="center"
                                                sx={{
                                                    borderLeft:
                                                        "1px solid rgba(81, 81, 81, 1);",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        width: "3.3rem",
                                                    }}
                                                >
                                                    <Typography noWrap>
                                                        {schedule.name}
                                                    </Typography>
                                                </div>
                                            </TableCell>
                                        </Tooltip>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
