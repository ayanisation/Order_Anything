import {
  CircularProgress,
  Container,
  Grid,
  Grow,
  makeStyles,
} from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { fetchItems } from "../../Actions/itemsAction";
import { customerOrders } from "../../Actions/ordersAction";
import CustomerHeader from "./CustomerHeader";
import Item from "./Item";

const useStyles = makeStyles(() => ({
  mainContainer: {
    display: "flex",
    alignItems: "center",
    padding: 40,
    marginTop: 25,
  },
}));

export default function Customer() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const user = JSON.parse(localStorage.getItem("profile"));
  if (!user || user?.userType !== "Customer") history.goBack();

  useEffect(() => {
    dispatch(fetchItems());
    dispatch(customerOrders(user._id));
  }, [dispatch, user._id]);

  const items = useSelector((state) => state.items);
  const orders = useSelector((state) => state.orders);
  const kart = orders.find((order) => order.status === "In Kart");

  return (
    <>
      <CustomerHeader title="Order Anything" />
      <Grow in>
        {!items.length ? (
          <Container
            maxWidth="sm"
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 100,
            }}
          >
            <CircularProgress />
          </Container>
        ) : (
          <Container maxWidth="md">
            <Grid
              className={classes.mainContainer}
              container
              alignItems="stretch"
              spacing={3}
            >
              {items.map((item) => (
                <Grid key={item._id} item xs={12} sm={4}>
                  <Item item={item} user={user} kart={kart} />
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </Grow>
    </>
  );
}
