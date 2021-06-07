const usersReducer = (users = [], action) => {
  switch (action.type) {
    case "AUTH":
      localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
      return users;
    case "FETCH_USERS":
      return action.payload;
    case "UPDATE_USER":
      return users.map((user) =>
        user._id === action.payload._id ? action.payload : user
      );
    case "LOGOUT":
      localStorage.clear();
      return [];
    default:
      return users;
  }
};

export default usersReducer;
