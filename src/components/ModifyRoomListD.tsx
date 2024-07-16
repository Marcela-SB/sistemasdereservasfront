import {
    AppBar,
    Box,
    Button,
    Dialog,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    Toolbar,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { StateContext } from "../context/ReactContext";
import { Send } from "@mui/icons-material";
import { RoomT } from "../types/RoomT";

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

    const handleClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        if (roomList) {
            const holder = [...roomList];
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
            setScrollableRoomArray(holder);
        }
    }, [roomList]);

    const selectRoom = (room: RoomT) => {
        setSelectedRoom(room);
        handleClose();
        setCreateRoom(true);
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth>
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
           
                <List
                    sx={{
                        overflow: "auto",
                        maxHeight: "32rem",
                    }}
                >
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
        </Dialog>
    );
}

export default ModifyRoomListD;
