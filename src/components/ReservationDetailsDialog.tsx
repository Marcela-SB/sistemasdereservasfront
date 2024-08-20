import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Box, Divider, IconButton, Stack } from "@mui/material";
import { ReservationT } from "../types/ReservationT";
import CloseIcon from "@mui/icons-material/Close";
import getRoomById from "../utils/getRoomById";
import { StateContext } from "../context/ReactContext";
import getUserById from "../utils/getUserById";
import dayjs from "dayjs";
import ReservationDetailsTable from "./ReservationDetailsTable";
import { Courses } from "../types/Courses";
import textfyCourse from "../utils/textfyCourse";
import PaperComponent from "./PaperComponent";
import DraggablePaper from "./DraggablePaper";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
    isOpen: boolean;
    setIsOpen: (b: boolean) => void;
    reservation: ReservationT;
    //selectedUser: UserT | null;
    //setSelectedUser: (user: UserT | null) => void;
};

export default function ReservationDetailsDialog({
    isOpen,
    setIsOpen,
    reservation,
}: Props) {
    const { roomList, userList } = React.useContext(StateContext);

    const handleClose = () => {
        setIsOpen(false);
    };

    const room = getRoomById(reservation.roomId, roomList);

    const startDate = dayjs(reservation.reservationStart).format("DD/MM/YYYY");

    const endDate = dayjs(reservation.reservationEnd).format("DD/MM/YYYY");


    return (
        <DraggablePaper>
            <Dialog
                maxWidth={"md"}
                fullWidth
                open={isOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
                PaperComponent={PaperComponent}
                hideBackdrop
                PaperProps={{
                    elevation: 0,
                    sx: {
                        border: "solid 1px #004586",
                    },
                }}
                disableEnforceFocus
                style={{
                    top: "30%",
                    left: "30%",
                    height: "fit-content",
                    width: "fit-content",
                }}
            >
                <AppBar
                    sx={{ position: "relative" }}
                    className="draggable-dialog"
                >
                    <Toolbar>
                        <Typography
                            sx={{ ml: 0, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            Detalhes da reserva
                        </Typography>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Box sx={{ padding: 2, flexGrow: 1 }}>
                    <Stack direction={"column"}>
                        <Stack
                            direction={"row"}
                            sx={{ minWidth: 0 }}
                            divider={
                                <Divider orientation="vertical" flexItem />
                            }
                            spacing={2}
                        >
                            <Box width={"50%"} flexGrow={1}>
                                <Typography variant="body1" noWrap>
                                    Nome da reserva: {reservation.name}
                                </Typography>
                                <Typography variant="body1" noWrap>
                                    Vagas da reserva:
                                    {reservation.slots}
                                </Typography>
                                <Typography variant="body1" noWrap>
                                    Curso: {textfyCourse(reservation.course)}
                                </Typography>
                                <Typography variant="body1" noWrap>
                                    Reservador por:
                                    {
                                        getUserById(
                                            reservation.reservatedToId,
                                            userList
                                        )?.name
                                    }
                                </Typography>
                                <Typography variant="body1" noWrap>
                                    Sala reservada:
                                    {room?.name} {room?.roomNumber}
                                </Typography>

                                <Typography variant="body1" noWrap>
                                    Duração da reserva: {startDate}
                                    {reservation.reservationEnd
                                        ? " - " + endDate
                                        : null}
                                </Typography>
                                <Typography variant="body1" noWrap>
                                    Responsavel pela reserva:
                                    {
                                        getUserById(
                                            reservation.reservationResponsibleId,
                                            userList
                                        )?.name
                                    }
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="body2">
                                    Observações:
                                </Typography>
                                <Typography variant="body2">
                                    {reservation.comment}
                                </Typography>
                            </Box>
                        </Stack>

                        <ReservationDetailsTable
                            formSchedule={reservation.schedule}
                        />
                    </Stack>
                </Box>
            </Dialog>
        </DraggablePaper>
    );
}
