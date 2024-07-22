import { PaperProps, Paper } from "@mui/material";
import React, { ReactElement } from "react";
import Draggable from "react-draggable";

type Props = {children: ReactElement | null}

export default function DraggablePaper({children}: Props) {
    return (
        <Draggable
            handle=".draggable-dialog"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            {children}
        </Draggable>
    );
}
