import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import FullScreenFormDialog from "./FullScreenFormDialog";
import { StateContext } from "../context/ReactContext";
import { useState } from "react";
import { RoomT } from "../types/RoomT";
import dayjs, { Dayjs } from "dayjs";
import { UserT } from "../types/UserT";
import { baseInternalSchedule } from "../types/tableSchedules";
import {
    Autocomplete,
    Box,
    FormControlLabel,
    Grid,
    Switch,
    TextField,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers";
import FullScreenTableDialog from "./FullScreenTableDialog";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { ReservationT } from "../types/ReservationT";
import getRoomById from "../utils/getRoomById";
import getUserById from "../utils/getUserById";
import { queryClient } from "../utils/queryClient";

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
    text: string;
    selectedReservation: ReservationT | null;
};

export default function FullScreenActionDialog({
    isOpen,
    setIsOpen,
    text,
    selectedReservation,
}: Props) {
    const handleClickOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        createMutation.reset();
        setIsOpen(false);
    };

    const { roomList, userList, reservationList, loggedUser } =
        React.useContext(StateContext);

    const [formName, setFormName] = useState("");

    const [formRoom, setFormRoom] = useState<RoomT | null>(null);

    const [formStartDay, setFormStartDay] = useState<Dayjs | null>(dayjs());

    const [formIsOneDay, setFormIsOneDay] = useState(true);

    const [formEndDay, setFormEndDay] = useState<Dayjs | null>(dayjs());

    const [formReservatedTo, setFormReservatedTo] = useState<UserT | null>(
        null
    );

    const [formSchedule, setFormSchedule] =
        useState<boolean[][]>(baseInternalSchedule);

    React.useEffect(() => {
        if (selectedReservation) {
            console.log(selectedReservation);

            setFormName(selectedReservation.name);

            const room: RoomT = getRoomById(
                selectedReservation.roomId,
                roomList
            );
            setFormRoom(room);

            setFormStartDay(dayjs(selectedReservation.reservationStart));

            setFormEndDay(dayjs(selectedReservation.reservationEnd));

            if (
                dayjs(selectedReservation.reservationStart).isSame(
                    dayjs(selectedReservation.reservationEnd),
                    "day"
                )
            ) {
                setFormIsOneDay(true);
            } else {
                setFormIsOneDay(false);
            }

            const user: UserT = getUserById(
                selectedReservation.reservatedToId,
                userList
            );
            setFormReservatedTo(user);

            setFormSchedule(selectedReservation.schedule);
        }
    }, [selectedReservation]);

    const createMutation = useMutation({
        mutationFn: (header) => {
            return axios.post(
                "http://localhost:8080/reservation/create",
                header
            );
        },
        onSuccess: () => {
            //TODO setIsSnackBarOpen(true);
            handleClose();
            queryClient.invalidateQueries({queryKey: ['reservationListContext']})
        },
    });

    const editMutation = useMutation({
        mutationFn: (header) => {
            return axios.put(
                "http://localhost:8080/reservation/edit/"+selectedReservation?.id,
                header
            );
        },
        onSuccess: () => {
            //TODO setIsSnackBarOpen(true);
            handleClose();
            queryClient.invalidateQueries({queryKey: ['reservationListContext']})
        },
    });

    const onSubmit = () => {
        const formatedStart = formStartDay!
            .startOf("D")
            .format("YYYY-MM-DDTHH:mm:ss");
        let formatedEnd = formEndDay!.endOf("D").format("YYYY-MM-DDTHH:mm:ss");
        if (formIsOneDay) {
            formatedEnd = formStartDay!
                .endOf("D")
                .format("YYYY-MM-DDTHH:mm:ss");
        }


        const header = {
            name: formName,
            roomId: formRoom!.id,
            reservationStart: formatedStart,
            reservationEnd: formatedEnd,
            reservatedToId: formReservatedTo!.id,
            reservationResponsibleId: loggedUser.id,
            schedule: formSchedule,
        };


        if (selectedReservation) {
            editMutation.mutate(header);
        } else {
            createMutation.mutate(header);
        }
    };

    const deleteMutation = useMutation({
        mutationFn: () => {
            return axios.delete(
                "http://localhost:8080/reservation/delete/" +
                    selectedReservation?.id
            );
        },
        onSuccess: () => {
            //TODO setIsSnackBarOpen(true);
            handleClose();
            queryClient.invalidateQueries({queryKey: ['reservationListContext']})
        },
    });

    const onRemove = () => {
        deleteMutation.mutate();
    };

    return (
        <React.Fragment>
            <Dialog
                fullScreen
                open={isOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            {text.toUpperCase()}
                        </Typography>
                        <Button color="inherit" onClick={handleClose}>
                            cancelar
                        </Button>
                        <Button color="success" onClick={onSubmit}>
                            salvar
                        </Button>
                        {selectedReservation ? (
                            <Button color="error" onClick={onRemove}>
                                excluir
                            </Button>
                        ) : null}
                    </Toolbar>
                </AppBar>
                <Box sx={{ padding: 2, flexGrow: 1 }}>
                    <Grid container>
                        <Grid xs={5} paddingX={1}>
                            <TextField
                                id="outlined-controlled"
                                label="Nome da reserva"
                                value={formName}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setFormName(event.target.value);
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={5} paddingX={1}>
                            <Autocomplete
                                value={formRoom}
                                onChange={(
                                    event: any,
                                    newValue: RoomT | null
                                ) => {
                                    setFormRoom(newValue);
                                }}
                                id="controllable-states-demo"
                                options={roomList}
                                getOptionLabel={(room: RoomT) => {
                                    let roomN = "";
                                    if (room.roomNumber) {
                                        roomN = room.roomNumber;
                                    }
                                    return `${room.name} ${roomN}`;
                                }}
                                sx={{ flexGrow: 1 }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Sala reservada"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid xs={2} paddingX={1}>
                            <TextField
                                id="outlined-controlled"
                                label="Supervisor da reserva"
                                value={loggedUser?.name}
                                disabled
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={3} paddingX={1} paddingTop={1}>
                            <DemoContainer components={["DatePicker"]}>
                                <DatePicker
                                    label="Inicio da reserva"
                                    value={formStartDay}
                                    onChange={(newValue) =>
                                        setFormStartDay(newValue)
                                    }
                                    disablePast
                                    sx={{ width: "100%" }}
                                />
                            </DemoContainer>
                        </Grid>
                        <Grid xs={1.5} paddingX={0} paddingTop={1}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formIsOneDay}
                                        onChange={(event) => {
                                            setFormIsOneDay(
                                                event.target.checked
                                            );
                                        }}
                                        inputProps={{
                                            "aria-label": "controlled",
                                        }}
                                    />
                                }
                                labelPlacement="bottom"
                                label="Reserva unitária"
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        {formIsOneDay == true ? (
                            <Grid xs={3} paddingX={1} paddingTop={1}>
                                <DemoContainer components={["DatePicker"]}>
                                    <DatePicker
                                        label="Inicio da reserva"
                                        value={formEndDay}
                                        disabled
                                        sx={{ width: "100%" }}
                                    />
                                </DemoContainer>
                            </Grid>
                        ) : (
                            <Grid xs={3} paddingX={1} paddingTop={1}>
                                <DemoContainer components={["DatePicker"]}>
                                    <DatePicker
                                        label="Inicio da reserva"
                                        value={formEndDay}
                                        onChange={(newValue) =>
                                            setFormEndDay(newValue)
                                        }
                                        disablePast
                                        sx={{ width: "100%" }}
                                    />
                                </DemoContainer>
                            </Grid>
                        )}
                        <Grid xs paddingX={1} paddingTop={2}>
                            <Autocomplete
                                value={formReservatedTo}
                                onChange={(
                                    event: any,
                                    newValue: UserT | null
                                ) => {
                                    setFormReservatedTo(newValue);
                                }}
                                id="controllable-states-demo"
                                options={userList}
                                getOptionLabel={(user: UserT) => {
                                    return user.name;
                                }}
                                sx={{ flexGrow: 1 }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Sala reservada para..."
                                    />
                                )}
                            />
                        </Grid>
                        <FullScreenTableDialog
                            formSchedule={formSchedule}
                            setFormSchedule={setFormSchedule}
                        />
                    </Grid>
                </Box>
            </Dialog>
        </React.Fragment>
    );
}
