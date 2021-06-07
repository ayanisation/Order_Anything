const itemsReducer = (items = [], action) => {
  switch (action.type) {
    case "FETCH_ITEMS":
      return action.payload;
    default:
      return items;
  }
};
export default itemsReducer;
