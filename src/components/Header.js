import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { Children } from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const render = () => {
    if (hasHiddenAuthButtons) {
      return (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
        >
          Back to explore
        </Button>
      );
    } else if (!hasHiddenAuthButtons) {
      return (
        <Stack direction='row' spacing={2}>
          <Button variant="text" onClick={() => history.push("/login")}>
            LOGIN
          </Button>
          <Button
            className="button"
            onClick={() => history.push("/register")}
            variant="contained"
          >
            REGISTER
          </Button>
        </Stack>
      );
    }
  };
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  }

  
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      {token ? (<Stack direction="row" spacing={2}>
                   <Avatar alt={username} src="avatar.png" />
                   <Typography variant="h6">{username}</Typography>
                   <Button variant="text" onClick={logout}>
                    LOGOUT
                   </Button>
                </Stack>) : render()}
    </Box>
  );
};

export default Header;
