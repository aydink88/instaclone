import { createContext, useContext, useReducer } from "react";

const UserContext = createContext();

const initialState = {
  _id: "",
  name: "",
  email: "",
  followers: [],
  following: [],
  pic: "",
};

const reducer = (state, action) => {
  if (action.type === "USER") {
    return action.payload;
  }
  if (action.type === "CLEAR") {
    return initialState;
  }
  if (action.type === "UPDATE") {
    return {
      ...state,
      followers: action.payload.followers,
      following: action.payload.following,
    };
  }
  if (action.type === "UPDATEPIC") {
    return {
      ...state,
      pic: action.payload,
    };
  }
  return state;
};

export const UserProvider = (props) => {
  const initialUser = JSON.parse(localStorage.getItem("user"));

  const [state, dispatch] = useReducer(reducer, { ...initialState, ...initialUser });

  return <UserContext.Provider value={{ state, dispatch }} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a Provider`);
  }
  return context;
};
