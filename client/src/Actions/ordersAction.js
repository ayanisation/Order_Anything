import axios from "axios";

const getToken = () => {
  const token = JSON.parse(localStorage.getItem("profile"))?.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return config;
};

const baseUrl = "https://order-anything.herokuapp.com/orders";

export const customerOrders = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`${baseUrl}/customer/${id}`);
    dispatch({ type: "FETCH_ORDERS", payload: data });
  } catch (e) {
    console.log(e);
  }
};

export const deliveryOrders = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`${baseUrl}/delivery/${id}`);
    dispatch({ type: "FETCH_ORDERS", payload: data });
  } catch (e) {
    console.log(e);
  }
};

export const pendingOrders = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${baseUrl}/pending`);
    dispatch({ type: "FETCH_ORDERS", payload: data });
  } catch (e) {
    console.log(e);
  }
};

export const addOrder = (order) => async (dispatch) => {
  try {
    const config = getToken();
    const { data } = await axios.post(baseUrl, order, config);
    dispatch({ type: "ADD_ORDER", payload: data });
  } catch (e) {
    console.log(e);
  }
};

export const updateOrder = (order) => async (dispatch) => {
  try {
    const config = getToken();
    const { data } = await axios.patch(baseUrl, order, config);
    dispatch({ type: "UPDATE_ORDER", payload: data });
  } catch (e) {
    console.log(e);
  }
};


export const assignOrder = (order) => async (dispatch) => {
  try {
    const config = getToken();
    const { data } = await axios.patch(`${baseUrl}/assign`, order, config);
    dispatch({ type: "UPDATE_ORDER", payload: data });
  } catch (e) {
    console.log(e);
  }
};

export const deleteOrder = (id) => async (dispatch) => {
  try {
    const config = getToken();
    await axios.delete(`${baseUrl}/${id}`, config);
    dispatch({ type: "DELETE_ORDER", payload: id });
  } catch (e) {
    console.log(e);
  }
};
