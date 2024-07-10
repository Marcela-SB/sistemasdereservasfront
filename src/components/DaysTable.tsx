import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { tableSchedule } from "../types/tableSchedules";
import { Box, Container, Tooltip, Typography, styled } from "@mui/material";
import { StateContext } from "../context/ReactContext";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import tableFormat from "../utils/tableFormat";
import DaysTableCell from "./DaysTableCell";
import { ReservationT } from "../types/ReservationT";
import { RoomT } from "../types/RoomT";
import daysTabledynamicSort from "../utils/daysTabledynamicSort";

const OrangeTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
}));

type Props = {
    setReservationToDetail: (r: ReservationT) => void;
    setReserDIsOpen: (b: boolean) => void;
};

export default function DaysTable({
    setReservationToDetail,
    setReserDIsOpen,
}: Props) {
    const { roomList, reservationList } = React.useContext(StateContext);

    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(
        dayjs()
    );

    const [finalSchedule, setFinalSchedule] = React.useState([]);

    const [isDomingo, setIsDomingo] = React.useState(false);

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
            const holderSchedule = [];
            if (selectedDate.day() != 0) {
                for (let index = 0; index < holder[0].length; index++) {
                    holderSchedule.push([holder[0][index], holder[1][index]]);
                }

                holderSchedule?.sort(daysTabledynamicSort());
            }

            setFinalSchedule(holderSchedule);
        }
    }, [roomList, reservationList, selectedDate]);

    const handleCellClick = (reservation: ReservationT) => {
        setReservationToDetail(reservation);
        setReserDIsOpen(true);
    };

    return (
        <Box>
            <DemoContainer
                components={["DatePicker"]}
                sx={{ marginLeft: 0, marginBottom: 1 }}
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
                    width: "100%",
                    margin: "auto",
                }}
            >
                <Table sx={{ minWidth: 650, mb: 2 }} aria-label="simple table">
                    <TableHead>
                        <OrangeTableRow>
                            <TableCell
                                size="small"
                                align="left"
                                padding="none"
                                sx={{ pl: 2 }}
                            >
                                <Typography
                                    variant="body1"
                                    noWrap
                                    sx={{
                                        fontFamily: "monospace",
                                        fontWeight: 700,
                                        color: "white",
                                        textDecoration: "none",
                                    }}
                                >
                                    HORÁRIOS
                                </Typography>
                            </TableCell>
                            {tableSchedule.map((schedule) => {
                                let color = "#7dc6ed";
                                if (schedule.shift == "T") {
                                    color = "#ffd320";
                                } else if (schedule.shift == "N") {
                                    color = "#4969f3";
                                }

                                const currentTime = dayjs();

                                let percentageWidth = 0;
                                let borderRight =
                                    "0rem solid hsla(120, 100%, 25%, 1)";

                                const currentDay =
                                    currentTime.format("YYYY-MM-DD");

                                const startTime = dayjs(
                                    `${currentDay} ${schedule.startTime}`
                                );
                                const endTime = dayjs(
                                    `${currentDay} ${schedule.endTime}`
                                );
                                if (
                                    currentTime.isAfter(startTime, "minute") &&
                                    currentTime.isBefore(endTime, "minute")
                                ) {
                                    const currentMinutes =
                                        currentTime.minute() +
                                        currentTime.hour() * 60;
                                    const startMinutes =
                                        startTime.minute() +
                                        startTime.hour() * 60;
                                    const subtractedMinutes =
                                        currentMinutes - startMinutes;
                                    percentageWidth =
                                        (subtractedMinutes / 50) * 100;
                                    borderRight =
                                        ".15rem solid hsla(120, 100%, 25%, 1)";
                                } else if (
                                    currentTime.isBefore(startTime, "minute")
                                ) {
                                    percentageWidth = 0;
                                } else if (
                                    currentTime.isAfter(endTime, "minute") ||
                                    currentTime.isSame(endTime, "minute")
                                ) {
                                    percentageWidth = 100;
                                }

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
                                                rowSpan={2}
                                                key={
                                                    "row" +
                                                    schedule.shift +
                                                    schedule.hourly
                                                }
                                                size="small"
                                                padding="none"
                                                align="center"
                                                sx={{
                                                    border: "1px solid white;",

                                                    position: "relative",
                                                    "::before": {
                                                        content: '""',
                                                        position: "absolute",
                                                        left: 0,
                                                        top: 0,
                                                        backgroundColor:
                                                            "hsla(120, 100%, 25%, 0.4)",
                                                        display: "flex",
                                                        width: `${percentageWidth}%`,
                                                        height: "100%",
                                                        overflow: "hidden",
                                                        borderRight: `${borderRight}`,
                                                        pointerEvents: "none",
                                                    },
                                                }}
                                            >
                                                <Box
                                                    component="span"
                                                    fontWeight="600"
                                                    color={'white'}
                                                >
                                                    {schedule.shift +
                                                        schedule.hourly}
                                                </Box>
                                            </TableCell>
                                        </Tooltip>
                                    </>
                                );
                            })}
                        </OrangeTableRow>
                        <OrangeTableRow>
                            <TableCell
                                size="small"
                                align="left"
                                padding="none"
                                sx={{ pl: 2 }}
                            >
                                <Typography
                                    variant="body1"
                                    noWrap
                                    sx={{
                                        fontFamily: "monospace",
                                        fontWeight: 700,
                                        color: "white",
                                        textDecoration: "none",
                                    }}
                                >
                                    SALAS
                                </Typography>
                            </TableCell>
                        </OrangeTableRow>
                    </TableHead>
                    <TableBody>
                        {selectedDate?.day() == 0 ? (
                            <TableRow>
                                <TableCell colSpan={16} align="center">
                                    Sem reservas aos domingos
                                </TableCell>
                            </TableRow>
                        ) : (
                            finalSchedule?.map(
                                (
                                    rowContent: [RoomT, any[]],
                                    roomArrayIndex: number
                                ) => {
                                    const room = rowContent[0];
                                    const roomSchedule = rowContent[1];

                                    return (
                                        <TableRow key={room.id + "-row"}>
                                            <TableCell
                                                padding="none"
                                                align="left"
                                                sx={{
                                                    bgcolor: "#004586",
                                                    color: "white",
                                                    fontWeight: 600,
                                                    pl: 2,
                                                }}
                                            >
                                                {room.name +
                                                    " " +
                                                    room.roomNumber}
                                            </TableCell>
                                            {roomSchedule.map(
                                                (hourschedule, dayIndex) => {
                                                    let passedSchedule = null;
                                                    let passedSpan = 1;
                                                    if (hourschedule[0]) {
                                                        passedSchedule =
                                                            hourschedule[0];
                                                        passedSpan =
                                                            hourschedule[1];
                                                    }
                                                    return (
                                                        <DaysTableCell
                                                            key={`daystablecell ${room.id}-${roomArrayIndex}-${dayIndex}`}
                                                            schedule={
                                                                passedSchedule
                                                            }
                                                            index={dayIndex}
                                                            span={passedSpan}
                                                            handleClick={
                                                                handleCellClick
                                                            }
                                                        />
                                                    );
                                                }
                                            )}
                                        </TableRow>
                                    );
                                }
                            )
                        )}

                        <OrangeTableRow>
                            <TableCell
                                size="small"
                                align="left"
                                padding="none"
                                sx={{ pl: 2 }}
                            >
                                <Typography
                                    variant="body1"
                                    noWrap
                                    sx={{
                                        fontFamily: "monospace",
                                        fontWeight: 700,
                                        color: "white",
                                        textDecoration: "none",
                                    }}
                                >
                                    SALAS
                                </Typography>
                            </TableCell>
                            {tableSchedule.map((schedule) => {
                                let color = "#7dc6ed";
                                if (schedule.shift == "T") {
                                    color = "#ffd320";
                                } else if (schedule.shift == "N") {
                                    color = "#4969f3";
                                }

                                const currentTime = dayjs();

                                let percentageWidth = 0;
                                let borderRight =
                                    "0rem solid hsla(120, 100%, 25%, 1)";

                                const currentDay =
                                    currentTime.format("YYYY-MM-DD");

                                const startTime = dayjs(
                                    `${currentDay} ${schedule.startTime}`
                                );
                                const endTime = dayjs(
                                    `${currentDay} ${schedule.endTime}`
                                );
                                if (
                                    currentTime.isAfter(startTime, "minute") &&
                                    currentTime.isBefore(endTime, "minute")
                                ) {
                                    const currentMinutes =
                                        currentTime.minute() +
                                        currentTime.hour() * 60;
                                    const startMinutes =
                                        startTime.minute() +
                                        startTime.hour() * 60;
                                    const subtractedMinutes =
                                        currentMinutes - startMinutes;
                                    percentageWidth =
                                        (subtractedMinutes / 50) * 100;
                                    borderRight =
                                        ".15rem solid hsla(120, 100%, 25%, 1)";
                                } else if (
                                    currentTime.isBefore(startTime, "minute")
                                ) {
                                    percentageWidth = 0;
                                } else if (
                                    currentTime.isAfter(endTime, "minute") ||
                                    currentTime.isSame(endTime, "minute")
                                ) {
                                    percentageWidth = 100;
                                }

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
                                                rowSpan={2}
                                                key={
                                                    "row" +
                                                    schedule.shift +
                                                    schedule.hourly
                                                }
                                                size="small"
                                                align="center"
                                                padding="none"
                                                sx={{
                                                    border: "1px solid white;",

                                                    position: "relative",
                                                    "::before": {
                                                        content: '""',
                                                        position: "absolute",
                                                        left: 0,
                                                        top: 0,
                                                        backgroundColor:
                                                            "hsla(120, 100%, 25%, 0.4)",
                                                        display: "flex",
                                                        width: `${percentageWidth}%`,
                                                        height: "100%",
                                                        overflow: "hidden",
                                                        borderRight: `${borderRight}`,
                                                        pointerEvents: "none",
                                                    },
                                                }}
                                            >
                                                <Box
                                                    component="span"
                                                    fontWeight="600"
                                                    color={'white'}
                                                >
                                                    {schedule.shift +
                                                        schedule.hourly}
                                                </Box>
                                            </TableCell>
                                        </Tooltip>
                                    </>
                                );
                            })}
                        </OrangeTableRow>
                        <OrangeTableRow>
                            <TableCell
                                size="small"
                                align="left"
                                padding="none"
                                sx={{ pl: 2 }}
                            >
                                <Typography
                                    variant="body1"
                                    noWrap
                                    sx={{
                                        fontFamily: "monospace",
                                        fontWeight: 700,
                                        color: "white",
                                        textDecoration: "none",
                                    }}
                                >
                                    HORÁRIOS
                                </Typography>
                            </TableCell>
                        </OrangeTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
