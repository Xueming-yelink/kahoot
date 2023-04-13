import React, { useEffect, useState, useRef } from 'react';
import fetchData from '../common/fetchData';
import {
  Form,
  Card,
  Space,
  Button,
  Tag,
  Input,
  Table,
  Statistic,
  Image,
  Result,
  Typography,
  Row,
  Col,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import sty from './GameBoard.module.css';

const { Paragraph, Text } = Typography;
const { Countdown } = Statistic;
const columns = [
  {
    title: 'Question',
    dataIndex: 'question',
    key: 'question',
    render: (text, record, order) => {
      return order + 1;
    },
  },
  {
    title: 'QuestionStartedAt',
    dataIndex: 'questionStartedAt',
    key: 'questionStartedAt',
  },
  {
    title: 'AnsweredAt',
    dataIndex: 'answeredAt',
    key: 'answeredAt',
  },
  {
    title: 'Result',
    dataIndex: 'correct',
    key: 'correct',
    render: (text, record, order) => {
      if (record.correct) {
        return <CheckCircleOutlined className={sty.r} />;
      }
      return <CloseCircleOutlined className={sty.w} />;
    },
  },
];
let loop = null;
export default function GameBoard () {
  const { playerId } = useParams();
  const questionItemRef = useRef({});
  const [questionItem, setQuestionItem] = useState({});
  const [answerIds, setAnswerIds] = useState([]);
  const [answerRight, setAnserRight] = useState(false);
  const [results, setResults] = useState([
    {
      correct: false,
    },
    {
      correct: true,
    },
  ]);
  const [options, setOptions] = useState([]);
  const [now, setNow] = useState(0);
  const [gameStatus, setGameStatus] = useState('');

  const getGameStatus = async () => {
    try {
      const { started } = await fetchData({
        url: `/play/${playerId}/status`,
        method: 'GET',
      });
      setGameStatus(started);
      if (started) {
        const { question } = await fetchData({
          url: `/play/${playerId}/question`,
          method: 'GET',
        });
        // console.log('question = ', question);
        // console.log('questionItemRef.current.title = ', questionItemRef.current)
        if (
          JSON.stringify(questionItemRef.current) !== JSON.stringify(question)
        ) {
          setQuestionItem(question);
          const newOptions = question.options.map(({ value }) => {
            return {
              value,
            };
          });
          setOptions(newOptions);
          setNow(Date.now());
          questionItemRef.current = question;
          setAnswerIds([]);
        }
      }
    } catch (error) {
      setGameStatus('done');
      const myGameResults = await fetchData({
        url: `/play/${playerId}/results`,
        method: 'GET',
      });
      console.log('myGameResults = ', myGameResults);
      setResults(myGameResults);
      if (loop) {
        clearInterval(loop);
      }
    }
  };

  useEffect(() => {
    if (playerId) {
      getGameStatus();
      loop = setInterval(() => {
        getGameStatus();
      }, 1000);
      return () => {
        clearInterval(loop);
      };
    }
  }, [playerId]);

  return (
    <Card title='Play Game' className={sty.box}>
      {gameStatus === false && (
        <Result title='The game has not started, please be patient and wait' />
      )}
      {gameStatus === 'done' && (
        <Table className={sty.table} dataSource={results} pagination={false} columns={columns} />
      )}
      {gameStatus === true && (
        <Card>
          <Row>
            <Col xs={24} sm={12}>
              <Row justify='center'>
                <Col><h1>{questionItem.title}</h1></Col>
              </Row>
            </Col>
          </Row>
          <Row align='middle' justify='center'>
            <Col xs={24} sm={12}>
              <Row justify='center'>
                <Col>
                  <Countdown
                    value={now + 1000 * questionItem.time}
                    onFinish={async () => {
                      const resData = await fetchData({
                        url: `/play/${playerId}/answer`,
                        method: 'GET',
                      });
                      setAnswerIds(resData.answerIds);
                      const myAnswerIds = [];
                      options.forEach((item, index) => {
                        if (item.isAnswer) {
                          myAnswerIds.push(index);
                        }
                      });
                      setAnserRight(
                        JSON.stringify(resData.answerIds) ===
                          JSON.stringify(myAnswerIds)
                      );
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={12}>
              <Row justify='center'>
                <Col>
                  <Tag color='red'>{questionItem.points} points</Tag>
                  <Tag color='blue'>{questionItem.type}</Tag>
                </Col>
              </Row>
            </Col>
          </Row>

          {answerRight && answerIds.length > 0 && (
            <Result status='success' title='Correct answer' />
          )}
          {!answerRight && answerIds.length > 0 && (
            <Result status='error' title='Incorrect answer'>
              <Paragraph>
                <Text
                  strong
                  style={{
                    fontSize: 16,
                  }}
                >
                  The correct answer is:
                </Text>
              </Paragraph>
              {answerIds.map((item, index) => {
                return <Paragraph key={item}>Options {index + 1}</Paragraph>;
              })}
            </Result>
          )}

          <div className={sty.center}>
            {questionItem.photo && <Image src={questionItem.photo}></Image>}
            {questionItem.video && (
              <video controls src={questionItem.video}></video>
            )}
            <div className={sty.options}>
              {options.map((item, index) => {
                return (
                  <Form.Item key={index} label={`${index + 1}.`} colon={false}>
                    <Space>
                      <Input
                        value={item.value}
                        readOnly
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index].value = e.target.value;
                          setOptions(newOptions);
                        }}
                      ></Input>
                      <Button
                        onClick={async () => {
                          const newOptions = [...options];
                          const qType = questionItem.type;
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
                          const myAnswerIds = [];
                          newOptions.forEach((item, index) => {
                            if (item.isAnswer) {
                              myAnswerIds.push(index);
                            }
                          });
                          await fetchData({
                            url: `/play/${playerId}/answer`,
                            method: 'PUT',
                            data: {
                              answerIds: myAnswerIds,
                            },
                          });
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
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
}
