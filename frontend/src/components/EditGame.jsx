import React, { useEffect, useState } from 'react';
import fetchData from '../common/fetchData';
import {
  Form,
  Card,
  Space,
  Button,
  Divider,
  Tag,
  Input,
  message,
  Upload,
  Table,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import sty from './EditGame.module.css';

export default function EditGame () {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState([]);
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
    },
    {
      title: 'type',
      key: 'type',
      dataIndex: 'type',
      render: (_, { type }) => (
        <>
          {type === 'single' && <Tag color='#2db7f5'>single</Tag>}
          {type === 'multiple' && <Tag color='#108ee9'>multiple</Tag>}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record, index) => (
        <Space size='middle'>
          <a
            onClick={() => {
              navigate(`/editQuestion/${gameId}/${index}`);
            }}
          >
            Edit
          </a>
          <a
            onClick={() => {
              const newQuestions = [...questions];
              newQuestions.splice(index, 1);

              fetchData({
                url: `/admin/quiz/${gameId}`,
                method: 'PUT',
                data: {
                  questions: newQuestions,
                },
              }).then(() => {
                setQuestions(newQuestions);
                message.success('Delete successful!');
              });
            }}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];

  const getGameDetails = async () => {
    const { name, thumbnail, questions } = await fetchData({
      url: `/admin/quiz/${gameId}`,
      method: 'GET',
    });
    setQuestions(questions);
    const fieldsValue = {
      name,
    };
    if (thumbnail) {
      fieldsValue.thumbnail = [
        {
          url: thumbnail,
        },
      ];
    }
    form.setFieldsValue(fieldsValue);
  };

  useEffect(() => {
    getGameDetails();
  }, [gameId]);

  const editGameHanlder = async ({ name, thumbnail }) => {
    await fetchData({
      url: `/admin/quiz/${gameId}`,
      method: 'PUT',
      data: {
        name,
        thumbnail: thumbnail.length ? thumbnail[0].url : null,
      },
    });
    message.success('Edit Game successfully!');
  };

  const normFile = (event) => {
    if (Array.isArray(event)) {
      return event;
    }
    return event?.fileList;
  };

  return (
    <Card title='Dashboard' className={sty.box}>
      <Card
        title='Basic information'
        extra={
          <Button
            type='primary'
            onClick={() => {
              form.submit();
            }}
          >
            Enter
          </Button>
        }
      >
        <Form
          form={form}
          name='form'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={editGameHanlder}
          autoComplete='off'
        >
          <Form.Item
            label='Name'
            name='name'
            rules={[{ required: true, message: 'Game Name cannot be empty!' }]}
          >
            <Input
              inputProps={{
                'aria-describedby': 'Game Name',
              }}
            />
          </Form.Item>

          <Form.Item
            name='thumbnail'
            label='Thumbnail'
            valuePropName='fileList'
            getValueFromEvent={normFile}
          >
            <Upload
              maxCount={1}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const base64String = reader.result;
                  form.setFieldsValue({
                    thumbnail: [
                      {
                        url: base64String,
                      },
                    ],
                  });
                };
                reader.readAsDataURL(file);
                return false;
              }}
              listType='picture-card'
            >
              <PlusOutlined />
            </Upload>
          </Form.Item>
        </Form>
      </Card>
      <Card title='Game questions'>
        <Button
          type='primary'
          onClick={() => {
            navigate(`/newQuestion/${gameId}`);
          }}
        >
          Add a new question
        </Button>
        <Divider />
        <Table
          pagination={false}
          rowKey='title'
          columns={columns}
          className={sty.table}
          dataSource={questions}
        />
      </Card>
    </Card>
  );
}
