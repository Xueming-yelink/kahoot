import React from 'react';
import { Card, Form, Input, Button, Space, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import fetchData from '../common/fetchData';
import sty from './Login.module.css';
// login
export default function Login () {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  // const handleKeyPress = (event) => {
  //   if (event.keyCode === 13) {
  //     form.submit();
  //   }
  // };
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
  // login page
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
          // onKeyDown={handleKeyPress}
          autoComplete='off'
        >
          <Form.Item
            label='Email'
            name='email'
            rules={[{ required: true, message: 'Email cannot be empty!' }]}
          >
            <Input
                inputProps={{
                  'aria-describedby': 'Email',
                }}
            />
          </Form.Item>

          <Form.Item
            name='password'
            label='Password'
            inputProps={{
              'aria-describedby': 'Password',
            }}
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
                onClick={(e) => {
                  e.preventDefault();
                  form.submit();
                }}
              >
                Login
              </Button>
            </Space>
          </Form.Item>
          <Row justify='center'>
            <Col>
              <Button
                onClick={() => {
                  navigate('/register');
                }}
                type='link'
              >
                do not have an account yet, register now
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}
