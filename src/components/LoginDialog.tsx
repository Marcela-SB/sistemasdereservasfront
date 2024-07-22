import * as React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
    Alert,
    DialogActions,
    DialogContent,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Snackbar,
    Stack,
    TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import InputMask from "react-input-mask";
import axiosInstance from "../utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { StateContext } from "../context/ReactContext";
import { Close } from "@mui/icons-material";
import PaperComponent from "./PaperComponent";
import DraggablePaper from "./DraggablePaper";

type Props = {
    setIsOpen: (b: boolean) => void;
    isOpen: boolean;
    setIsLogged: (b: boolean) => void;
};

export default function LoginDialog({ setIsOpen, isOpen, setIsLogged }: Props) {
    const { setLoggedUser } = React.useContext(StateContext);

    const [username, setUsername] = React.useState<string>("");
    const [password, setPassword] = React.useState<string | null>(null);

    const [showPassword, setShowPassword] = React.useState(false);

    const [isSnackBarOpen, setIsSnackBarOpen] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const loginMutation = useMutation({
        mutationFn: (header) => {
            return axiosInstance.post("auth/authenticate", header);
        },
        onSuccess: (response) => {
            localStorage.setItem("user", JSON.stringify(response.data));
            setLoggedUser(response.data.user);
            setIsSnackBarOpen(true);
            setIsLogged(true);
            closeDialog();
        },
    });

    const LoginTentative = () => {
        const header = {
            username: username,
            password: password,
        };

        loginMutation.mutate(header);
    };

    const closeDialog = () => {
        loginMutation.reset();
        setIsOpen(false);
    };

    return (
        <>
            <DraggablePaper>
                <Dialog
                    onClose={() => {
                        closeDialog;
                    }}
                    open={isOpen}
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
                    <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                        className="draggable-dialog"
                    >
                        <DialogTitle>Login</DialogTitle>
                        <DialogActions>
                            <IconButton
                                onClick={closeDialog}
                                aria-label="close"
                            >
                                <Close />
                            </IconButton>
                        </DialogActions>
                    </Stack>
                    <DialogContent>
                        <Stack direction={"column"} gap={2}>
                            <FormControl variant="outlined">
                                <InputMask
                                    mask={"999.999.999-99"}
                                    value={username}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        setUsername(event.target.value);
                                    }}
                                >
                                    {() => <TextField label="CPF" />}
                                </InputMask>
                            </FormControl>

                            <FormControl variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">
                                    Password
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        setPassword(event.target.value);
                                    }}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={
                                                    handleClickShowPassword
                                                }
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

                            {loginMutation.error && (
                                <Alert severity="error">
                                    CPF ou senha incorretos
                                </Alert>
                            )}

                            <Button
                                variant="contained"
                                onClick={LoginTentative}
                                sx={{ marginTop: 1 }}
                                disabled={loginMutation.isPending}
                            >
                                login
                            </Button>
                        </Stack>
                    </DialogContent>
                </Dialog>
            </DraggablePaper>
            <Snackbar
                open={isSnackBarOpen}
                autoHideDuration={3000}
                onClose={() => {
                    setIsSnackBarOpen(false);
                }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert severity="success">Logado com sucesso.</Alert>
            </Snackbar>
        </>
    );
}
