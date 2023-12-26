import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import FullScreenFormDialog from "./FullScreenFormDialog";
import ScrollableList from "./ScrollableList";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
    isOpen: boolean;
    setIsOpen: (b: boolean) => void;
    text: string;
};

export default function FullScreenDialogList({
    isOpen,
    setIsOpen,
    text,
}: Props) {
    const handleClickOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                fullScreen
                open={false} //!!!!!!!!!!!!!!
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            {text.toUpperCase()}
                        </Typography>
                        <Button color="inherit" onClick={handleClose}>
                            cancelar
                        </Button>
                    </Toolbar>
                </AppBar>

                
                <ScrollableList optionsList={[]} />
            </Dialog>
        </React.Fragment>
    );
}
