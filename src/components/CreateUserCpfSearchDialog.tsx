import {
    AppBar,
    Button,
    Dialog,
    FormControl,
    IconButton,
    List,
    Stack,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { StateContext } from "../context/ReactContext";
import { UserT } from "../types/UserT";

import InputMask from "react-input-mask";
import { Close } from "@mui/icons-material";
import PaperComponent from "./PaperComponent";
import DraggablePaper from "./DraggablePaper";
import FilteredUserListByCpf from "./FilteredUserListByCpf";
import FilteredUserList from "./FilteredUserList";

type Props = {
    isOpen: boolean;
    setIsOpen: (b: boolean) => void;
    setSelectedUser: (r: UserT) => void;
    setCreateUserIsOpen: (b: boolean) => void;
};

function CreateUserCpfSearchDialog({
    isOpen,
    setIsOpen,
    setSelectedUser,
    setCreateUserIsOpen,
}: Props) {
    const { allUsersList } = React.useContext(StateContext);

    // O estado 'searchedText' agora conterá o CPF (com ou sem formatação, dependendo do InputMask)
    const [searchedText, setSearchedText] = useState("");

    const handleClose = () => {
        setIsOpen(false);
    };

    // O useEffect para ordenação não precisa ser alterado se a ordenação inicial for a mesma.
    useEffect(() => {
        if (allUsersList) {
            const holder = [...allUsersList];
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
        }
    }, [allUsersList]);

    const selectUser = (room: UserT) => {
        setSelectedUser(room);
        setCreateUserIsOpen(true);
    };

    return (
        <DraggablePaper>
            <Dialog
                open={isOpen}
                onClose={handleClose}
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
                    width: '36.5rem',
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
                            Verificação de usuário
                        </Typography>
                         <Stack direction={"row"} spacing={1}>
                            <Button
                                color="success"
                                onClick={() => setCreateUserIsOpen(true)}
                                variant="contained"
                                sx={{ fontWeight: "600" }}
                            >
                                Criar
                            </Button>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <Close />
                            </IconButton>
                        </Stack>
                    </Toolbar>
                </AppBar>
                <Stack direction={"column"}>
                    <FilteredUserListByCpf
                        selectUser={selectUser}
                        inputText={searchedText} // Passa o texto (agora CPF) para o filtro
                    />
                    <FormControl>
                        {/* 🌟 Alteração aqui para usar InputMask para CPF */}
                        <InputMask
                            mask="999.999.999-99" // Máscara de CPF
                            value={searchedText}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setSearchedText(event.target.value);
                            }}
                        >
                            {() => (
                                <TextField
                                    label="CPF do usuario" // Novo label
                                    placeholder="Digite o CPF do usuario" // Novo placeholder
                                    sx={{
                                        margin: 2,
                                        borderRadius: 6,
                                    }}
                                ></TextField>
                            )}
                        </InputMask>
                    </FormControl>
                </Stack>
            </Dialog>
        </DraggablePaper>
    );
}

export default CreateUserCpfSearchDialog;