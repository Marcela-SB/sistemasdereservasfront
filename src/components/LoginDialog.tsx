import * as React from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import { DialogContent, TextField } from "@mui/material";

type Props = {
    setIsOpen: (b: boolean) => void;
    isOpen: boolean;
};

export default function LoginDialog({ setIsOpen, isOpen }: Props) {
    const [username, setUsername] = React.useState<string | null>(null);

    return (
        <Dialog
            onClose={() => {
                setIsOpen(false);
            }}
            open={isOpen}
        >
            <DialogTitle >Login</DialogTitle>
            <DialogContent
            sx={{
                paddingTop:"2rem"
            }}
            >
                <TextField
                    id="outlined-controlled"
                    label="Nome da reserva"
                    value={username}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setUsername(event.target.value);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
