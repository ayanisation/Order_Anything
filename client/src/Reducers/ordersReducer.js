const ordersReducer = (orders = [], action) => {
  switch (action.type) {
    case "FETCH_ORDERS":
      return action.payload;
    case "ADD_ORDER":
      return [...orders, action.payload];
    case "UPDATE_ORDER":
      return orders.map((order) =>
        order._id === action.payload._id ? action.payload : order
      );
    case "DELETE_ORDER":
      return orders.filter((order) => order._id !== action.payload);
    default:
      return orders;
  }
};
export default ordersReducer;
