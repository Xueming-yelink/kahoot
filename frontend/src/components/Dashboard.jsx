import React, { useEffect, useState } from 'react';
import fetchData from '../common/fetchData';
import {
  Card,
  Row,
  Col,
  Space,
  Button,
  Divider,
  Tag,
  Input,
  message,
  Empty,
  Image,
  Typography,
  Modal,
  Descriptions,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import cover from '../img/cover.png';
import sty from './Dashboard.module.css';

const { Paragraph } = Typography;
const { Meta } = Card;

// Dashbord
export default function Dashboard () {
  const navigate = useNavigate();
  const [gameList, setGameList] = useState([]);
  const [gameName, setGameName] = useState('');
  // Game attributes
  const addGameHanlder = async () => {
    if (!gameName) {
      message.error('Game Name cannot be empty!');
      return;
    }
    await fetchData({
      url: '/admin/quiz/new',
      method: 'POST',
      data: {
        name: gameName,
      },
    });
    getGameList();
    message.success('Add Game successfully!');
  };
  // Get games
  const getGameList = async () => {
    const { quizzes } = await fetchData({
      url: '/admin/quiz',
      method: 'GET',
    });
    console.log('quizzes = ', quizzes);
    const newGameList = [];
    for (let i = 0; i < quizzes.length; i++) {
      const quizzeItem = quizzes[i];
      const quizzeItemDetail = await fetchData({
        url: `/admin/quiz/${quizzeItem.id}`,
        method: 'GET',
      });
      const totalTime = quizzeItemDetail.questions.reduce((pre, cur) => {
        return pre + cur.time;
      }, 0);
      const newGameItem = {
        ...quizzeItem,
        ...quizzeItemDetail,
        totalTime,
      };
      if (quizzeItem.active) {
        const gameStatus = await fetchData({
          url: `/admin/session/${quizzeItem.active}/status`,
          method: 'GET',
        });
        newGameItem.gameStatus = gameStatus.results;
        // console.log('gameStatus = ', gameStatus);
      }
      newGameList.push(newGameItem);
    }
    console.log('newGameList = ', newGameList);
    setGameList(newGameList);
  };
  // Game start
  const startGame = async (item) => {
    await fetchData({
      url: `/admin/quiz/${item.id}/start`,
      method: 'POST',
    });
    const quizzeItemDetail = await fetchData({
      url: `/admin/quiz/${item.id}`,
      method: 'GET',
    });
    // game link
    const copyLink = `${window.location.href}GameJoinBoard/${quizzeItemDetail.active}`;
    getGameList();
    Modal.info({
      title: 'Start the game',
      width: 600,
      content: (
        <Paragraph
          tooltips='Copy Link'
          copyable={{
            text: copyLink,
          }}
        >
          <a
            onClick={() => {
              navigate(`/GameJoinBoard/${quizzeItemDetail.active}`);
            }}
          >
            {copyLink}
          </a>
        </Paragraph>
      ),
    });
  };
  // stop
  const stopGame = async (item) => {
    await fetchData({
      url: `/admin/quiz/${item.id}/end`,
      method: 'POST',
    });
    getGameList();
    Modal.confirm({
      title: 'Would you like to view the results?',
      icon: <ExclamationCircleOutlined />,
      okText: 'ok',
      cancelText: 'cancel',
      onOk: () => {
        navigate(`/gameResults/${item.active}/${item.id}`);
      },
    });
    message.success('Stop successfully!');
  };
  // next question
  const anvanceGame = async (item) => {
    await fetchData({
      url: `/admin/quiz/${item.id}/advance`,
      method: 'post',
    });
    getGameList();
    message.success('Next successfull');
  };
  // delete
  const deleteGame = async (item) => {
    await fetchData({
      url: `/admin/quiz/${item.id}`,
      method: 'DELETE',
    });
    getGameList();
    message.success('Delete successfull!');
  };

  useEffect(() => {
    getGameList();
  }, []);
  // dashboard page
  return (
    <Card title='Dashboard' className={sty.box}>
      <div className={sty.addGameBox}>
        <Input
          value={gameName}
          onChange={(e) => {
            setGameName(e.target.value);
          }}
          inputProps={{
            'aria-describedby': 'Game Name',
          }}
          allowClear
          placeholder='Give the game a name'
        />
        <Button onClick={addGameHanlder} type='primary'>
          Create
        </Button>
      </div>
      {gameList.length === 0 && <Empty description='it is empty' />}
      <Row gutter={[20, 20]}>
        {gameList.map((item) => {
          return (
            <Col key={item.id} xs={24} md={12} lg={8} >
              <Card
                cover={<Image alt="game cover" height={200} src={item.thumbnail || cover} />}
              >
                <Space size={30} direction='vertical'>
                  <Meta
                    title={item.name}
                    description={
                      <>
                        <Tag color='red'>{item.questions.length} questions</Tag>
                        <Tag color='blue'>{item.totalTime} seconds</Tag>
                      </>
                    }
                  />

                  <Descriptions
                    column={1}
                    title='Game Status'
                    size='small'
                    extra={
                      <Button
                        disabled={
                          !item.active ||
                          item?.gameStatus?.position ===
                            item.questions.length - 1
                        }
                        size='small'
                        onClick={() => {
                          anvanceGame(item);
                        }}
                        type='primary'
                      >
                        Next
                      </Button>
                    }
                  >
                    <Descriptions.Item label='Current Step'>
                      {item.gameStatus?.position === -1 && 'Ready'}
                      {!item.gameStatus && 'No Start'}
                      {item.gameStatus &&
                        item.gameStatus?.position !== -1 &&
                        item.gameStatus?.position + 1}
                    </Descriptions.Item>
                    <Descriptions.Item label='All Steps'>
                      {item.gameStatus && item.questions.length}
                      {!item.gameStatus && 'No Start'}
                    </Descriptions.Item>
                  </Descriptions>
                </Space>
                <div className={sty.optBox}>
                  {!item.active && (
                    <a
                      onClick={() => {
                        startGame(item);
                      }}
                    >
                      Start Game
                    </a>
                  )}
                  {item.active && (
                    <a
                      onClick={() => {
                        stopGame(item);
                      }}
                      className={sty.danger}
                    >
                      Stop Game
                    </a>
                  )}
                  <Divider type='vertical' />
                  <a
                    onClick={() => {
                      navigate(`/editGame/${item.id}`);
                    }}
                  >
                    Edit
                  </a>
                  <Divider type='vertical' />
                  <a
                    onClick={() => {
                      deleteGame(item);
                    }}
                    className={sty.danger}
                  >
                    Delete
                  </a>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
}
