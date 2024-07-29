import * as React from "react";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { ReservationT } from "../types/ReservationT";
import { StateContext } from "../context/ReactContext";
import {
    Autocomplete,
    Checkbox,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    Stack,
    TextField,
} from "@mui/material";
import { useState } from "react";
import { RoomT } from "../types/RoomT";
import dayjs, { Dayjs } from "dayjs";
import { UserT } from "../types/UserT";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { TimePicker } from "@mui/x-date-pickers";
import axiosInstance from "../utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import CheckUserDialog from "./CheckUserDialog";
import { Close, Send } from "@mui/icons-material";
import DraggablePaper from "./DraggablePaper";
import PaperComponent from "./PaperComponent";

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
};

export default function KeyWithdraDialog({ isOpen, setIsOpen }: Props) {
    const { roomList, userList, loggedUser, setSnackBarText, setSnackBarSeverity } = React.useContext(StateContext);

    const handleClose: DialogProps["onClose"] = (event, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsOpen(false);
        setFormRoom([]);
        setFormReturnTime(dayjs());
        setFormReservatedTo(null);
        setFormResponsible(null);
        setSelectedInternalReservation(null);
    };

    const [formRoom, setFormRoom] = useState<RoomT[]>([]);

    const [formReturnTime, setFormReturnTime] = useState<Dayjs | null>(dayjs());

    const [formReservatedTo, setFormReservatedTo] = useState<UserT | null>(
        null
    );

    const [formResponsible, setFormResponsible] = useState<UserT | null>(null);

    const [selectedInternalReservation, setSelectedInternalReservation] =
        useState<ReservationT | null>(null);

    const [checkDialogIsOpen, setCheckDialogIsOpen] = useState(false);

    const [checkSucess, setCheckSucess] = useState(false);

    const createMutation = useMutation({
        mutationFn: (header) => {
            return axiosInstance.post("keydelivery/create", header);
        },
        onSuccess: () => {
            handleClose();
            queryClient.invalidateQueries({ queryKey: ["keyListContext"] });
            setSnackBarText("Entrega de chave criada com sucesso");
            setSnackBarSeverity("success");
        },
        onError: (error) => {
            setSnackBarText(error.response.data);
            setSnackBarSeverity("error");
        },
    });

    const submitWithdraw = () => {
        if(formReservatedTo) {
            setCheckDialogIsOpen(true);
        } else {
            setSnackBarText("Preencha todos os campos");
            setSnackBarSeverity("error");
        }
    };

    const [scrollableRoomArray, setScrollableRoomArray] = useState<RoomT[]>([]);

    React.useEffect(() => {
        if (roomList) {
            const holder = [...roomList];
            holder.sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            });
            setScrollableRoomArray(holder);
        }
    }, [roomList]);

    React.useEffect(() => {
        if (checkSucess) {
            const formatedStart = formReturnTime!.format("YYYY-MM-DDTHH:mm:ss");

            const headersList: object[] = [];



            formRoom.forEach((room) => {

                const header = {
                    roomId: room.id,
                    returnPrevision: formatedStart,
                    withdrawResponsibleId: loggedUser.id,
                    responsibleForTheKeyId: formReservatedTo?.id,
                    withdrawTime: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
                    isKeyReturned: false,
                };
                if(Object.values(header).every((value) => value != null)) {
                    headersList.push(header);
                    createMutation.mutate(header);
                } else {
                    setSnackBarText("Preencha todos os campos");
                    setSnackBarSeverity("error");
                }

            });

            setCheckSucess(false);
        }
    }, [checkSucess]);

    const changeRoomList = (room: RoomT) => {
        const holder = formRoom;

        const roomIndex = holder?.findIndex(
            (holderRoom) => holderRoom.id == room.id
        );

        if (roomIndex > -1) {
            holder?.splice(roomIndex, 1);
        } else {
            holder?.push(room);
        }
        setFormRoom(holder);
    };

    return (
        <DraggablePaper>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
                fullWidth
                maxWidth="sm"
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
                    width:'42rem',
                }}
            >
                <AppBar
                    sx={{ position: "relative" }}
                    className="draggable-dialog"
                >
                    <Toolbar>
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            variant="h6"
                            component="div"
                            textAlign={'center'}
                        >
                            RETIRADA DE CHAVE
                        </Typography>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <Close />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    marginX={2}
                    gap={2}
                    marginTop={2}
                >
                    <List sx={{ overflow: "auto", maxHeight: "24rem" }}>
                        {scrollableRoomArray?.map((room) => {
                            return (
                                <>
                                    <ListItem key={`modroomlist-${room.id}`}>
                                        {room.name} {room.roomNumber}
                                        <ListItemSecondaryAction>
                                            <Checkbox
                                                onChange={() => {
                                                    changeRoomList(room);
                                                }}
                                            ></Checkbox>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Divider
                                        key={`modroomlistdivider-${room.id}`}
                                        variant="middle"
                                    />
                                </>
                            );
                        })}
                    </List>
                    <Stack
                        direction={"column"}
                        justifyContent={"space-evenly"}
                        gap={4}
                    >
                        <Autocomplete
                            value={formReservatedTo}
                            onChange={(_event: any, newValue: UserT | null) => {
                                setFormReservatedTo(newValue);
                            }}
                            id="controllable-states-demo"
                            options={userList}
                            getOptionLabel={(user: UserT) => {
                                return user.name;
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Sala reservada para..."
                                />
                            )}
                        />
                        <TextField
                            id="outlined-controlled"
                            label="Supervisor da reserva"
                            value={loggedUser?.name}
                            disabled
                            fullWidth
                        />

                        <DemoContainer components={["TimePicker"]}>
                            <TimePicker
                                label="Previsão de retorno"
                                value={formReturnTime}
                                onChange={(newValue) =>
                                    setFormReturnTime(newValue)
                                }
                                sx={{ width: "100%" }}
                            />
                        </DemoContainer>
                    </Stack>
                </Stack>

                <CheckUserDialog
                    isOpen={checkDialogIsOpen}
                    setIsOpen={setCheckDialogIsOpen}
                    chekedUser={formReservatedTo}
                    setCheckSucess={setCheckSucess}
                />
                <Button
                    variant="contained"
                    sx={{ marginX: 6, marginY: 2 }}
                    onClick={submitWithdraw}
                    disabled={createMutation.isPending}
                >
                    Criar retirada
                </Button>
            </Dialog>
        </DraggablePaper>
    );
}
