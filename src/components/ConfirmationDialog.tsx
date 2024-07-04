import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type Props = {
    isOpen: boolean;
    setIsOpen: (b: boolean) => void;
    toExclude: string;
    excludeFunction: () => void;
};

export default function ConfirmationDialog({
    toExclude,
    excludeFunction,
    isOpen,
    setIsOpen,
}: Props) {
    const handleClose = () => {
        setIsOpen(false);
    };

    const agreeFunc = () => {
        excludeFunction();
        handleClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>
                Tem certeza que deseja excluir {toExclude} ?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Ao excluir esse item todos os seus dados serão perdidos.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Não</Button>
                <Button onClick={agreeFunc} autoFocus>
                    Sim
                </Button>
            </DialogActions>
        </Dialog>
    );
}
