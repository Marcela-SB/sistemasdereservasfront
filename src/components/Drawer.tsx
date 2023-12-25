import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';

import KeyIcon from '@mui/icons-material/Key';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import FullScreenActionDialog from "./FullScreenActionDialog";
import FullScreenDialogList from "./FullScreenDialogList";

const reservationActions = ["Criar reserva", "Editar reserva", "Excluir reserva"]
const reservationIcons = [<BookmarkAddIcon />, <BookmarkBorderIcon />, <BookmarkRemoveIcon />]

const keyActions = ["Criar retirada de chave", "Criar devolução de chave"]
const keyIcons = [<KeyIcon />, <KeyboardReturnIcon />]

type Props = {
    isOpen: boolean;
    setIsOpen: (b:boolean) => void
};

export default function LoginDrawer({ isOpen, setIsOpen }: Props) {
    const toggleDrawer =
        (open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }

            setIsOpen(open);
        };

    const [reservationDIsOpen, setReservationDIsOpen] = React.useState(false)

    return (
        <div>
            <Drawer
                anchor={"right"}
                open={isOpen}
                onClose={toggleDrawer(false)}
            >
                <Box
                    sx={{
                        width: 250,
                    }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        {reservationActions.map(
                            (text, index) => (
                                <ListItem key={text} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            {reservationIcons[index]}
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        )}
                    </List>
                    <Divider />
                    <List>
                        {keyActions.map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {keyIcons[index]}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <FullScreenActionDialog isOpen={reservationDIsOpen} setIsOpen={setReservationDIsOpen} text="reserva" />
            <FullScreenDialogList isOpen={reservationDIsOpen} setIsOpen={setReservationDIsOpen} text="reserva" />
        </div>
    );
}
