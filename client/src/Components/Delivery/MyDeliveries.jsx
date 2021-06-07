import { Container, Grow, Paper } from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deliveryOrders } from "../../Actions/ordersAction";
import io from "socket.io-client";
import DeliveryHeader from "./DeliveryHeader";
import { useHistory } from "react-router";

const ENDPOINT = "https://order-anything.herokuapp.com/";
const socket = io.connect(ENDPOINT);

export default function MyDeliveries() {
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

  let orders = useSelector((state) => state.orders);

  return (
    <>
      <DeliveryHeader title="Delivery History" />
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
            <h3>No deliveries yet</h3>
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
              </Paper>
            ))}
          </Container>
        )}
      </Grow>
    </>
  );
}
