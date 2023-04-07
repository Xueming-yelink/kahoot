import React, { useEffect, useState } from "react";
import fetchData from "../common/fetchData";
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
} from "antd";
import { useNavigate } from "react-router-dom";
import sty from "./Dashboard.module.css";

const { Meta } = Card;
export default function Dashboard() {
  const navigate = useNavigate();
  const [gameList, setGameList] = useState([]);
  const [gameName, setGameName] = useState("");
  const addGameHanlder = async () => {
    if (!gameName) {
      message.error("Game Name cannot be empty!");
      return;
    }
    await fetchData({
      url: "/admin/quiz/new",
      method: "POST",
      data: {
        name: gameName,
      },
    });
    getGameList();
    message.success("Add Game successfully!");
  };
  const getGameList = async () => {
    const { quizzes } = await fetchData({
      url: "/admin/quiz",
      method: "GET",
    });
    const newGameList = [];
    for (let i = 0; i < quizzes.length; i++) {
      const quizzeItem = quizzes[i];
      const quizzeItemDetail = await fetchData({
        url: `/admin/quiz/${quizzeItem.id}`,
        method: "GET",
      });
      const totalTime = quizzeItemDetail.questions.reduce(
        (pre, cur) => {
          return pre.time + cur.time;
        },
        {
          time: 0,
        }
        
      );
      newGameList.push({
        ...quizzeItem,
        ...quizzeItemDetail,
        totalTime,
      });
    }
  };

  useEffect(() => {}, []);

  return (
    <Card title="Dashboard" className={sty.box}>
      <div className={sty.addGameBox}>
        <Input
          value={gameName}
          onChange={(e) => {
            setGameName(e.target.value);
          }}
          allowClear
          placeholder="Give the game a name"
        />
        <Button onClick={addGameHanlder} type="primary">
          Submit
        </Button>
      </div>
      <Row gutter={[20, 20]}>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="cover"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
          >
            <Meta
              title="Europe Street beat"
              description={
                <>
                  <Tag color="red">15 questions</Tag>
                  <Tag color="blue">30 seconds</Tag>
                </>
              }
            />
            <div className={sty.optBox}>
              <a href="#">Start Game</a>
              <Divider type="vertical" />
              <a href="#">Edit</a>
              <Divider type="vertical" />
              <a className={sty.danger} href="#">
                Delete
              </a>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
