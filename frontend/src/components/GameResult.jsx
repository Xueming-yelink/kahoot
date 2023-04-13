import React, { useEffect, useState } from 'react';
import fetchData from '../common/fetchData';
import { Card, Table } from 'antd';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Line, Pie } from '@ant-design/plots';
import sty from './GameResult.module.css';

const columns = [
  {
    title: 'Ranking',
    dataIndex: 'Ranking',
    key: 'Ranking',
    render: (text, record, order) => {
      return order + 1;
    },
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
  },
];
export default function GameResult () {
  const { sessionid, gameId } = useParams();
  const [top5s, setTop5s] = useState([]);
  const [accuracy, setAccuracy] = useState([]);
  const [avgTime, setAvgTime] = useState([]);
  const getGameResult = async () => {
    const { questions } = await fetchData({
      url: `/admin/quiz/${gameId}`,
      method: 'GET',
    });
    // console.log('questions = ', questions);
    const { results } = await fetchData({
      url: `/admin/session/${sessionid}/results`,
      method: 'GET',
    });
    console.log('results = ', results);
    const top5 = [];
    const correctObj = {};
    const timeObj = {};
    results.forEach((resultItem, resultIndex) => {
      // console.log('resultItem = ', resultItem);
      const top5Item = {
        name: resultItem.name,
      };
      let score = 0;
      resultItem.answers.forEach((answerItem, answerIndex) => {
        if (answerItem.correct) {
          score += questions[answerIndex].points;
        }
        if (!correctObj[answerIndex]) {
          correctObj[answerIndex] = [];
        }
        correctObj[answerIndex].push(answerItem.correct);
        if (!timeObj[answerIndex]) {
          timeObj[answerIndex] = [];
        }
        // console.log('aa = ', timeObj[answerIndex]);
        timeObj[answerIndex].push(
          dayjs(answerItem.answeredAt).diff(
            dayjs(answerItem.questionStartedAt),
            'second'
          )
        );
      });
      top5Item.score = score;
      top5.push(top5Item);
    });
    top5.sort((item1, item2) => {
      return item2.score - item1.score;
    });
    setTop5s(top5.slice(0, 5));
    const correctArray = [];
    const timeArray = [];
    for (const item in correctObj) {
      const rightArray = correctObj[item].filter((bol) => {
        return bol;
      });
      correctArray.push({
        label: `Question ${Number(item) + 1}`,
        value: (rightArray.length / correctObj[item].length) * 100,
      });
    }
    for (const item in timeObj) {
      const totoalTime = timeObj[item].reduce((preItem, curItem) => {
        return preItem + curItem;
      }, 0);
      timeArray.push({
        label: `Question ${Number(item) + 1}`,
        value: totoalTime / timeObj[item].length,
      });
    }
    setAccuracy(correctArray);
    setAvgTime(timeArray);
    // console.log('correctArray = ', correctArray);
    // console.log('timeArray = ', timeArray);
    // console.log('top5 = ', top5);
  };

  const lineConfig = {
    yAxis: {
      min: 0,
      max: 100,
    },
    padding: 'auto',
    xField: 'label',
    yField: 'value',
    xAxis: {
      tickCount: 5,
    },
  };

  const pieConfig = {
    appendPadding: 10,
    angleField: 'value',
    colorField: 'label',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      },
    },
  };

  useEffect(() => {
    getGameResult();
  }, []);

  return (
    <Card title='Game Results' className={sty.box}>
      <Card title='Top 5'>
        <Table className={sty.table} dataSource={top5s} pagination={false} columns={columns} />
      </Card>
      <Card title='Accuracy'>
        <Line data={accuracy} {...lineConfig} />
      </Card>
      <Card title='Average response time'>
        <Pie data={avgTime} {...pieConfig} />
      </Card>
    </Card>
  );
}
