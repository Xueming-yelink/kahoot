import React from 'react';
import 'antd/dist/antd.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Wrap from './components/Wrap.jsx';
import Dashboard from './components/Dashboard.jsx';
import EditGame from './components/EditGame.jsx';
import NewQuestion from './components/NewQuestion.jsx';
import EditQuestion from './components/EditQuestion.jsx';
import GameJoinBoard from './components/GameJoinBoard.jsx';
import GameBoard from './components/GameBoard.jsx';
import GameResult from './components/GameResult.jsx';

function App () {
  return (
    <>
      <Routes>
        <Route path='/' element={<Wrap />}>
          <Route index element={<Dashboard />} />
          <Route path='/editGame/:gameId' element={<EditGame />} />
          <Route path='/newQuestion/:gameId' element={<NewQuestion />} />
          <Route
            path='/editQuestion/:gameId/:questionId'
            element={<EditQuestion />}
          />
          <Route path='/gameJoinBoard/:sessionid' element={<GameJoinBoard />} />
          <Route path='/gameBoard/:playerId' element={<GameBoard />} />
          <Route path='/gameResults/:sessionid/:gameId' element={<GameResult />} />
        </Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
      </Routes>
      <Outlet />
    </>
  );
}

export default App;
