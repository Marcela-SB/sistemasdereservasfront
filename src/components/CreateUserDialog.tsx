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
import {
    Box,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import InputMask from "react-input-mask";
import { VisibilityOff, Visibility } from "@mui/icons-material";

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
    selectedUser: UserT | null;
    setSelectedUser: (user: UserT | null) => void;
};

export default function CreateUserDialog({
    isOpen,
    setIsOpen,
    selectedUser,
    setSelectedUser,
}: Props) {
    const handleClose = () => {
        createMutation.reset();
        setSelectedUser(null);
        setFormName("");
        setFormEmail("");
        setFormPassword("");
        setFormRegistration("");
        setFormUsername("");
        setFormRole("USER");
        setShowPassword(false);
        setIsOpen(false);
    };

    const { setSnackBarText, setSnackBarSeverity } =
        React.useContext(StateContext);

    const [formUsername, setFormUsername] = useState("");

    const [formName, setFormName] = useState("");

    const [formPassword, setFormPassword] = useState("");

    const [formEmail, setFormEmail] = useState("");

    const [formRegistration, setFormRegistration] = useState("");

    const [formRole, setFormRole] = useState("USER");

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    React.useEffect(() => {
        if (selectedUser) {
            setFormName(selectedUser.name);

            setFormEmail(selectedUser.email);

            setFormPassword("");

            setFormRegistration(selectedUser.registration);

            setFormUsername(selectedUser.username);
        }
    }, [selectedUser]);

    const createMutation = useMutation({
        mutationFn: (header) => {
            return axiosInstance.post("auth/register", header);
        },
        onSuccess: () => {
            handleClose();
            queryClient.invalidateQueries({ queryKey: ["userListContext"] });
            setSnackBarText("Usuario criado com sucesso");
            setSnackBarSeverity("success");
        },
        onError: (error) => {
            setSnackBarText(error.response.data);
            setSnackBarSeverity("error");
        },
    });

    const editMutation = useMutation({
        mutationFn: (header) => {
            return axiosInstance.put("user/edit/" + selectedUser?.id, header);
        },
        onSuccess: () => {
            handleClose();
            queryClient.invalidateQueries({ queryKey: ["userListContext"] });
            setSnackBarText("Usuario editado com sucesso");
            setSnackBarSeverity("success");
        },
        onError: (error) => {
            setSnackBarText(error.response.data);
            setSnackBarSeverity("error");
        },
    });

    const onSubmit = () => {
        const header = {
            username: formUsername,
            name: formName,
            email: formEmail,
            password: formPassword,
            registration: formRegistration,
            role: formRole,
        };

        if (selectedUser) {
            editMutation.mutate(header);
        } else {
            createMutation.mutate(header);
        }
    };

    const deleteMutation = useMutation({
        mutationFn: () => {
            return axiosInstance.delete("user/delete/" + selectedUser?.id);
        },
        onSuccess: () => {
            handleClose();
            queryClient.invalidateQueries({ queryKey: ["userListContext"] });
            setSnackBarText("Usuario removido com sucesso");
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

    const [isRequestPending, setIsRequestPending] = useState(false)
    React.useEffect(() => {
        setIsRequestPending(createMutation.isPending || editMutation.isPending || deleteMutation.isPending)
    },[createMutation, editMutation, deleteMutation])

    return (
        <React.Fragment>
            <Dialog
                maxWidth={"xs"}
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
                            Novo usuario
                        </Typography>
                        <Button color="inherit" onClick={handleClose} disabled={isRequestPending}>
                            cancelar
                        </Button>
                        <Button color="success" onClick={onSubmit} disabled={isRequestPending}>
                            salvar
                        </Button>
                        {selectedUser ? (
                            <Button color="error" onClick={onRemove} disabled={isRequestPending}>
                                excluir
                            </Button>
                        ) : null}
                    </Toolbar>
                </AppBar>
                <Box sx={{ padding: 2, flexGrow: 1 }}>
                    <Stack direction={"column"} paddingTop={1} gap={2}>
                        <FormControl variant="outlined">
                            <InputMask
                                mask={"999.999.999-99"}
                                value={formUsername}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setFormUsername(event.target.value);
                                }}
                            >
                                {() => <TextField label="CPF" />}
                            </InputMask>
                        </FormControl>
                        <TextField
                            label="Email"
                            value={formEmail}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setFormEmail(event.target.value);
                            }}
                        ></TextField>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">
                                Password
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? "text" : "password"}
                                value={formPassword}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setFormPassword(event.target.value);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                                handleMouseDownPassword
                                            }
                                            edge="end"
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
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
                            label="Matrícula"
                            value={formRegistration}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setFormRegistration(event.target.value);
                            }}
                        ></TextField>
                        <Select
                            labelId="cargo"
                            label={"Cargo"}
                            value={formRole}
                            onChange={(event: SelectChangeEvent) => {
                                setFormRole(event.target.value);
                            }}
                        >
                            <MenuItem value={"USER"}>Usuario</MenuItem>
                            <MenuItem value={"TRAINEE"}>Bolsista</MenuItem>
                            <MenuItem value={"SUPERVISOR"}>Supervisor</MenuItem>
                            <MenuItem value={"ADMIN"}>Admin</MenuItem>
                        </Select>
                    </Stack>
                </Box>
            </Dialog>
        </React.Fragment>
    );
}
