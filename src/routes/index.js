import { Route, Routes } from "react-router-dom";
import MainForm from "../components/form";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<MainForm />} />
      <Route path="/edit" exact element={<MainForm />} />
    </Routes>
  );
};
