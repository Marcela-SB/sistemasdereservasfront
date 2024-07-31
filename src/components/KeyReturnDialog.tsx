import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

import { StateContext } from "../context/ReactContext";
import {
    Autocomplete,
    Container,
    IconButton,
    Stack,
    TextField,
} from "@mui/material";
import { useState } from "react";
import { RoomT } from "../types/RoomT";
import dayjs, { Dayjs } from "dayjs";
import { UserT } from "../types/UserT";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { TimePicker } from "@mui/x-date-pickers";
import { KeyT } from "../types/KeyDeliveryT";
import axiosInstance from "../utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import KeyScrollableList from "./KeyScrollableList";
import getRoomById from "../utils/getRoomById";
import getUserById from "../utils/getUserById";
import CheckUserDialog from "./CheckUserDialog";
import { queryClient } from "../utils/queryClient";
import { Close } from "@mui/icons-material";
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

export default function KeyReturnDialog({ isOpen, setIsOpen }: Props) {
    const { roomList, userList } = React.useContext(StateContext);

    const handleClose = () => {
        setIsOpen(false);
        setFormReservatedTo(null);
        setFormResponsible(null);
        setSelectedKey(null);
        setFormReturnTimePrevision(dayjs());
        setFormReturnedBy(null);
        setFormRoom(null);
    };

    const [selectedKey, setSelectedKey] = useState<KeyT | null>(null);

    const [selectedKeyList, setSelectedKeyList] = useState<KeyT[]>([]);

    const [formRoom, setFormRoom] = useState<RoomT | null>(null);

    const [formReturnTimePrevision, setFormReturnTimePrevision] =
        useState<Dayjs | null>(dayjs());

    const [formReservatedTo, setFormReservatedTo] = useState<UserT | null>(
        null
    );

    const [formResponsible, setFormResponsible] = useState<UserT | null>(null);

    const [formReturnedBy, setFormReturnedBy] = useState<UserT | null>(null);

    const [checkDialogIsOpen, setCheckDialogIsOpen] = useState(false);

    const [checkSucess, setCheckSucess] = useState(false);

    const editMutation = useMutation({
        mutationFn: (header) => {
            return axiosInstance.put("keydelivery/edit/" + header.id, header);
        },
        onSuccess: () => {
            setSnackBarText("Devolução de chave criada com sucesso");
            setSnackBarSeverity("success");
            handleClose();
            queryClient.invalidateQueries({ queryKey: ["keyListContext"] });
        },
    });

    React.useEffect(() => {
        if (selectedKey) {
            console.log(selectedKey);

            const room: RoomT = getRoomById(selectedKey.roomId, roomList);
            setFormRoom(room);

            setFormReturnTimePrevision(dayjs(selectedKey.returnPrevision));

            const user: UserT = getUserById(
                selectedKey.responsibleForTheKeyId,
                userList
            );
            setFormReservatedTo(user);

            const userResponsible: UserT = getUserById(
                selectedKey.withdrawResponsibleId,
                userList
            );
            setFormResponsible(userResponsible);
        }
    }, [selectedKey]);

    const submitReturn = () => {
        setCheckDialogIsOpen(true);
    };

    React.useEffect(() => {
        if (checkSucess) {
            const returnTime = dayjs().format("YYYY-MM-DDTHH:mm:ss");

            selectedKeyList.forEach((key) => {
                const header = {
                    isKeyReturned: true,
                    keyReturnedById: formReturnedBy?.id,
                    returnTime: returnTime,
                    id: key.id,
                };
                editMutation.mutate(header);
            });

            setCheckSucess(false);
        }
    }, [checkSucess]);

    const [isRequestPending, setIsRequestPending] = useState(false);
    React.useEffect(() => {
        setIsRequestPending(editMutation.isPending);
    }, [editMutation]);

    return (
        <>
            <DraggablePaper>
                <Dialog
                    open={isOpen}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                    maxWidth="md"
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
                        className="draggable-dialog"
                        sx={{ position: "relative" }}
                    >
                        <Toolbar>
                            <Typography
                                sx={{ mx: 30, flex: 1 }}
                                variant="h6"
                                component="div"
                                textAlign={"center"}
                                noWrap
                            >
                                DEVOLUÇÃO DE CHAVE
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
                    <Container
                        sx={{
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Stack direction={"row"}>
                            <KeyScrollableList
                                setSelectedKey={setSelectedKey}
                                selectedKeyList={selectedKeyList}
                                setSelectedKeyList={setSelectedKeyList}
                            />
                            <Stack
                                direction={"column"}
                                justifyContent={"space-between"}
                                marginX={2}
                                gap={2}
                                marginTop={2}
                            >
                                <Autocomplete
                                    value={formRoom}
                                    disabled
                                    id="controllable-states-demo"
                                    options={roomList}
                                    getOptionLabel={(room: RoomT) => {
                                        let roomN = "";
                                        if (room.roomNumber) {
                                            roomN = room.roomNumber;
                                        }
                                        return `${room.name} ${roomN}`;
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Sala reservada"
                                        />
                                    )}
                                />
                                <Autocomplete
                                    value={formReservatedTo}
                                    disabled
                                    id="controllable-states-demo"
                                    options={userList}
                                    getOptionLabel={(user: UserT) => {
                                        return user.name;
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Sala reservada para"
                                        />
                                    )}
                                />

                                <Autocomplete
                                    value={formResponsible}
                                    disabled
                                    id="controllable-states-demo"
                                    options={userList}
                                    getOptionLabel={(user: UserT) => {
                                        return user.name;
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Supervisor da reserva"
                                        />
                                    )}
                                />

                                <DemoContainer components={["TimePicker"]}>
                                    <TimePicker
                                        label="Previsão de retorno"
                                        value={formReturnTimePrevision}
                                        onChange={(newValue) =>
                                            setFormReturnTimePrevision(newValue)
                                        }
                                        disabled
                                        sx={{ width: "100%" }}
                                    />
                                </DemoContainer>
                                <Autocomplete
                                    fullWidth
                                    value={formReturnedBy}
                                    onChange={(
                                        _event: any,
                                        newValue: UserT | null
                                    ) => {
                                        setFormReturnedBy(newValue);
                                    }}
                                    id="controllable-states-demo"
                                    options={userList}
                                    getOptionLabel={(user: UserT) => {
                                        return user.name;
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Chave retornada por..."
                                        />
                                    )}
                                />

                                <Button
                                    variant="contained"
                                    sx={{ marginY: 2, flex:1, marginRight:1.5, height:'100%'}}
                                    onClick={submitReturn}
                                    disabled={isRequestPending}
                                    fullWidth
                                >
                                    Criar devolução
                                </Button>
                            </Stack>
                        </Stack>

                    </Container>
                </Dialog>
            </DraggablePaper>
            <DraggablePaper>
                <CheckUserDialog
                    isOpen={checkDialogIsOpen}
                    setIsOpen={setCheckDialogIsOpen}
                    chekedUser={formReturnedBy}
                    setCheckSucess={setCheckSucess}
                />
            </DraggablePaper>
        </>
    );
}
