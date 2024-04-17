import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { tableSchedule } from "../types/tableSchedules";
import { Tooltip, styled } from "@mui/material";
import { StateContext } from "../context/ReactContext";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import tableFormat from "../utils/tableFormat";
import DaysTableCell from "./DaysTableCell";
import { ReservationT } from "../types/ReservationT";
import { RoomT } from "../types/RoomT";

const OrangeTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
}));

export default function DaysTable() {
    const { roomList, reservationList } = React.useContext(StateContext);

    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(
        dayjs()
    );

    const currentTime = dayjs();
    let percent = "0%";
    if (currentTime.hour() > 6) {
        percent =
            ((currentTime.hour() * 60 + currentTime.minute() - 7 * 60) / 915) *
                100 +
            3.5;
    }

    const [finalSchedule, setFinalSchedule] = React.useState([]);

    React.useEffect(() => {
        if (roomList && reservationList && selectedDate) {
            const reservableRoomList = roomList.filter(
                (r: RoomT) => r.reservable == true
            );
            const holder = tableFormat(
                selectedDate,
                reservationList,
                reservableRoomList
            );
            setFinalSchedule(holder);
        }
    }, [roomList, reservationList, selectedDate]);

    return (
        <>
            <DemoContainer
                components={["DatePicker"]}
                sx={{ marginLeft: 2, marginBottom: 1 }}
            >
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
                        minWidth: "9rem",
                        height: "100%",
                        overflow: "hidden",
                        borderRight: "0.1rem solid hsla(120, 100%, 25%, 1)",
                        pointerEvents: "none",
                    },
                    width: "100%",
                    maxWidth: 1250,
                    margin: "auto",
                }}
            >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <OrangeTableRow>
                            <TableCell></TableCell>
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
                        </OrangeTableRow>
                    </TableHead>
                    <TableBody>
                        {finalSchedule[1]?.map(
                            (array: ReservationT[], arrayIndex: number) => {
                                return (
                                    <TableRow
                                        key={finalSchedule[0][arrayIndex]}
                                    >
                                        <TableCell align="center">
                                            {finalSchedule[0][arrayIndex].name}{" "}
                                            {
                                                finalSchedule[0][arrayIndex]
                                                    ?.roomNumber
                                            }
                                        </TableCell>

                                        {array?.map(
                                            (
                                                schedule: any[],
                                                index: number
                                            ) => {
                                                let passedSchedule = null;
                                                let passedSpan = 1;
                                                if (schedule[0]) {
                                                    passedSchedule =
                                                        schedule[0];
                                                    passedSpan = schedule[1];
                                                }
                                                return (
                                                    <DaysTableCell
                                                        key={`daystablecell ${finalSchedule[0]}-${arrayIndex}-${index}`}
                                                        schedule={
                                                            passedSchedule
                                                        }
                                                        index={index}
                                                        span={passedSpan}
                                                    />
                                                );
                                            }
                                        )}
                                    </TableRow>
                                );
                            }
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
