import {
    AppBar,
    Button,
    Dialog,
    Divider,
    FormControl,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    Stack,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { StateContext } from "../context/ReactContext";
import { Send } from "@mui/icons-material";
import { UserT } from "../types/UserT";
import FilteredUserList from "./FilteredUserList";

import InputMask from "react-input-mask";

type Props = {
    isOpen: boolean;
    setIsOpen: (b: boolean) => void;
    setSelectedUser: (r: UserT) => void;
    setCreateUserIsOpen: (b: boolean) => void;
};
function ModifyUserListD({
    isOpen,
    setIsOpen,
    setSelectedUser,
    setCreateUserIsOpen,
}: Props) {
    const { userList } = React.useContext(StateContext);

    const [searchedText, setSearchedText] = useState("");

    const handleClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        if (userList) {
            const holder = [...userList];
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
    }, [userList]);

    const selectUser = (room: UserT) => {
        setSelectedUser(room);
        handleClose();
        setCreateUserIsOpen(true);
    };

    return (
        <Dialog open={true} onClose={handleClose} maxWidth="xs" fullWidth>
            <AppBar sx={{ position: "relative" }}>
                <Toolbar>
                    <Typography
                        sx={{ ml: 0, flex: 1 }}
                        variant="h6"
                        component="div"
                    >
                        Selecione um espaço
                    </Typography>
                    <Button color="inherit" onClick={handleClose}>
                        cancelar
                    </Button>
                </Toolbar>
            </AppBar>
            <List>
                <Stack sx={{ paddingX: 1 }}>
                    <FilteredUserList
                        selectUser={selectUser}
                        inputText={searchedText}
                    />
                    <FormControl>
                        <InputMask
                            mask={"999.999.999-99"}
                            value={searchedText}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setSearchedText(event.target.value);
                            }}
                        >
                            {() => (
                                <TextField
                                    label="CPF"
                                    sx={{
                                        margin: 2,
                                    }}
                                    InputProps={{ sx: { borderRadius: 6 } }}
                                />
                            )}
                        </InputMask>
                    </FormControl>
                </Stack>
            </List>
        </Dialog>
    );
}

export default ModifyUserListD;
