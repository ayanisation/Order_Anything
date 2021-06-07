import axios from "axios";

const API = axios.create({
  baseURL: "https://order-anything.herokuapp.com/items",
});

export const fetchItems = () => async (dispatch) => {
  try {
    const { data } = await API.get("/");
    dispatch({ type: "FETCH_ITEMS", payload: data });
  } catch (e) {
      console.log(e);
  }
};
