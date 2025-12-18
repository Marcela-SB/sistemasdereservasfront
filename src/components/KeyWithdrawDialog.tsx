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
    FormControl,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    Stack,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { RoomT } from "../types/RoomT";
import dayjs, { Dayjs } from "dayjs";
import { UserT } from "../types/UserT";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { ClearIcon, TimePicker } from "@mui/x-date-pickers";
import axiosInstance from "../utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import CheckUserDialog from "./CheckUserDialog";
import { Close, Send } from "@mui/icons-material";
import DraggablePaper from "./DraggablePaper";
import PaperComponent from "./PaperComponent";
import roomDynamicSort from "../utils/roomDynamicSort.ts";
import KeyWithdrawRoomList from "./KeyWithdrawRoomList.tsx";
import { useEnterSubmit } from "../utils/enterKeyButtonActivate.ts";

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
    const {
        roomList,
        activeUsersList,
        loggedUser,
        setSnackBarText,
        setSnackBarSeverity,
    } = React.useContext(StateContext);

    const handleClose: DialogProps["onClose"] = (event, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsOpen(false);
        cleanInputs();
    };

    const cleanInputs = () => {
        setFormRoom([]);
        setFormReturnTime(dayjs());
        setFormReservatedTo(null);
        setFormResponsible(null);
        setSelectedInternalReservation(null);
    };

    const [searchedText, setSearchedText] = useState<string>("");

    const [formRoom, setFormRoom] = useState<RoomT[]>([]);

    const [formReturnTime, setFormReturnTime] = useState<Dayjs | null>(null);

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
            queryClient.invalidateQueries({ queryKey: ["keyListContext"] });
            setSnackBarText("Entrega de chave criada com sucesso");
            setSnackBarSeverity("success");
            setFormReservatedTo(null);
            cleanInputs();
        },
        onError: (error) => {
            setSnackBarText(error.response.data);
            setSnackBarSeverity("error");
        },
    });

    const submitWithdraw = () => {
        if (formReservatedTo) {
            setCheckDialogIsOpen(true);
        } else {
            setSnackBarText("Preencha todos os campos");
            setSnackBarSeverity("error");
        }
    };

    const [scrollableRoomArray, setScrollableRoomArray] = useState<RoomT[]>([]);

    const [filteredRoomArray, setFilteredRoomArray] = useState<RoomT[]>([]);

    useEffect(() => {
        if (roomList) {
            const filteredRoomList = roomList
                ?.filter((room: RoomT) => {
                    //if no input the return the original
                    if (searchedText === "") {
                        return room;
                    }

                    //return the item which contains the room input
                    else {
                        return room.name?.toLowerCase().includes(searchedText.toLowerCase());
                    }
                })
                .sort(roomDynamicSort());
            setFilteredRoomArray(filteredRoomList);

            setScrollableRoomArray(roomList.sort(roomDynamicSort()));
        }
    }, [searchedText, roomList]);

    React.useEffect(() => {
        if (checkSucess) {
            const formatedStart = formReturnTime?.format("YYYY-MM-DDTHH:mm:ss");

            const headersList: object[] = [];


            formRoom.forEach((room) => {
                const header = {
                    roomId: room.id,
                    withdrawResponsibleId: loggedUser.id,
                    responsibleForTheKeyId: formReservatedTo?.id,
                    withdrawTime: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
                    isKeyReturned: false,
                };
                if (Object.values(header).every((value) => value != null)) {
                    if (formReturnTime) {
                        header.returnPrevision = formReturnTime?.format(
                            "YYYY-MM-DDTHH:mm:ss"
                        );
                    } else {
                        header.returnPrevision = null;
                    }
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

    const dialogRef = React.useRef<HTMLDivElement>(null);
    const submitButtonRef = React.useRef<HTMLButtonElement>(null);
    useEnterSubmit(isOpen, submitButtonRef, dialogRef);

    return (
        <DraggablePaper>
            <Dialog
                ref={dialogRef}
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
                    width: "42rem",
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
                            textAlign={"center"}
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
                    <Stack
                        direction={"column"}
                        sx={{
                            border: "solid 1px rgba(0, 0, 0, 0.26)",
                            borderRadius: ".5rem .5rem  2% 2%",
                        }}
                    >
                        <List sx={{ overflow: "auto", height: "18rem" }}>
                            {scrollableRoomArray?.map((room, index) => {
                                let visible = false;
                                if (
                                    filteredRoomArray.some(
                                        (filteredRoom) =>
                                            filteredRoom.id == room.id
                                    )
                                ) {
                                    visible = true;
                                }

                                return (
                                    <KeyWithdrawRoomList
                                        changeRoomList={changeRoomList}
                                        room={room}
                                        checkSucess={checkSucess}
                                        key={room.name + "_" + index}
                                        visible={visible}
                                    />
                                );
                            })}
                        </List>
                        <FormControl>
                            <TextField
                                label="Nome do espaço"
                                placeholder="Digite o nome do espaço"
                                sx={{
                                    margin: 2,
                                    borderRadius: 6,
                                }}
                                value={searchedText}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setSearchedText(event.target.value);
                                }}
                            ></TextField>
                        </FormControl>
                    </Stack>
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
                            options={activeUsersList}
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
                                slotProps={{ field: { clearable: true } }}
                            />
                        </DemoContainer>
                    </Stack>
                </Stack>

                <CheckUserDialog
                    isOpen={checkDialogIsOpen}
                    setIsOpen={setCheckDialogIsOpen}
                    chekedUser={formReservatedTo}
                    setCheckSucess={setCheckSucess}
                    info= {{
                        sala: formRoom?.name,
                        reservadoPara: formReservatedTo?.name,
                        reservadoPor: formResponsible?.name,
                    }}
                />
                <Button
                    ref={submitButtonRef}
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
