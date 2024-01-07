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
import { UserT } from "../types/UserT";
import { baseInternalSchedule } from "../types/tableSchedules";
import {
    Autocomplete,
    Box,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Stack,
    Switch,
    TextField,
} from "@mui/material";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import InputMask from "react-input-mask";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { RoomT } from "../types/RoomT";

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
    selectedRoom: RoomT | null;
    setSelectedRoom: (r: RoomT | null) => void;
};

export default function CreateRoomDialog({
    isOpen,
    setIsOpen,
    selectedRoom,
    setSelectedRoom,
}: Props) {
    const handleClickOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        createMutation.reset();
        setSelectedRoom(null);
        setFormName("");
        setFormRNumber("");
        setFormCapacity(null);
        setFormChairQuantity(null);
        setFormComputerQuantity(null);

        setBigTables(false);
        setSinks(false);

        setAirConditioner(false);
        setIsAirConditionerWorking(false);

        setProjector(false);
        setIsProjectorWorking(false);
        
        setIsOpen(false);
    };

    const { roomList, userList, loggedUser } = React.useContext(StateContext);

    const [formName, setFormName] = useState("");

    const [formRNumber, setFormRNumber] = useState<string | null>("");

    const [formCapacity, setFormCapacity] = useState<number | null>(null);

    const [formChairQuantity, setFormChairQuantity] = useState<number | null>(
        null
    );
    const [formComputerQuantity, setFormComputerQuantity] = useState<
        number | null
    >(null);
    const [airConditioner, setAirConditioner] = useState(false);

    const [isAirConditionerWorking, setIsAirConditionerWorking] =
        useState(false);

    const [projector, setProjector] = useState(false);

    const [isProjectorWorking, setIsProjectorWorking] = useState(false);

    const [bigTables, setBigTables] = useState(false);

    const [sinks, setSinks] = useState(false);

    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const handleChangeAir = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAirConditioner(event.target.checked);
        if (event.target.checked == false) {
            setIsAirConditionerWorking(false);
        }
    };

    const handleChangeAirWorking = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setIsAirConditionerWorking(event.target.checked);
        if (event.target.checked) {
            setAirConditioner(true);
        }
    };

    const handleChangeProjector = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setProjector(event.target.checked);
        if (event.target.checked == false) {
            setIsProjectorWorking(false);
        }
    };

    const handleChangeProjectorWorking = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setIsProjectorWorking(event.target.checked);
        if (event.target.checked) {
            setProjector(true);
        }
    };

    React.useEffect(() => {
        if (selectedRoom) {
            setFormName(selectedRoom.name);
            setFormRNumber(selectedRoom.roomNumber);
            setFormCapacity(selectedRoom.capacity);
            setFormChairQuantity(selectedRoom.chairQuantity);
            setFormComputerQuantity(selectedRoom.computerQuantity);

            setBigTables(selectedRoom.bigTables);
            setSinks(selectedRoom.sinks);

            setAirConditioner(selectedRoom.airConditioning);
            setIsAirConditionerWorking(selectedRoom.isAirConditioningWorking);

            setProjector(selectedRoom.projector);
            setIsProjectorWorking(selectedRoom.isProjectorWorking);
        }
    }, [selectedRoom]);

    const createMutation = useMutation({
        mutationFn: (header) => {
            return axios.post("http://localhost:8080/user/create", header);
        },
        onSuccess: () => {
            //TODO setIsSnackBarOpen(true);
            handleClose();
            queryClient.invalidateQueries({ queryKey: ["userListContext"] });
        },
    });

    const editMutation = useMutation({
        mutationFn: (header) => {
            return axios.put(
                "http://localhost:8080/user/edit/" + selectedRoom?.id,
                header
            );
        },
        onSuccess: () => {
            //TODO setIsSnackBarOpen(true);
            handleClose();
            queryClient.invalidateQueries({ queryKey: ["userListContext"] });
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

        if (selectedRoom) {
            editMutation.mutate(header);
        } else {
            createMutation.mutate(header);
        }
    };

    const deleteMutation = useMutation({
        mutationFn: () => {
            return axios.delete(
                "http://localhost:8080/user/delete/" + selectedRoom?.id
            );
        },
        onSuccess: () => {
            //TODO setIsSnackBarOpen(true);
            handleClose();
            queryClient.invalidateQueries({ queryKey: ["userListContext"] });
        },
    });

    const onRemove = () => {
        deleteMutation.mutate();
    };

    return (
        <React.Fragment>
            <Dialog
                maxWidth={"md"}
                fullWidth
                open={isOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <Typography
                            sx={{ ml: 0, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            {selectedRoom ? "Modificar espaço" : "Novo espaço"}
                        </Typography>
                        <Button color="inherit" onClick={handleClose}>
                            cancelar
                        </Button>
                        <Button color="success" onClick={onSubmit}>
                            salvar
                        </Button>
                        {selectedRoom ? (
                            <Button color="error" onClick={onRemove}>
                                excluir
                            </Button>
                        ) : null}
                    </Toolbar>
                </AppBar>
                <Box sx={{ padding: 2, flexGrow: 1 }}>
                    <Stack
                        direction={"row"}
                        gap={3}
                        justifyContent={"space-around"}
                    >
                        <Stack
                            direction={"column"}
                            paddingTop={1}
                            gap={2}
                            sx={{ flexGrow: 1 }}
                        >
                            <TextField
                                label="Nome"
                                value={formName}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setFormName(event.target.value);
                                }}
                            ></TextField>
                            <TextField
                                label="Numero da sala"
                                value={formRNumber}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setFormRNumber(event.target.value);
                                }}
                            ></TextField>
                            <TextField
                                label="Capacidade da sala"
                                value={formCapacity}
                                type="number"
                                sx={inputNumberStyle}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setFormCapacity(
                                        event.target.value as unknown as number
                                    );
                                }}
                            ></TextField>

                            <TextField
                                label="Numero de cadeiras"
                                value={formChairQuantity}
                                type="number"
                                sx={inputNumberStyle}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setFormChairQuantity(
                                        event.target.value as unknown as number
                                    );
                                }}
                            ></TextField>

                            <TextField
                                label="Numero de computadores"
                                value={formComputerQuantity}
                                type="number"
                                sx={inputNumberStyle}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setFormComputerQuantity(
                                        event.target.value as unknown as number
                                    );
                                }}
                            ></TextField>
                        </Stack>
                        <Divider orientation="vertical" flexItem />
                        <Stack>
                            <Typography variant="h5" marginY={1}>
                                Atributos?????
                            </Typography>
                            <FormControlLabel
                                label="Mesas grandes"
                                control={
                                    <Checkbox
                                        checked={bigTables}
                                        onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            setBigTables(event.target.checked);
                                        }}
                                    />
                                }
                            />
                            <FormControlLabel
                                label="Pias"
                                control={
                                    <Checkbox
                                        checked={sinks}
                                        onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            setSinks(event.target.checked);
                                        }}
                                    />
                                }
                            />
                            <FormControlLabel
                                label="Ar-condicionado"
                                control={
                                    <Checkbox
                                        checked={airConditioner}
                                        onChange={handleChangeAir}
                                    />
                                }
                            />
                            <FormControlLabel
                                sx={{ ml: 3 }}
                                label="Ar-condicionado Funcional"
                                control={
                                    <Checkbox
                                        checked={isAirConditionerWorking}
                                        onChange={handleChangeAirWorking}
                                    />
                                }
                            />
                            <FormControlLabel
                                label="Projetor"
                                control={
                                    <Checkbox
                                        checked={projector}
                                        onChange={handleChangeProjector}
                                    />
                                }
                            />
                            <FormControlLabel
                                sx={{ ml: 3 }}
                                label="Projetor funcional"
                                control={
                                    <Checkbox
                                        checked={isProjectorWorking}
                                        onChange={handleChangeProjectorWorking}
                                    />
                                }
                            />
                        </Stack>
                    </Stack>
                </Box>
            </Dialog>
        </React.Fragment>
    );
}
