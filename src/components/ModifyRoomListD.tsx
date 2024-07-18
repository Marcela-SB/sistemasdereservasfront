import {
    AppBar,
    Box,
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
import { Close, Send } from "@mui/icons-material";
import { RoomT } from "../types/RoomT";
import roomDynamicSort from "../utils/roomDynamicSort";

type Props = {
    isOpen: boolean;
    setIsOpen: (b: boolean) => void;
    setSelectedRoom: (r: RoomT) => void;
    setCreateRoom: (b: boolean) => void;
};
function ModifyRoomListD({
    isOpen,
    setIsOpen,
    setSelectedRoom,
    setCreateRoom,
}: Props) {
    const { roomList } = React.useContext(StateContext);

    const [scrollableRoomArray, setScrollableRoomArray] = useState<RoomT[]>([]);

    const [searchedText, setSearchedText] = useState("");

    const handleClose = () => {
        setIsOpen(false);
    };

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
                        return room.name?.toLowerCase().includes(searchedText);
                    }
                })
                .sort(roomDynamicSort());
            setScrollableRoomArray(filteredRoomList);
        }
    }, [searchedText, roomList]);

    const selectRoom = (room: RoomT) => {
        setSelectedRoom(room);
        setCreateRoom(true);
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
            <AppBar sx={{ position: "relative" }}>
                <Toolbar>
                    <Typography
                        sx={{ ml: 0, flex: 1 }}
                        variant="h6"
                        component="div"
                    >
                        Selecione um espaço
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
            <Stack direction={"column"}>
                <List sx={{ overflow: "auto", maxHeight: "20rem" }}>
                    {scrollableRoomArray?.map((room) => {
                        return (
                            <>
                                <ListItem key={`modroomlist-${room.id}`}>
                                    {room.name} {room.roomNumber}
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            onClick={() => selectRoom(room)}
                                        >
                                            <Send></Send>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider
                                    key={`modroomlistdivider-${room.id}`}
                                    variant="middle"
                                />
                            </>
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
        </Dialog>
    );
}

export default ModifyRoomListD;
