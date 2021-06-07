import {
  Button,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
} from "@material-ui/core";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { assignOrder } from "../../Actions/ordersAction";
import { updateUser } from "../../Actions/usersAction";

export default function PendingOrder({ order, index, orders, users, socket }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [delivery, setDelivery] = useState("Select a delivery person");
  const [id, setId] = useState("");
  const [load, setLoad] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const assign = async () => {
    if (delivery === "Select a delivery person")
      window.alert("Please select a delivery person");
    else {
      setLoad(true);
      try {
        const user = users.find((user) => user._id === id);
        order.delivery = {
          id,
          name: user.name,
          phone: user.phone,
        };
        order.status = "Dispatched";
        await dispatch(assignOrder(order));
        user.available = false;
        await dispatch(updateUser(user));
        socket.emit("update");
      } catch (e) {
        console.log(e);
        window.alert("Error, something went wrong");
      }
    }
    setLoad(false);
  };
  return (
    <>
      <Paper
        style={{
          backgroundColor: "black",
          padding: "20px 0",
          marginBottom: 30,
        }}
      >
        <h2 style={{ textAlign: "center", color: "white" }}>
          Order Id : {order._id}
        </h2>
        <h3 style={{ textAlign: "center", color: "white" }}>
          Customer : {order.customer.name} ({order.customer.phone})
        </h3>
        {order.delivery ? (
          <h3 style={{ textAlign: "center", color: "white" }}>
            Delivery Person : {order.delivery.name} ({order.delivery.phone})
          </h3>
        ) : (
          <></>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {order.status === "Order Placed" ? (
            <>
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                disabled={
                  !index
                    ? false
                    : orders[index - 1].status === "Order Placed"
                    ? true
                    : false
                }
                onClick={handleClick}
                style={{ backgroundColor: "white", marginRight: 10 }}
              >
                {delivery}
              </Button>
              <Button style={{ backgroundColor: "#79CDCD" }} onClick={assign}>
                Assign
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {users.length ? (
                  users.map((user) => (
                    <MenuItem
                      key={user._id}
                      onClick={() => {
                        setDelivery(user.name);
                        setId(user._id);
                        setAnchorEl(null);
                      }}
                    >
                      {user.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                    }}
                  >
                    None Available
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <></>
          )}
        </div>
        <h3 style={{ textAlign: "center", color: "white" }}>
          Status : {order.status}
        </h3>
        {load ? <LinearProgress /> : <></>}
      </Paper>
    </>
  );
}
