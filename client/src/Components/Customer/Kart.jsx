import {
  Button,
  Container,
  Grow,
  IconButton,
  LinearProgress,
  Paper,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomerHeader from "./CustomerHeader";
import {
  addOrder,
  customerOrders,
  deleteOrder,
  updateOrder,
} from "../../Actions/ordersAction";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { useHistory } from "react-router";
import io from "socket.io-client";

const ENDPOINT = "https://order-anything.herokuapp.com/";
const socket = io.connect(ENDPOINT);

export default function Kart() {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = JSON.parse(localStorage.getItem("profile"));
  if (!user || user?.userType !== "Customer") history.goBack();

  const [load, setLoad] = useState(false);

  useEffect(() => {
    dispatch(customerOrders(user._id));
  }, [dispatch, user._id]);

  const orders = useSelector((state) => state.orders);
  const kart = orders.find((order) => order.status === "In Kart");

  const addItem = (item) => {
    if (!kart) {
      const newKart = {
        items: [{ ...item, quantity: 1 }],
        customer: user._id,
        status: "In Kart",
      };
      console.log(newKart);
      dispatch(addOrder(newKart));
    } else {
      const findIndex = kart.items.findIndex((i) => i._id === item._id);
      if (findIndex === -1) {
        kart.items.push({ ...item, quantity: 1 });
      } else kart.items[findIndex].quantity += 1;
      dispatch(updateOrder(kart));
    }
  };

  const removeItem = (item) => {
    const findIndex = kart.items.findIndex((i) => i.name === item.name);
    if (kart.items[findIndex].quantity === 1) {
      if (kart.items.length === 1) dispatch(deleteOrder(kart._id));
      else {
        kart.items.splice(findIndex, 1);
        dispatch(updateOrder(kart));
      }
    } else {
      kart.items[findIndex].quantity -= 1;
      dispatch(updateOrder(kart));
    }
  };

  const placeOrder = async () => {
    if (
      orders.findIndex(
        (order) => order.status !== "In Kart" && order.status !== "Delivered"
      ) !== -1
    ) {
      window.alert("Can't place order before previous order is delivered");
      return;
    }
    setLoad(true);
    try {
      kart.status = "Order Placed";
      await dispatch(updateOrder(kart));
      socket.emit("update");
      history.push("/orders");
    } catch (e) {
      window.alert("Something went wrong");
      setLoad(false);
    }
  };

  return (
    <>
      <CustomerHeader title="Kart" />
      <Grow in>
        <Container maxWidth="md" style={{ marginTop: 60 }}>
          <Paper style={{ backgroundColor: "black", padding: "20px 0" }}>
            {kart ? (
              <>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <h1 style={{ textAlign: "center", color: "white" }}>
                      Item
                    </h1>
                    <hr />
                    {kart.items.map((item) => (
                      <h2
                        key={`name${item._id}`}
                        style={{
                          textAlign: "center",
                          color: "white",
                          marginBottom: 43,
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
                    {kart.items.map((item) => (
                      <div
                        key={`qty${item._id}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <IconButton
                          onClick={() => {
                            removeItem(item);
                          }}
                        >
                          <RemoveCircle
                            fontSize="large"
                            style={{ color: "white" }}
                          />
                        </IconButton>
                        <h2 style={{ textAlign: "center", color: "white" }}>
                          {item.quantity}
                        </h2>
                        <IconButton
                          onClick={() => {
                            addItem(item);
                          }}
                        >
                          <AddCircle
                            fontSize="large"
                            style={{ color: "white" }}
                          />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <Button
                    style={{
                      color: "white",
                      backgroundColor: "green",
                    }}
                    onClick={placeOrder}
                  >
                    Place Order
                  </Button>
                  <Button
                    style={{
                      color: "white",
                      backgroundColor: "#b22222",
                    }}
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you wish to clear the Kart?"
                        )
                      ) {
                        dispatch(deleteOrder(kart._id));
                        history.push("/items");
                      }
                    }}
                  >
                    Clear Kart
                  </Button>
                </div>
              </>
            ) : (
              <h1 style={{ color: "white", textAlign: "center" }}>
                Kart empty
              </h1>
            )}
            {load && <LinearProgress />}
          </Paper>
        </Container>
      </Grow>
    </>
  );
}
