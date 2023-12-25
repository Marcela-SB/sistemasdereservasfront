import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ReactContext from "./context/ReactContext";
import ThemeContext from "./context/ThemeContext";
import DateContext from "./context/DateContext";
import { Box, Container, CssBaseline } from "@mui/material";
import NavBar from "./components/NavBar";
import DaysTable from "./components/DaysTable";

function App() {
    return (
        <>
            <ReactContext>
                <ThemeContext>
                    <DateContext>
                        <>
                            <Container sx={{ width: "120rem" }}>
                                <NavBar />
                                <DaysTable />
                            </Container>
                            <CssBaseline enableColorScheme/>
                        </>
                    </DateContext>
                </ThemeContext>
            </ReactContext>
        </>
    );
}

export default App;
