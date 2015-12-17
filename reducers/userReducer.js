const userReducer = {
  setUser(state, user) {
    return Object.assign({}, state, { user });
  }
};

export default userReducer;
