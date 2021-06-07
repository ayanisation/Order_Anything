import { Container, Paper, Typography, AppBar, Grow } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

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
  paper: {
    borderRadius: 15,
    padding: "100px 0",
    background: "black",
  },
  buttonSignup: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 60,
    background: "#79CDCD",
  },
  buttonLogin: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    background: "#66cd00",
  },
  image: {
    marginLeft: "15px",
  },
}));

const Homepage = () => {
  const classes = useStyles();
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("profile"));
  if (user) {
    switch (user.userType) {
      case "Admin":
        history.push("/admin");
        break;
      case "Customer":
        history.push("/items");
        break;
      case "Delivery":
        history.push("/active");
    }
  }
  return (
    <>
      <Container maxWidth="lg" style={{ height: 30 }}>
        <AppBar className={classes.appBar} position="fixed" color="inherit">
          <Typography className={classes.heading} variant="h4" align="center">
            Order Anything
          </Typography>
        </AppBar>
      </Container>
      <Grow in>
        <Container maxWidth="sm" align="center" style={{ marginTop: 60 }}>
          <Paper className={classes.paper}>
            <Typography className={classes.heading} variant="h5">
              Login as
            </Typography>
            <div style={{ marginTop: 60 }}>
              <Typography
                style={{ textDecoration: "none", color: "white" }}
                variant="h6"
                component={Link}
                to="/login/Admin"
              >
                Admin
              </Typography>
              <Typography
                style={{ textDecoration: "none", color: "white" }}
                variant="h6"
              >
                --------------------------
              </Typography>
              <Typography
                style={{ textDecoration: "none", color: "white" }}
                variant="h6"
                component={Link}
                to="/login/Customer"
              >
                Customer
              </Typography>
              <Typography
                style={{ textDecoration: "none", color: "white" }}
                variant="h6"
              >
                --------------------------
              </Typography>
              <Typography
                style={{ textDecoration: "none", color: "white" }}
                variant="h6"
                component={Link}
                to="/login/Delivery"
              >
                Delivery Person
              </Typography>
            </div>
          </Paper>
        </Container>
      </Grow>
    </>
  );
};

export default Homepage;
