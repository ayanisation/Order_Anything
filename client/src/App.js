import "./App.css";
import { Redirect, Route, Switch } from "react-router";
import Homepage from "./Components/Homepage";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import Customer from "./Components/Customer/Customer";
import Kart from "./Components/Customer/Kart";
import MyOrders from "./Components/Customer/MyOrders";
import Admin from "./Components/Admin/Admin";
import Delivery from "./Components/Delivery/Delivery";
import MyDeliveries from "./Components/Delivery/MyDeliveries";

function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/login/:type" component={Login} />
        <Route exact path="/signup/" component={Signup} />
        <Route exact path="/items/" component={Customer} />
        <Route exact path="/kart/" component={Kart} />
        <Route exact path="/orders" component={MyOrders} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/active" component={Delivery} />
        <Route exact path="/deliveries" component={MyDeliveries} />
        <Redirect to="/" />
      </Switch>
    </>
  );
}

export default App;
