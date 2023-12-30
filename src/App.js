import { ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRoutes } from "./routes";

const App = () => {
  const theme = createTheme();
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
