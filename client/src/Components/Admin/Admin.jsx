import {
  AppBar,
  Container,
  Grow,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { pendingOrders } from "../../Actions/ordersAction";
import { fetchUsers } from "../../Actions/usersAction";
import PendingOrder from "./PendingOrder";
import io from "socket.io-client";
import { ExitToApp } from "@material-ui/icons";

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

let orders = [];
let users = [];
const ENDPOINT = "https://order-anything.herokuapp.com/";
const socket = io.connect(ENDPOINT);

export default function Admin() {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const user = JSON.parse(localStorage.getItem("profile"));
  if (!user || user?.userType !== "Admin") history.goBack();

  useEffect(() => {
    dispatch(pendingOrders());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    socket.on("update", () => {
      dispatch(pendingOrders());
      dispatch(fetchUsers());
    });
  });

  orders = useSelector((state) => state.orders);
  users = useSelector((state) => state.users);
  users = users.filter(
    (user) => user.userType === "Delivery" && user.available
  );

  return (
    <>
      <Container maxWidth="lg" style={{ height: 30 }}>
        <AppBar className={classes.appBar} position="fixed" color="inherit">
          <Typography className={classes.heading} variant="h4" align="center">
            Admin
          </Typography>
          <IconButton
            style={{ position: "absolute", right: 20 }}
            onClick={() => {
              if (window.confirm("Are you sure you wish to logout?")) {
                dispatch({ type: "LOGOUT" });
                history.push("/");
              }
            }}
          >
            <ExitToApp style={{ color: "white" }} />
          </IconButton>
        </AppBar>
      </Container>
      <Grow in>
        {!orders.length ? (
          <Container
            maxWidth="sm"
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 100,
            }}
          >
            <h2>No new orders</h2>
          </Container>
        ) : (
          <Container maxWidth="md" style={{ marginTop: 50 }}>
            {orders.map((order, index, orders) => (
              <PendingOrder
                key={order._id}
                order={order}
                index={index}
                orders={orders}
                users={users}
                socket={socket}
              />
            ))}
          </Container>
        )}
      </Grow>
    </>
  );
}
