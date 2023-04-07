import React from "react";
import "antd/dist/antd.css";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Wrap from "./components/Wrap.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Ttt from "./components/Ttt.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Wrap />}>
          <Route index element={<Dashboard />} />
          <Route path="ttt" element={<Ttt />} />
        </Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
      <Outlet />
    </>
  );
}

export default App;
