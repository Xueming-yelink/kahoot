import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import fetchData, { getToken } from '../common/fetchData';
import { Button } from 'antd';
import {
  HomeOutlined
} from '@ant-design/icons';
import sty from './Wrap.module.css';
// wrap
export default function Wrap () {
  const navigate = useNavigate();
  const logoutHandler = async () => {
    await fetchData({
      url: '/admin/auth/logout',
      method: 'POST',
    });
    window.localStorage.removeItem('token');
    navigate('/login');
  };
  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
    }
  }, []);
  // page
  return (
    <header className={sty.box}>
      <nav className={sty.navBox}>
        <HomeOutlined
          onClick={() => {
            navigate('/');
          }}
          className={sty.logo}
        />
        <Button onClick={logoutHandler} size='small' type='primary' danger>
          Logout
        </Button>
      </nav>
      <main className={sty.mainBox}>
        <Outlet />
      </main>
    </header>
  );
}
