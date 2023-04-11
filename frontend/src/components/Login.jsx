import React from 'react';
import { Card, Form, Input, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import fetchData from '../common/fetchData';
import sty from './Login.module.css';

export default function Login () {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onFinish = async (data) => {
    const { token } = await fetchData({
      url: '/admin/auth/login',
      method: 'POST',
      data,
    });
    window.localStorage.setItem('token', token);
    message.success('Login successful!');
    navigate('/');
  };

  return (
    <div className={sty.box}>
      <Card className={sty.card} title='Login' bordered={false}>
        <Form
          form={form}
          name='form'
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={onFinish}
          autoComplete='off'
        >
          <Form.Item
            label='Email'
            name='email'
            rules={[{ required: true, message: 'Email cannot be empty!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name='password'
            label='Password'
            rules={[
              {
                required: true,
                message: 'Password cannot be empty!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Space>
              <Button
                type='primary'
                onClick={() => {
                  form.submit();
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  navigate('/register');
                }}
                type='link'
              >do not have an account yet, register now</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
