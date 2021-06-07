import { combineReducers } from "redux";
import usersReducer from "./usersReducer";
import itemsReducer from "./itemsReducer";
import ordersReducer from "./ordersReducer";

const rootReducer = combineReducers({
  users: usersReducer,
  items: itemsReducer,
  orders: ordersReducer,
});

export default rootReducer;
