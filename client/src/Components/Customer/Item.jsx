import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { addOrder, deleteOrder, updateOrder } from "../../Actions/ordersAction";

const useStyles = makeStyles({
  media: {
    height: "50%",
    paddingTop: "66.25%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // backgroundBlendMode: "darken",
  },
  card: {
    backgroundColor: "black",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    position: "relative",
  },
  cardActions: {
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
  },
  heading: { textAlign: "center", color: "white", fontWeight: "bold" },
});

const fnb =
  "https://freedesignfile.com/upload/2018/02/Coffee-with-chocolate-chip-cookie-and-coffee-beans-Stock-Photo.jpg";
const grocery =
  "https://media.istockphoto.com/vectors/grocery-store-background-vector-id486918968";
const pharmacy = "https://wallpapercave.com/wp/wp1931709.jpg";

export default function Item({ item, user, kart }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  let qty = 0;
  if (kart) {
    const present = kart.items.find((i) => i._id === item._id);
    if (present) qty = present.quantity;
  }

  const addItem = () => {
    if (!kart) {
      const newKart = {
        items: [{ ...item, quantity: 1 }],
        customer: {
          id: user._id,
          name: user.name,
          phone: user.phone,
        },
        status: "In Kart",
      };
      dispatch(addOrder(newKart));
    } else {
      const findIndex = kart.items.findIndex((i) => i._id === item._id);
      if (findIndex === -1) {
        kart.items.push({ ...item, quantity: 1 });
      } else kart.items[findIndex].quantity += 1;
      dispatch(updateOrder(kart));
    }
  };

  const removeItem = () => {
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

  return (
    <>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image={
            item.category === "Food and Beverages"
              ? fnb
              : item.category === "Grocery"
              ? grocery
              : pharmacy
          }
          title={item.category}
        />
        <CardContent>
          <Typography className={classes.heading} variant="h5">
            {item.name}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button
            disabled={qty === 0 ? true : false}
            style={{ fontSize: "25px", backgroundColor: "white" }}
            onClick={removeItem}
          >
            -
          </Button>
          <Typography variant="h5" style={{ color: "white" }}>
            {qty}
          </Typography>
          <Button
            style={{ fontSize: "25px", backgroundColor: "white" }}
            onClick={addItem}
          >
            +
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
