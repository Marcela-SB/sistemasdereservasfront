import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { StateContext } from "../context/ReactContext";
import {
    Box,
    Checkbox, FormControl,
    IconButton,
    ListItemButton,
    ListItemIcon,
    ListItemSecondaryAction,
    ListSubheader,
    Stack, TextField,
} from "@mui/material";
import getRoomById from "../utils/getRoomById";
import { Send } from "@mui/icons-material";
import dayjs from "dayjs";
import { KeyT } from "../types/KeyDeliveryT";
import {useEffect, useState} from "react";
import keyDynamicSort from "../utils/keyDynamicSort";
import Button from "@mui/material/Button";
import {RoomT} from "../types/RoomT.ts";
import roomDynamicSort from "../utils/roomDynamicSort.ts";

type Props = {
    setSelectedKey: (k: KeyT) => void;
    selectedKeyList: KeyT[];
    setSelectedKeyList: (k: KeyT) => void;
};

export default function KeyScrollableList({
    setSelectedKey,
    selectedKeyList,
    setSelectedKeyList
}: Props) {
    const { keyList, roomList } = React.useContext(StateContext);


    const handleKeyListChange = (key: KeyT) => {
        const holder = selectedKeyList;

        const keyIndex = holder?.findIndex(
            (holderKey) => holderKey.id == key.id
        );

        if (keyIndex > -1) {
            holder?.splice(keyIndex, 1);
        } else {
            holder?.push(key);
        }
        setSelectedKeyList(holder);
    };

    const [ordainedKeyList, setOrdainedKeyList] = useState<KeyT[]>([])

    const [searchedText, setSearchedText] = useState("");

    useEffect(() => {
        if (roomList && keyList) {

            const filtededKeyList = keyList
                ?.filter((key: KeyT) => {
                    //if no input the return the original
                    if (searchedText === "") {
                        return key;
                    }

                    //return the item which contains the room input
                    else {
                        const room = getRoomById(key.roomId, roomList)
                        if(room?.name.toLowerCase().includes(searchedText)){
                            return key
                        }
                    }
                }).sort(keyDynamicSort(roomList))
            console.log(filtededKeyList)
            setOrdainedKeyList(filtededKeyList);
        }
    }, [keyList,roomList, searchedText]);

    return (
        <Stack direction={'column'} >
            <Stack direction={"row"}>
                <Stack direction={"column"} justifyContent={"start"} gap={2} sx={{marginLeft: 2,
                    marginY: 2}}>
                    <List
                        sx={{
                            width: "100%",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                            position: "relative",
                            overflow: "auto",
                            maxHeight: "20rem",
                            "& ul": { padding: 0 },
                            "&::-webkit-scrollbar": { display: "none" },
                            minWidth: 200,
                            borderRadius: ".5rem .5rem  2% 2%",
                            border: "solid 1px rgba(0, 0, 0, 0.26)",
                            padding: 0,
                            flex:2/3
                        }}
                    >
                        <ListSubheader
                            sx={{
                                backgroundColor: "#004586",
                                color: "white",
                                borderRadius: ".5rem .5rem 0 0 ",
                            }}
                        >
                            Salas Administrativas
                        </ListSubheader>
                        {ordainedKeyList.map((item) => {
                            if (
                                getRoomById(item.roomId, roomList)?.administrative ==
                                false
                            )
                                return;
                            if (item.isKeyReturned) return;

                            const room = getRoomById(item.roomId, roomList);
                            let roomDisplayName = room?.name;
                            if (room?.roomNumber) {
                                roomDisplayName =
                                    roomDisplayName + " " + room.roomNumber;
                            }

                            const withdratime = dayjs(item.withdrawTime).format(
                                "HH:mm"
                            );

                            const returnPrevision = dayjs(item.returnPrevision).format(
                                "HH:mm"
                            );

                            return (
                                <ListItem
                                    key={item.id}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={() => {
                                                setSelectedKey(item);
                                            }}
                                        >
                                            <Send />
                                        </IconButton>
                                    }
                                    disablePadding
                                    sx={{ borderBottom: "1px solid gray" }}
                                >
                                    <ListItemButton
                                        role={undefined}
                                        onClick={() => {
                                            handleKeyListChange(item);
                                        }}
                                        dense
                                    >
                                        <ListItemIcon sx={{ minWidth: "auto" }}>
                                            <Checkbox edge="start" disableRipple />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`${roomDisplayName}`}
                                            secondary={`${withdratime}  -     ${returnPrevision}`}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                    <List
                        sx={{
                            width: "100%",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                            position: "relative",
                            overflow: "auto",
                            maxHeight: "20rem",
                            "& ul": { padding: 0 },
                            "&::-webkit-scrollbar": { display: "none" },

                            minWidth: 200,
                            borderRadius: ".5rem .5rem  2% 2%",
                            border: "solid 1px rgba(0, 0, 0, 0.26)",
                            padding: 0,
                            flex:1/3
                        }}
                    >
                        <ListSubheader
                            sx={{
                                backgroundColor: "#004586",
                                color: "white",
                                borderRadius: ".5rem .5rem 0 0 ",
                            }}
                        >
                            Salas Adm. Retornadas
                        </ListSubheader>
                        {ordainedKeyList.map((item) => {
                            if (
                                getRoomById(item.roomId, roomList)?.administrative ==
                                false
                            )
                                return;
                            if (!item.isKeyReturned) return;
                            if(dayjs().isAfter(dayjs(item.withdrawTime), 'day')) return

                            const room = getRoomById(item.roomId, roomList);
                            let roomDisplayName = room?.name;
                            if (room?.roomNumber) {
                                roomDisplayName =
                                    roomDisplayName + " " + room.roomNumber;
                            }

                            const withdratime = dayjs(item.withdrawTime).format(
                                "HH:mm"
                            );

                            const returnPrevision = dayjs(item.returnPrevision).format(
                                "HH:mm"
                            );

                            return (
                                <ListItem
                                    key={item.id}
                                    disablePadding
                                    sx={{ borderBottom: "1px solid gray", paddingLeft:2 }}

                                >

                                    <ListItemText
                                        primary={`${roomDisplayName}`}
                                        secondary={`${withdratime}  -     ${returnPrevision}`}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Stack>

                <Stack direction={"column"} justifyContent={"start"} gap={2} sx={{marginLeft: 2,
                    marginY: 2}}>
                    <List
                        sx={{
                            width: "100%",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                            position: "relative",
                            overflow: "auto",
                            maxHeight: "20rem",
                            "& ul": { padding: 0 },
                            "&::-webkit-scrollbar": { display: "none" },
                            minWidth: 200,
                            borderRadius: ".5rem .5rem  2% 2%",
                            border: "solid 1px rgba(0, 0, 0, 0.26)",
                            padding: 0,
                            flex:2/3
                        }}
                    >
                        <ListSubheader
                            sx={{
                                backgroundColor: "#004586",
                                color: "white",
                                borderRadius: ".5rem .5rem 0 0 ",
                            }}
                        >
                            Salas de Aula
                        </ListSubheader>
                        {ordainedKeyList.map((item) => {
                            if (
                                getRoomById(item.roomId, roomList)?.administrative ==
                                true
                            )
                                return;
                            if (item.isKeyReturned) return;

                            const room = getRoomById(item.roomId, roomList);
                            let roomDisplayName = room?.name;
                            if (room?.roomNumber) {
                                roomDisplayName =
                                    roomDisplayName + " " + room.roomNumber;
                            }

                            const withdratime = dayjs(item.withdrawTime).format(
                                "HH:mm"
                            );

                            const returnPrevision = dayjs(item.returnPrevision).format(
                                "HH:mm"
                            );

                            return (
                                <ListItem
                                    key={item.id}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={() => {
                                                setSelectedKey(item);
                                            }}
                                        >
                                            <Send />
                                        </IconButton>
                                    }
                                    disablePadding
                                    sx={{ borderBottom: "1px solid gray" }}
                                >
                                    <ListItemButton
                                        role={undefined}
                                        onClick={() => {
                                            handleKeyListChange(item);
                                        }}
                                        dense
                                    >
                                        <ListItemIcon sx={{ minWidth: "auto" }}>
                                            <Checkbox edge="start" disableRipple />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`${roomDisplayName}`}
                                            secondary={`${withdratime}  -     ${returnPrevision}`}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                    <List
                        sx={{
                            width: "100%",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                            position: "relative",
                            overflow: "auto",
                            maxHeight: "20rem",
                            "& ul": { padding: 0 },
                            "&::-webkit-scrollbar": { display: "none" },

                            minWidth: 200,
                            borderRadius: ".5rem .5rem  2% 2%",
                            border: "solid 1px rgba(0, 0, 0, 0.26)",
                            padding: 0,
                            flex:1/3
                        }}
                    >
                        <ListSubheader
                            sx={{
                                backgroundColor: "#004586",
                                color: "white",
                                borderRadius: ".5rem .5rem 0 0 ",
                            }}
                        >
                            Salas de Aula Retornadas
                        </ListSubheader>
                        {ordainedKeyList.map((item) => {
                            if (
                                getRoomById(item.roomId, roomList)?.administrative ==
                                true
                            )
                                return;
                            if (!item.isKeyReturned) return;

                            if(dayjs().isAfter(dayjs(item.withdrawTime), 'day')) return

                            const room = getRoomById(item.roomId, roomList);
                            let roomDisplayName = room?.name;
                            if (room?.roomNumber) {
                                roomDisplayName =
                                    roomDisplayName + " " + room.roomNumber;
                            }

                            const withdratime = dayjs(item.withdrawTime).format(
                                "HH:mm"
                            );

                            const returnPrevision = dayjs(item.returnPrevision).format(
                                "HH:mm"
                            );

                            return (
                                <ListItem
                                    key={item.id}
                                    disablePadding
                                    sx={{ borderBottom: "1px solid gray", paddingLeft:2 }}

                                >

                                    <ListItemText
                                        primary={`${roomDisplayName}`}
                                        secondary={`${withdratime}  -     ${returnPrevision}`}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Stack>
            </Stack>
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
    );
}
