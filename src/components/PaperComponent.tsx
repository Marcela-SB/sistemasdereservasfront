import { PaperProps, Paper } from "@mui/material";
import React from "react";

export default function PaperComponent(props: PaperProps) {
    return <Paper {...props} style={{ margin: 0, maxHeight: "100%" }} />;
}
