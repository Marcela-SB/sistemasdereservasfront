import {
    Dialog,
    AppBar,
    Toolbar,
    Typography,
    Button,
    List,
    ListItem,
    ListItemSecondaryAction,
    Divider,
    Tooltip,
    Stack,
    IconButton,
} from "@mui/material";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import React, { useEffect, useState } from "react";
import { StateContext } from "../context/ReactContext";
import { RoomT } from "../types/RoomT";
import { KeyT } from "../types/KeyDeliveryT";
import dayjs from "dayjs";
import getUserById from "../utils/getUserById";
import { Close } from "@mui/icons-material";

type Props = {
    isOpen: boolean;
    setIsOpen: (b: boolean) => void;
    selectedRoom: RoomT;
};

export default function HistoricDialog({
    isOpen,
    setIsOpen,
    selectedRoom,
}: Props) {
    const { userList, keyList } = React.useContext(StateContext);

    const [scrollableRoomArray, setScrollableRoomArray] = useState<KeyT[]>([]);

    const handleClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        if (keyList) {
            const holder = keyList.filter((key) => {
                return key.roomId == selectedRoom.id;
            });
            console.log(holder);
            holder.sort((a, b) => {
                const dateA = dayjs(a.withdrawTime);
                const dateB = dayjs(b.withdrawTime);

                if (dateA.isAfter(dateB)) {
                    return -1;
                }
                if (dateA.isBefore(dateB)) {
                    return 1;
                }

                return 0;
            });
            setScrollableRoomArray(holder);
        }
    }, [keyList]);

    return (
        <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
            <AppBar sx={{ position: "relative" }}>
                <Toolbar>
                    <Typography
                        sx={{ ml: 0, flex: 1 }}
                        variant="h6"
                        component="div"
                    >
                        Historico de chaves
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
            <List>
                {scrollableRoomArray?.map((key) => {
                    return (
                        <>
                            <ListItem key={`modkeylist-${key.id}`}>
                                <Stack direction={"column"}>
                                    <Typography>
                                        Retirada de chave as{" "}
                                        {dayjs(key.withdrawTime).format(
                                            "HH:mm [no dia] DD/MM/YYYY"
                                        )}
                                    </Typography>
                                    <Typography>
                                        Previsão do retorno as{" "}
                                        {dayjs(key.returnPrevision).format(
                                            "HH:mm"
                                        )}
                                    </Typography>
                                    {key.isKeyReturned ? (
                                        <Typography>
                                            Retorno de chave em{" "}
                                            {dayjs(key.returnTime).format(
                                                "HH:mm [no dia] DD/MM/YYYY"
                                            )}
                                        </Typography>
                                    ) : null}
                                    <Typography>
                                        Reserva feita para{" "}
                                        {
                                            getUserById(
                                                key.responsibleForTheKeyId,
                                                userList
                                            )?.name
                                        }{" "}
                                        por{" "}
                                        {
                                            getUserById(
                                                key.withdrawResponsibleId,
                                                userList
                                            )?.name
                                        }
                                    </Typography>
                                </Stack>
                                {key.isKeyReturned ? null : (
                                    <ListItemSecondaryAction>
                                        <Tooltip title={"Chave não retornada"}>
                                            <PriorityHighRoundedIcon
                                                color="error"
                                                fontSize="large"
                                            ></PriorityHighRoundedIcon>
                                        </Tooltip>
                                    </ListItemSecondaryAction>
                                )}
                            </ListItem>
                            <Divider variant="middle" />
                        </>
                    );
                })}
            </List>
        </Dialog>
    );
}
