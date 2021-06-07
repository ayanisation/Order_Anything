import axios from "axios";

const API = axios.create({
  baseURL: "https://order-anything.herokuapp.com/users",
});

export const fetchUsers = () => async (dispatch) => {
  try {
    const { data } = await API.get("/");
    dispatch({ type: "FETCH_USERS", payload: data });
  } catch (e) {
    console.log(e);
  }
};

export const signup = (user) => async (dispatch) => {
  try {
    const { data } = await API.post("/signup", user);
    dispatch({ type: "AUTH", payload: { ...data._doc, token: data.token } });
    return "Success";
  } catch (e) {
    console.log(e);
    return e.response.message;
  }
};

export const login = (user) => async (dispatch) => {
  try {
    const { data } = await API.post("/login", user);
    dispatch({ type: "AUTH", payload: { ...data._doc, token: data.token } });
    return "Success";
  } catch (e) {
    console.log(e);
    return e.response.message;
  }
};

export const updateUser = (user) => async (dispatch) => {
  try {
    const { data } = await API.patch("/", user);
    dispatch({ type: "UPDATE_USER", payload: data });
  } catch (e) {
    console.log(e);
  }
};
