import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import LoginDrawer from "./Drawer";
import LoginDialog from "./LoginDialog";
import { orange } from "@mui/material/colors";

function NavBar() {
    const handleClickOnProfile = () => {
        if (isLogged) {
            setIsDrawerOpen(true);
        } else {
            setIsLoginDialogOpen(true);
        }
    };

    const [isLogged, setIsLogged] = React.useState(localStorage.getItem("user") ? true : false);

    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

    const [isLoginDialogOpen, setIsLoginDialogOpen] = React.useState(false);

    return (
        <AppBar position="absolute">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 2,
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        DEARTT
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Login para funcionários">
                            <IconButton
                                onClick={handleClickOnProfile}
                                sx={{ p: 0 }}
                            >
                                {isLogged ? (
                                    <Avatar alt="Deart"/>
                                ) : (
                                    <Avatar alt="Deart">D</Avatar>
                                )}
                            </IconButton>
                        </Tooltip>
                        <LoginDrawer
                            isOpen={isDrawerOpen}
                            setIsOpen={setIsDrawerOpen}
                        />
                        <LoginDialog
                            isOpen={isLoginDialogOpen}
                            setIsOpen={setIsLoginDialogOpen}
                            setIsLogged={setIsLogged}
                        />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default NavBar;
