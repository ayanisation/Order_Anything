import { Button, Container, Grow, Paper } from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteOrder, deliveryOrders } from "../../Actions/ordersAction";
import io from "socket.io-client";
import { useHistory } from "react-router";
import Progress from "./Progress";
import DeliveryHeader from "./DeliveryHeader";
import { updateUser } from "../../Actions/usersAction";

const ENDPOINT = "https://order-anything.herokuapp.com/";
const socket = io.connect(ENDPOINT);

export default function Delivery() {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = JSON.parse(localStorage.getItem("profile"));
  if (!user || user?.userType !== "Delivery") history.goBack();

  useEffect(() => {
    dispatch(deliveryOrders(user._id));
  }, [dispatch, user._id]);

  useEffect(() => {
    socket.on("update", () => {
      dispatch(deliveryOrders(user._id));
    });
  });

  const orders = useSelector((state) => state.orders);
  const active = orders.find((order) => order.status !== "Delivered");

  return (
    <>
      <DeliveryHeader title="Active Delivery" />
      <Grow in>
        <Container maxWidth="md" style={{ marginTop: 60 }}>
          <Paper style={{ backgroundColor: "black", padding: "20px 0" }}>
            {active ? (
              <>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <h1 style={{ textAlign: "center", color: "white" }}>
                      Item
                    </h1>
                    <hr />
                    {active.items.map((item) => (
                      <h2
                        key={`name${item._id}`}
                        style={{
                          textAlign: "center",
                          color: "white",
                        }}
                      >
                        {item.name}
                      </h2>
                    ))}
                  </div>
                  <div>
                    <h1 style={{ textAlign: "center", color: "white" }}>
                      Quantity
                    </h1>
                    <hr />
                    {active.items.map((item) => (
                      <h2
                        key={`qty${item._id}`}
                        style={{ textAlign: "center", color: "white" }}
                      >
                        {item.quantity}
                      </h2>
                    ))}
                  </div>
                </div>
                <h3 style={{ textAlign: "center", color: "white" }}>
                  Customer : {active.customer.name} ({active.customer.phone})
                </h3>
                {active.status === "Cancelled" ? (
                  <>
                    <h3 style={{ textAlign: "center", color: "white" }}>
                      Order Cancelled
                    </h3>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          dispatch(deleteOrder(active._id));
                          user.available = true;
                          dispatch(updateUser(user));
                          socket.emit("update");
                        }}
                      >
                        Okay
                      </Button>
                    </div>
                  </>
                ) : (
                  <Progress active={active} user={user} socket={socket} />
                )}
              </>
            ) : (
              <h1 style={{ color: "white", textAlign: "center" }}>
                No new order
              </h1>
            )}
          </Paper>
        </Container>
      </Grow>
    </>
  );
}
