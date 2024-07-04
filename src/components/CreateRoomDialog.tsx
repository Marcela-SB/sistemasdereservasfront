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
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    Stack,
    TextField,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import { RoomT } from "../types/RoomT";
import ConfirmationDialog from "./ConfirmationDialog";

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

    const { setSnackBarText, setSnackBarSeverity } =
        React.useContext(StateContext);

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

    const [key, setKey] = useState(false);

    const [reservable, setReservable] = useState(false);

    const [isConfirmationDOpen, setIsConfirmationDOpen] = useState(false);

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

            setKey(selectedRoom.hasKey);
            setReservable(selectedRoom.reservable);
        }
    }, [selectedRoom]);

    const createMutation = useMutation({
        mutationFn: (header) => {
            return axiosInstance.post("room/create", header);
        },
        onSuccess: () => {
            handleClose();
            queryClient.invalidateQueries({ queryKey: ["roomListContext"] });
            setSnackBarText("Espaço criado com sucesso");
            setSnackBarSeverity("success");
        },
        onError: (error) => {
            setSnackBarText(error.response.data);
            setSnackBarSeverity("error");
        },
    });

    const editMutation = useMutation({
        mutationFn: (header) => {
            return axiosInstance.put("room/edit/" + selectedRoom?.id, header);
        },
        onSuccess: () => {
            handleClose();
            queryClient.invalidateQueries({ queryKey: ["roomListContext"] });
            setSnackBarText("Espaço editado com sucesso");
            setSnackBarSeverity("success");
        },
        onError: (error) => {
            setSnackBarText(error.response.data);
            setSnackBarSeverity("error");
        },
    });

    const isWhitespaceString = (str: string) => !str.replace(/\s/g, "").length;

    const onSubmit = () => {
        let submitedRNumber: string | null = null;

        if (formRNumber && !isWhitespaceString(formRNumber)) {
            submitedRNumber = formRNumber;
        }
        const header = {
            name: formName,
            roomNumber: submitedRNumber,
            capacity: formCapacity,
            chairQuantity: formChairQuantity,
            computerQuantity: formComputerQuantity,
            airConditioning: airConditioner,
            isAirConditioningWorking: isAirConditionerWorking,
            projector: projector,
            isProjectorWorking: isProjectorWorking,
            bigTables: bigTables,
            sinks: sinks,
            hasKey: key,
            reservable: reservable,
        };

        console.log(header);

        if (selectedRoom) {
            editMutation.mutate(header);
        } else {
            createMutation.mutate(header);
        }
    };

    const deleteMutation = useMutation({
        mutationFn: () => {
            return axiosInstance.delete("room/delete/" + selectedRoom?.id);
        },
        onSuccess: () => {
            handleClose();
            queryClient.invalidateQueries({ queryKey: ["roomListContext"] });
            setSnackBarText("Espaço removido com sucesso");
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
                            {selectedRoom ? "Consultar espaço" : "Novo espaço"}
                        </Typography>
                        <Stack direction={"row"} spacing={1} >
                            <Button
                                color="inherit"
                                onClick={handleClose}
                                disabled={isRequestPending}
                            >
                                voltar
                            </Button>
                            <Button
                                color="info"
                                onClick={handleClose}
                                disabled={isRequestPending}
                                variant="outlined"
                                sx={{ fontWeight: "600" }}
                            >
                                Historico
                            </Button>
                            <Button
                                color="success"
                                onClick={onSubmit}
                                disabled={isRequestPending}
                                variant="outlined"
                                sx={{ fontWeight: "600" }}
                            >
                                editar
                            </Button>
                            {selectedRoom ? (
                                <Button
                                    color="error"
                                    onClick={() => {
                                        setIsConfirmationDOpen(true);
                                    }}
                                    disabled={isRequestPending}
                                    variant="outlined"
                                    sx={{ fontWeight: "600" }}
                                >
                                    excluir
                                </Button>
                            ) : null}
                        </Stack>
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
                                Característica
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
                            <FormControlLabel
                                label="Possui chave"
                                control={
                                    <Checkbox
                                        checked={key}
                                        onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            setKey(event.target.checked);
                                        }}
                                    />
                                }
                            />
                            <FormControlLabel
                                label="Espaço reservavel"
                                control={
                                    <Checkbox
                                        checked={reservable}
                                        onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            setReservable(event.target.checked);
                                        }}
                                    />
                                }
                            />
                        </Stack>
                    </Stack>
                </Box>
                {selectedRoom ? (
                    <ConfirmationDialog
                        setIsOpen={setIsConfirmationDOpen}
                        isOpen={isConfirmationDOpen}
                        toExclude={selectedRoom.name}
                        excludeFunction={onRemove}
                    />
                ) : null}
            </Dialog>
        </React.Fragment>
    );
}
