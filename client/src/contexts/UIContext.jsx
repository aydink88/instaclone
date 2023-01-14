import * as React from "react";

const context = React.createContext();

export const UIProvider = (props) => {
  const [uiState, setState] = React.useState({
    toast: { variant: "info", title: "info", message: "" },
  });

  const setToast = (message, title = "info", variant = "info") => {
    setState((prev) => ({ ...prev, toast: { message, title, variant } }));
  };
  return <context.Provider value={{ uiState, setToast }} {...props} />;
};

export const useUIContext = () => {
  const ctx = React.useContext(context);

  if (!ctx) {
    throw new Error("context should be in the provider");
  }

  return ctx;
};
