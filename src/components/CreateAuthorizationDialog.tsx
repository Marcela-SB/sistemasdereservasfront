import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { StateContext } from "../context/ReactContext";
import { useState } from "react";
import {
    Autocomplete,
    Box,
    Checkbox,
    Chip,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    Stack,
    Switch,
    TextField,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import { RoomT } from "../types/RoomT";
import ConfirmationDialog from "./ConfirmationDialog";
import {
    CheckBoxOutlineBlankOutlined,
    CheckBoxOutlined,
    Close,
} from "@mui/icons-material";
import DraggablePaper from "./DraggablePaper";
import PaperComponent from "./PaperComponent";
import { AuthorizationT } from "../types/AuthorizationT";
import getRoomById from "../utils/getRoomById";
import { DatePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { UserT } from "../types/UserT";
import getUserById from "../utils/getUserById";
import dayjs, { Dayjs } from "dayjs";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const inputNumberStyle = {
    "& input[type=number]": {
        "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
    },
};

type Props = {
    isOpen: boolean;
    setIsOpen: (b: boolean) => void;
    selectedAuthorization: AuthorizationT | null;
    setSelectedAuthorization: (r: AuthorizationT | null) => void;
};

export default function CreateAuthorizationDialog({
    isOpen,
    setIsOpen,
    selectedAuthorization,
    setSelectedAuthorization,
}: Props) {
    const handleClose = () => {
        createMutation.reset();
        setSelectedAuthorization(null);

        setAuthorizaredToProfessorId(null);
        setAuthorizatioRoomsId([]);
        setAuthorizaredToId([]);
        setAuthorizationStart(dayjs());
        setAuthorizationEnd(dayjs());
        setComment(null);

        setIsDaily(true);

        setIsOpen(false);
        setIsConfirmationDOpen(false);
    };

    const {
        setSnackBarText,
        setSnackBarSeverity,
        roomList,
        userList,
        loggedUser,
    } = React.useContext(StateContext);

    const [authorizationRoomsId, setAuthorizatioRoomsId] = useState<RoomT[]>(
        []
    );

    const [authorizaredToProfessorId, setAuthorizaredToProfessorId] =
        useState<UserT | null>(null);

    const [authorizaredToId, setAuthorizaredToId] = useState<UserT[]>([]);

    const [authorizationStart, setAuthorizationStart] = useState<Dayjs | null>(
        dayjs()
    );

    const [authorizationEnd, setAuthorizationEnd] = useState<Dayjs | null>(
        dayjs()
    );

    const [comment, setComment] = useState<string | null>(null);

    const [isDaily, setIsDaily] = useState(false);

    const [isConfirmationDOpen, setIsConfirmationDOpen] = useState(false);

    React.useEffect(() => {
        if (selectedAuthorization) {
            console.log(selectedAuthorization);

            const roomListToPush: RoomT[] = [];
            for (const roomId of selectedAuthorization.roomsId) {
                const room: RoomT = getRoomById(roomId, roomList);
                roomListToPush.push(room);
            }
            setAuthorizatioRoomsId(roomListToPush);

            const userListToPush: UserT[] = [];
            for (const userId of selectedAuthorization.authorizatedToId) {
                const user: UserT = getUserById(userId, userList);
                userListToPush.push(user);
            }
            setAuthorizaredToId(userListToPush);

            const userProff: UserT = getUserById(
                selectedAuthorization.authorizationProfessorId,
                userList
            );
            setAuthorizaredToProfessorId(userProff);

            setAuthorizationStart(
                dayjs(selectedAuthorization.authorizationStart)
            );
            setAuthorizationEnd(dayjs(selectedAuthorization.authorizationEnd));

            if (
                dayjs(selectedAuthorization.authorizationStart).isSame(
                    dayjs(selectedAuthorization.authorizationEnd),
                    "day"
                )
            ) {
                setIsDaily(true);
            } else {
                setIsDaily(false);
            }

            setComment(selectedAuthorization.comment);
        }
    }, [selectedAuthorization]);

    const createMutation = useMutation({
        mutationFn: (header) => {
            return axiosInstance.post("authorization/create", header);
        },
        onSuccess: () => {
            handleClose();
            queryClient.invalidateQueries({
                queryKey: ["authorizationListContext"],
            });
            setSnackBarText("Autorização criada com sucesso");
            setSnackBarSeverity("success");
        },
        onError: (error) => {
            setSnackBarText(error.response.data);
            setSnackBarSeverity("error");
        },
    });

    const editMutation = useMutation({
        mutationFn: (header) => {
            return axiosInstance.put(
                "authorization/edit/" + selectedAuthorization?.id,
                header
            );
        },
        onSuccess: () => {
            handleClose();
            queryClient.invalidateQueries({
                queryKey: ["authorizationListContext"],
            });
            setSnackBarText("Autorização editada com sucesso");
            setSnackBarSeverity("success");
        },
        onError: (error) => {
            setSnackBarText(error.response.data);
            setSnackBarSeverity("error");
        },
    });

    const onSubmit = () => {
        const formatedStart = authorizationStart!
            .startOf("D")
            .format("YYYY-MM-DDTHH:mm:ss");
        let formatedEnd = authorizationEnd!
            .endOf("D")
            .format("YYYY-MM-DDTHH:mm:ss");
        if (isDaily) {
            formatedEnd = authorizationStart!
                .endOf("D")
                .format("YYYY-MM-DDTHH:mm:ss");
        }

        const roomIdList: string[] = [];
        for (const room of authorizationRoomsId) {
            roomIdList.push(room.id);
        }

        const userIdList: string[] = [];
        for (const user of authorizaredToId) {
            userIdList.push(user.id);
        }

        const header = {
            roomsId: roomIdList,
            authorizatedToId: userIdList,
            authorizationProfessorId: authorizaredToProfessorId.id,
            authorizationResponsibleId: loggedUser.id,
            authorizationStart: formatedStart,
            authorizationEnd: formatedEnd,
            comment: comment,
        };

        console.log(header);

        if (selectedAuthorization) {
            editMutation.mutate(header);
        } else {
            createMutation.mutate(header);
        }
    };

    const deleteMutation = useMutation({
        mutationFn: () => {
            return axiosInstance.delete(
                "authorization/delete/" + selectedAuthorization?.id
            );
        },
        onSuccess: () => {
            handleClose();
            queryClient.invalidateQueries({
                queryKey: ["authorizationListContext"],
            });
            setSnackBarText("Autorização removida com sucesso");
            setSnackBarSeverity("success");
        },
        onError: (error) => {
            setSnackBarText(error.response.data);
            setSnackBarSeverity("error");
        },
    });

    const onRemove = () => {
        deleteMutation.mutate();
    };

    const [isRequestPending, setIsRequestPending] = useState(false);
    React.useEffect(() => {
        setIsRequestPending(
            createMutation.isPending ||
                editMutation.isPending ||
                deleteMutation.isPending
        );
    }, [createMutation, editMutation, deleteMutation]);

    return (
        <>
            <DraggablePaper>
                <Dialog
                    open={isOpen}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                    fullWidth
                    maxWidth="lg"
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
                        width: "85rem",
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
                                {selectedAuthorization
                                    ? "Consultar espaço"
                                    : "Novo espaço"}
                            </Typography>
                            <Stack direction={"row"} spacing={1}>
                                <Button
                                    color="success"
                                    onClick={onSubmit}
                                    disabled={isRequestPending}
                                    variant="contained"
                                    sx={{ fontWeight: "600" }}
                                >
                                    {selectedAuthorization
                                        ? "Editar"
                                        : "Salvar"}
                                </Button>
                                {selectedAuthorization ? (
                                    <Button
                                        color="error"
                                        onClick={() => {
                                            setIsConfirmationDOpen(true);
                                        }}
                                        disabled={isRequestPending}
                                        variant="contained"
                                        sx={{ fontWeight: "600" }}
                                    >
                                        excluir
                                    </Button>
                                ) : null}
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={handleClose}
                                    disabled={isRequestPending}
                                    aria-label="close"
                                >
                                    <Close />
                                </IconButton>
                            </Stack>
                        </Toolbar>
                    </AppBar>
                    <Box sx={{ padding: 2, flexGrow: 1 }}>
                        <Stack spacing={2}>
                            <Stack
                                direction={"row"}
                                spacing={2}
                                justifyContent={"space-evenly"}
                            >
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    id="controllable-states-demo"
                                    options={roomList}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Sala reservada"
                                            sx={{ flexWrap: "nowrap" }}
                                        />
                                    )}
                                    limitTags={1}
                                    renderTags={(value, getTagProps) =>
                                        value.map((room, index) => {
                                            const { key, ...tagProps } =
                                                getTagProps({ index });
                                            if (index > 0) return;
                                            return (
                                                <Chip
                                                    key={key}
                                                    variant="outlined"
                                                    label={room.name}
                                                    size="small"
                                                    {...tagProps}
                                                />
                                            );
                                        })
                                    }
                                    getOptionLabel={(room: RoomT) => {
                                        let roomN = "";
                                        if (room.roomNumber) {
                                            roomN = room.roomNumber;
                                        }
                                        return `${room.name} ${roomN}`;
                                    }}
                                    value={authorizationRoomsId}
                                    onChange={(event, values) => {
                                        setAuthorizatioRoomsId(values);
                                    }}
                                    renderOption={(
                                        props,
                                        room,
                                        { selected }
                                    ) => {
                                        const { key, ...optionProps } = props;
                                        let roomN = "";
                                        if (room.roomNumber) {
                                            roomN = room.roomNumber;
                                        }
                                        return (
                                            <li
                                                key={key}
                                                {...optionProps}
                                                style={{}}
                                            >
                                                <Checkbox
                                                    icon={
                                                        <CheckBoxOutlineBlankOutlined fontSize="small" />
                                                    }
                                                    
                                                    checkedIcon={
                                                        <CheckBoxOutlined fontSize="small" />
                                                    }
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                />
                                                {room.name} {roomN}
                                            </li>
                                        );
                                    }}
                                />
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    id="controllable-states-demo"
                                    options={userList}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Autorização para..."
                                            sx={{ flexWrap: "nowrap" }}
                                        />
                                    )}
                                    limitTags={1}
                                    renderTags={(value, getTagProps) =>
                                        value.map((user, index) => {
                                            const { key, ...tagProps } =
                                                getTagProps({ index });
                                            if (index > 0) return;
                                            return (
                                                <Chip
                                                    key={key}
                                                    variant="outlined"
                                                    label={user.name}
                                                    size="small"
                                                    {...tagProps}
                                                />
                                            );
                                        })
                                    }
                                    getOptionLabel={(user: UserT) => {
                                        return user.name;
                                    }}
                                    value={authorizaredToId}
                                    onChange={(event, values) => {
                                        setAuthorizaredToId(values);
                                    }}
                                    renderOption={(
                                        props,
                                        user,
                                        { selected }
                                    ) => {
                                        const { key, ...optionProps } = props;
                                        return (
                                            <li
                                                key={key}
                                                {...optionProps}
                                                style={{}}
                                            >
                                                <Checkbox
                                                    icon={
                                                        <CheckBoxOutlineBlankOutlined fontSize="small" />
                                                    }
                                                    checkedIcon={
                                                        <CheckBoxOutlined fontSize="small" />
                                                    }
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                />
                                                {user.name}
                                            </li>
                                        );
                                    }}
                                />

                                <Autocomplete
                                    fullWidth
                                    value={authorizaredToProfessorId}
                                    onChange={(
                                        _event: any,
                                        newValue: UserT | null
                                    ) => {
                                        setAuthorizaredToProfessorId(newValue);
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
                                            label="Professor responsavel"
                                        />
                                    )}
                                />
                                <TextField
                                    id="outlined-controlled"
                                    label="Supervisor da autorização"
                                    value={loggedUser?.name}
                                    disabled
                                    fullWidth
                                />
                            </Stack>
                            <Stack direction={"row"} spacing={2}>
                                <DemoContainer
                                    components={["DatePicker"]}
                                    sx={{ width: "100%" }}
                                >
                                    <DatePicker
                                        label="Inicio da autorização"
                                        value={authorizationStart}
                                        onChange={(newValue) =>
                                            setAuthorizationStart(newValue)
                                        }
                                        sx={{ width: "100%" }}
                                    />
                                </DemoContainer>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isDaily}
                                            onChange={(event) => {
                                                setIsDaily(
                                                    event.target.checked
                                                );
                                            }}
                                            inputProps={{
                                                "aria-label": "controlled",
                                            }}
                                        />
                                    }
                                    labelPlacement="top"
                                    label="Autorização diária"
                                    sx={{ width: "100%", marginX: 0 }}
                                />
                                {isDaily == true ? (
                                    <DemoContainer
                                        components={["DatePicker"]}
                                        sx={{ width: "100%" }}
                                    >
                                        <DatePicker
                                            label="Final da autorização"
                                            value={authorizationEnd}
                                            disabled
                                            sx={{ width: "100%" }}
                                        />
                                    </DemoContainer>
                                ) : (
                                    <DemoContainer
                                        components={["DatePicker"]}
                                        sx={{ width: "100%" }}
                                    >
                                        <DatePicker
                                            label="Final da reserva"
                                            value={authorizationEnd}
                                            onChange={(newValue) =>
                                                setAuthorizationEnd(newValue)
                                            }
                                            sx={{ width: "100%" }}
                                        />
                                    </DemoContainer>
                                )}
                            </Stack>
                            <TextField
                                label="Observações"
                                value={comment}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setComment(event.target.value);
                                }}
                                multiline
                                fullWidth
                                rows={4}
                            />
                        </Stack>
                    </Box>
                </Dialog>
            </DraggablePaper>
            {selectedAuthorization ? (
                <>
                    <ConfirmationDialog
                        setIsOpen={setIsConfirmationDOpen}
                        isOpen={isConfirmationDOpen}
                        toExclude={"essa autorização"}
                        excludeFunction={onRemove}
                    />
                </>
            ) : null}
        </>
    );
}
