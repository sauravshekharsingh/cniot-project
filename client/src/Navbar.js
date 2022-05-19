import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import jwtDecode from "jwt-decode";
import "./style.css";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { pink } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: pink[800],
    },
    secondary: {
      main: "#c2f6ff",
    },
  },
});

export default function Navbar({ token, setToken }) {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.clear("token");
    setToken(null);
  };

  let user = null;

  if (token) {
    user = jwtDecode(token);
    if (!loggedIn && user) {
      setLoggedIn(true);
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }} className="navbar">
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ChatApp
            </Typography>
            {loggedIn && (
              <div>
                <NavLink to="/">
                  <Button
                    color="secondary"
                    variant="contained"
                    style={{ marginRight: "20px" }}
                  >
                    Home
                  </Button>
                </NavLink>
                <NavLink to="/dashboard">
                  <Button
                    color="secondary"
                    variant="contained"
                    style={{ marginRight: "20px" }}
                  >
                    Dashboard
                  </Button>
                </NavLink>
              </div>
            )}
            {!loggedIn && (
              <div style={{ margin: "0 20px" }}>
                <NavLink to={`/login`}>
                  <Button
                    color="secondary"
                    variant="contained"
                    style={{ marginRight: "10px" }}
                  >
                    Login
                  </Button>
                </NavLink>
                <NavLink to={`/signup`}>
                  <Button color="info" variant="contained">
                    Signup
                  </Button>
                </NavLink>
              </div>
            )}
            {loggedIn && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar
                  style={{ marginRight: "20px" }}
                  sx={{ bgcolor: "#7b52f7" }}
                >
                  {user.name[0]}
                </Avatar>
                <NavLink to={`/login`} onClick={handleLogout}>
                  <Button color="info" variant="contained">
                    Logout
                  </Button>
                </NavLink>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </Box>
  );
}
