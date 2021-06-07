import { Button, Container, Grow, Paper } from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { customerOrders, updateOrder } from "../../Actions/ordersAction";
import io from "socket.io-client";
import CustomerHeader from "./CustomerHeader";
import { useHistory } from "react-router";

const ENDPOINT = "https://order-anything.herokuapp.com/";
const socket = io.connect(ENDPOINT);

export default function MyOrders() {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = JSON.parse(localStorage.getItem("profile"));
  if (!user || user?.userType !== "Customer") history.goBack();

  useEffect(() => {
    dispatch(customerOrders(user._id));
  }, [dispatch, user._id]);

  useEffect(() => {
    socket.on("update", () => {
      dispatch(customerOrders(user._id));
    });
  });

  let orders = useSelector((state) => state.orders);
  orders = orders.filter((order) => order.status !== "In Kart");

  const cancelOrder = async (order) => {
    if (!window.confirm("Are you sure you wish to cancel the order?")) return;
    try {
      order.status = "Cancelled";
      await dispatch(updateOrder(order));
      socket.emit("update");
    } catch (e) {
      window.alert("Something went wrong");
    }
  };

  return (
    <>
      <CustomerHeader title="Order History" />
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
            <h3>No orders yet</h3>
          </Container>
        ) : (
          <Container maxWidth="md" style={{ marginTop: 50 }}>
            {orders.map((order) => (
              <Paper
                key={order._id}
                style={{
                  backgroundColor: "black",
                  padding: "20px 0",
                  marginBottom: 30,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <h2 style={{ textAlign: "center", color: "white" }}>
                      Item
                    </h2>
                    <hr />
                    {order.items.map((item) => (
                      <h3
                        key={`name${item._id}`}
                        style={{
                          textAlign: "center",
                          color: "white",
                          marginBottom: 43,
                        }}
                      >
                        {item.name}
                      </h3>
                    ))}
                  </div>
                  <div>
                    <h2 style={{ textAlign: "center", color: "white" }}>
                      Quantity
                    </h2>
                    <hr />
                    {order.items.map((item) => (
                      <div
                        key={`qty${item._id}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <h3 style={{ textAlign: "center", color: "white" }}>
                          {item.quantity}
                        </h3>
                      </div>
                    ))}
                  </div>
                </div>
                <h3 style={{ textAlign: "center", color: "white" }}>
                  Status : {order.status}
                </h3>
                {order.status !== "Delivered" &&
                order.status !== "Cancelled" ? (
                  <>
                    {order.delivery ? (
                      <h3 style={{ textAlign: "center", color: "white" }}>
                        Delivery Person : {order.delivery.name} (
                        {order.delivery.phone})
                      </h3>
                    ) : (
                      <></>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: 50,
                      }}
                    >
                      <Button
                        style={{
                          float: "center",
                          color: "white",
                          backgroundColor: "#b22222",
                        }}
                        onClick={() => {
                          cancelOrder(order);
                        }}
                      >
                        Cancel Order
                      </Button>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </Paper>
            ))}
          </Container>
        )}
      </Grow>
    </>
  );
}
