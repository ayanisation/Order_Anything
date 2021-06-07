import {
  AppBar,
  Container,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

const useStyles = makeStyles(() => ({
  appBar: {
    display: "flex",
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  heading: {
    color: "#C2936E",
    fontWeight: "bold",
  },
}));

export default function CustomerHeader({ title }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Container maxWidth="lg" style={{ height: 30 }}>
        <AppBar className={classes.appBar} position="fixed" color="inherit">
          <Typography className={classes.heading} variant="h4" align="center">
            {title}
          </Typography>
          <div style={{ position: "absolute", right: 20 }}>
            <IconButton onClick={handleClick}>
              <MenuIcon style={{ color: "white" }} />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  history.push("/items");
                }}
              >
                Home
              </MenuItem>
              <MenuItem
                onClick={() => {
                  history.push("/kart");
                }}
              >
                Kart
              </MenuItem>
              <MenuItem
                onClick={() => {
                  history.push("/orders");
                }}
              >
                Order history
              </MenuItem>
              <MenuItem
                onClick={() => {
                  if (window.confirm("Are you sure you wish to logout?")) {
                    dispatch({ type: "LOGOUT" });
                    history.push("/");
                  }
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        </AppBar>
      </Container>
    </>
  );
}
