import React, { useEffect } from "react";
import { useNavigate, Route, Routes, Outlet } from "react-router-dom";
import fetchData, { getToken } from "../common/fetchData";
import { Button } from "antd";
import {
  HomeOutlined,
  LoadingOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import sty from "./Wrap.module.css";

export default function Wrap() {
  const navigate = useNavigate();
  const logoutHandler = async () => {
    await fetchData({
      url: "/admin/auth/logout",
      method: "POST",
    });
    window.localStorage.removeItem("token");
    navigate("/login");
  };
  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    }
  }, []);

  return (
    <div className={sty.box}>
      <nav className={sty.navBox}>
        <HomeOutlined
          onClick={() => {
            navigate("/");
          }}
          className={sty.logo}
        />
        <Button onClick={logoutHandler} size="small" type="primary" danger>
          Logout
        </Button>
      </nav>
      <main className={sty.mainBox}>
        <Outlet />
      </main>
    </div>
  );
}
