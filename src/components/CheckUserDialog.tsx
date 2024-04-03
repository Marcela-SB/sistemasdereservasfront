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
    Stack,
    TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import InputMask from "react-input-mask";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { UserT } from "../types/UserT";
import { Close } from "@mui/icons-material";

type Props = {
    setIsOpen: (b: boolean) => void;
    isOpen: boolean;
    chekedUser: UserT | null;
    setCheckSucess: (b: boolean) => void;
};

export default function CheckUserDialog({
    setIsOpen,
    isOpen,
    chekedUser,
    setCheckSucess,
}: Props) {
    const [username, setUsername] = React.useState<string | null>(null);
    const [password, setPassword] = React.useState<string | null>(null);

    const [showPassword, setShowPassword] = React.useState(false);

    React.useEffect(() => {
        if (chekedUser) {
            setUsername(chekedUser.username);
        }
    }, [chekedUser]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const loginMutation = useMutation({
        mutationFn: (header) => {
            return axios.post(
                "http://localhost:8087/auth/authenticate",
                header
            );
        },
        onSuccess: () => {
            closeDialog();
            setCheckSucess(true);
            
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
        setUsername(null);
        setPassword(null);
    };

    return (
        <>
            <Dialog
                onClose={() => {
                    closeDialog;
                }}
                open={isOpen}
            >
                <Stack direction={"row"}>
                    <DialogTitle>Logue para completar</DialogTitle>
                    <DialogActions>
                        <IconButton onClick={closeDialog} aria-label="close">
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
                                readOnly
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

                        {loginMutation.error && (
                            <Alert severity="error">
                                CPF ou senha incorretos
                            </Alert>
                        )}

                        <Button
                            variant="contained"
                            onClick={LoginTentative}
                            sx={{ marginTop: 1 }}
                        >
                            login
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}
