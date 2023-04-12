import React, { useEffect } from 'react';
import fetchData from '../common/fetchData';
import { Form, Card, Button, Input, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import sty from './GameJoinBoard.module.css';

export default function GameJoinBoard () {
  const navigate = useNavigate();
  const { sessionid } = useParams();
  const [form] = Form.useForm();

  const editGameHanlder = async ({ name, sessionId }) => {
    const { playerId } = await fetchData({
      url: `/play/join/${sessionId}`,
      method: 'POST',
      data: {
        name,
      },
    });
    message.success('Join Game successfully!');
    navigate(`/gameBoard/${playerId}`);
  };

  useEffect(() => {
    form.setFieldsValue({
      sessionId: sessionid,
    });
  }, []);

  return (
    <Card title='Play Join' className={sty.box}>
      <Form
        form={form}
        name='form'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={editGameHanlder}
        autoComplete='off'
      >
        <Form.Item
          label='Session Id'
          name='sessionId'
          rules={[{ required: true, message: 'Session Id cannot be empty!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Name'
          name='name'
          rules={[{ required: true, message: 'Name cannot be empty!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            type='primary'
            onClick={() => {
              form.submit();
            }}
          >
            Play Game
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
