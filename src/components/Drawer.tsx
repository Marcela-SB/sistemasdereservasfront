import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";

import KeyIcon from "@mui/icons-material/Key";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import FullScreenActionDialog from "./FullScreenActionDialog";
import FullScreenDialogList from "./FullScreenDialogList";
import { ReservationT } from "../types/ReservationT";
import KeyWithdraDialog from "./KeyWithdrawDialog";
import KeyReturnDialog from "./KeyReturnDialog";

type Props = {
    isOpen: boolean;
    setIsOpen: (b: boolean) => void;
};

export default function LoginDrawer({ isOpen, setIsOpen }: Props) {
    const toggleDrawer =
        (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }

            setIsOpen(open);
        };

    const [reservationDIsOpen, setReservationDIsOpen] = React.useState(false);
    const [reservationDListIsOpen, setReservationDListIsOpen] =
        React.useState(false);

    const [selectedReservation, setSelectedReservation] =
        React.useState<ReservationT | null>(null);

    const [keyWDialogIsOpen, setKeyWDialogIsOpen] = React.useState(false);
    const [keyRDialogIsOpen, setKeyRDialogIsOpen] = React.useState(false);

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
                        <ListItem key={"Criar reserva"} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    setReservationDIsOpen(true);
                                }}
                            >
                                <ListItemIcon>
                                    <BookmarkAddIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Criar reserva"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={"Excluir reserva"} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    setReservationDListIsOpen(true);
                                }}
                            >
                                <ListItemIcon>
                                    <BookmarkRemoveIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Modificar reserva"} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem
                            key={"Criar retirada de chave"}
                            disablePadding
                        >
                            <ListItemButton
                                onClick={() => {
                                    setKeyWDialogIsOpen(true);
                                }}
                            >
                                <ListItemIcon>
                                    <KeyIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={"Criar retirada de chave"}
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem
                            key={"Criar devolução de chave"}
                            disablePadding
                        >
                            <ListItemButton
                                onClick={() => {
                                    setKeyRDialogIsOpen(true);
                                }}
                            >
                                <ListItemIcon>
                                    <KeyboardReturnIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={"Criar devolução de chave"}
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <FullScreenActionDialog
                isOpen={reservationDIsOpen}
                setIsOpen={setReservationDIsOpen}
                text="criar"
                selectedReservation={selectedReservation}
            />
            <FullScreenDialogList
                isOpen={reservationDListIsOpen}
                setIsOpen={setReservationDListIsOpen}
                text="reserva"
                setSelectedReservation={setSelectedReservation}
                setReservationDIsOpen={setReservationDIsOpen}
            />
            <KeyWithdraDialog
                isOpen={keyWDialogIsOpen}
                setIsOpen={setKeyWDialogIsOpen}
            />
            <KeyReturnDialog
                isOpen={keyRDialogIsOpen}
                setIsOpen={setKeyRDialogIsOpen}
            />
        </div>
    );
}
