import React, { useEffect, useState } from 'react';
import fetchData from '../common/fetchData';
import {
  Form,
  Card,
  Row,
  Col,
  Space,
  Button,
  Input,
  InputNumber,
  message,
  Upload,
  Select,
} from 'antd';
import { PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import sty from './EditQuestion.module.css';
// Questions
export default function EditQuestion () {
  const navigate = useNavigate();
  const { gameId, questionId } = useParams();
  const [attachType, setAttachType] = useState('');
  const [options, setOptions] = useState([]);
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState([]);
  // Question details
  const getGameDetails = async () => {
    const { questions } = await fetchData({
      url: `/admin/quiz/${gameId}`,
      method: 'GET',
    });
    setQuestions(questions);
    const questionDetail = questions[questionId];
    console.log('questionDetail = ', questionDetail);
    // question details value
    if (questionDetail) {
      const { title, time, points, attach, type, photo, video } =
        questionDetail;
      form.setFieldsValue({
        title,
        time,
        points,
        attach,
        type,
      });
      // photo or video
      setAttachType(attach);
      if (attach === 'photo') {
        form.setFieldsValue({
          photo: [
            {
              url: photo,
            },
          ],
        });
      }
      if (attach === 'video') {
        form.setFieldsValue({
          video,
        });
      }
      setOptions(questionDetail.options || []);
    }
  };

  useEffect(() => {
    getGameDetails();
  }, [gameId]);
  // game options setting
  const editGameHanlder = async (data) => {
    if (options.length < 2 || options.length > 6) {
      message.error('Anywhere between 2 and 6 answers!');
      return;
    }
    const emptyOptions = options.filter((item) => {
      return !item.value;
    });
    if (emptyOptions.length) {
      message.error('Each contain the answer cannot be empty!');
      return;
    }
    const emptyAnswer = options.filter((item) => {
      return item.isAnswer;
    });
    if (!emptyAnswer.length) {
      message.error('The answer cannot be empty!');
      return;
    }
    if (attachType === 'photo') {
      data.photo = data.photo[0].url;
    }
    data.options = options;
    const newQuestions = [...questions];
    newQuestions[questionId] = data;
    await fetchData({
      url: `/admin/quiz/${gameId}`,
      method: 'PUT',
      data: {
        questions: newQuestions,
      },
    });
    message.success('Add Game question successfully!');
    navigate(`/editGame/${gameId}`);
  };

  useEffect(() => {
    // form.setFieldsValue({
    //   name: 55,
    //   thumbnail: [
    //     {
    //       url: cover,
    //     },
    //   ],
    // });
  }, []);

  const normFile = (event) => {
    if (Array.isArray(event)) {
      return event;
    }
    return event?.fileList;
  };
  // Question edit page
  return (
    <Card title='Edit a question' className={sty.box}>
      <Form
        form={form}
        name='form'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          type: 'single',
        }}
        onFinish={editGameHanlder}
        autoComplete='off'
      >
        <Row>
          <Col span={12}>
            <Form.Item
              label='Title'
              name='title'
              rules={[{ required: true, message: 'Title cannot be empty!' }]}
            >
              <Input
                inputProps={{
                  'aria-describedby': 'Question Title',
                }}
              />
            </Form.Item>
            <Form.Item
              label='Type'
              name='type'
              rules={[{ required: true, message: 'Type cannot be empty!' }]}
            >
              <Select
                options={[
                  {
                    value: 'single',
                    label: 'single',
                  },
                  {
                    value: 'multiple',
                    label: 'multiple',
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              label='Time'
              name='time'
              rules={[
                {
                  required: true,
                  message: 'Time cannot be empty!',
                },
              ]}
            >
              <InputNumber
                min={0}
                inputProps={{
                  'aria-describedby': 'Question Limit Time',
                }}
              />
            </Form.Item>

            <Form.Item
              label='Points'
              name='points'
              rules={[{ required: true, message: 'Points cannot be empty!' }]}
            >
              <InputNumber
                min={0}
                inputProps={{
                  'aria-describedby': 'Question Points',
                }}
              />
            </Form.Item>

            <Form.Item label='Attach' name='attach'>
              <Select
                onChange={(type) => {
                  setAttachType(type);
                }}
                options={[
                  {
                    value: 'photo',
                    label: 'photo',
                  },
                  {
                    value: 'video',
                    label: 'video',
                  },
                ]}
              />
            </Form.Item>
            {attachType === 'photo' && (
              <Form.Item
                name='photo'
                label='Photo'
                valuePropName='fileList'
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: true,
                    message: 'Please upload the photo!',
                  },
                ]}
              >
                <Upload
                  maxCount={1}
                  beforeUpload={(file) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const base64String = reader.result;
                      form.setFieldsValue({
                        photo: [
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
            )}
            {attachType === 'video' && (
              <Form.Item
                label='Video'
                name='video'
                rules={[
                  {
                    required: true,
                    message: 'A URL to a youtube video cannot be empty!',
                  },
                ]}
              >
                <Input
                  inputProps={{
                    'aria-describedby': 'A URL to a youtube video',
                  }}
                  placeholder='A URL to a youtube video'
                />
              </Form.Item>
            )}
          </Col>
          <Col span={12}>
            <Form.Item label='Add an option'>
              <Button
                size='small'
                type='primary'
                onClick={() => {
                  const newOptions = [...options];
                  newOptions.push({
                    value: '',
                  });
                  setOptions(newOptions);
                }}
              >
                Add
              </Button>
            </Form.Item>
            {options.map((item, index) => {
              return (
                <Form.Item key={index} label={`${index + 1}.`} colon={false}>
                  <Space>
                    <Input
                      value={item.value}
                      inputProps={{
                        'aria-describedby': 'Question Option',
                      }}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index].value = e.target.value;
                        setOptions(newOptions);
                      }}
                    ></Input>
                    <Button
                      size='small'
                      type='primary'
                      danger
                      onClick={() => {
                        const newOptions = [...options];
                        newOptions.splice(index, 1);
                        setOptions(newOptions);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => {
                        const newOptions = [...options];
                        const qType = form.getFieldValue('type');
                        console.log('qType = ', qType);
                        if (qType === 'single') {
                          newOptions.forEach((optionItem) => {
                            optionItem.isAnswer = false;
                          });
                          newOptions[index].isAnswer = true;
                        } else {
                          newOptions[index].isAnswer =
                            !newOptions[index].isAnswer;
                        }
                        setOptions(newOptions);
                      }}
                      size='small'
                      type={item.isAnswer ? 'primary' : 'default'}
                      shape='circle'
                      icon={<CheckCircleOutlined />}
                    />
                  </Space>
                </Form.Item>
              );
            })}
          </Col>
          <Col span={24}>
            <Form.Item
              wrapperCol={{
                offset: 12,
                span: 12,
              }}
            >
              <Button
                type='primary'
                onClick={() => {
                  form.submit();
                }}
              >
                Save
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
