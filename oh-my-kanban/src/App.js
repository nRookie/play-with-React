/** @jsxImportSource @emotion/react */
import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {css} from '@emotion/react';
import KanbanBoard, { 
  COLUMN_KEY_DONE,
  COLUMN_KEY_ONGOING,
  COLUMN_KEY_TODO,
} from './KanbanBoard';

export const kanbanCardStyles = css`
  margin-bottom: 1rem;
  padding: 0.6rem 1rem;
  border: 1px solid gray;
  border-radius: 1rem;
  list-style: none;
  background-color: rgba(255, 255, 255, 0.4);
  text-align: left;

  &:hover {
    box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.2), inset 0 1px #fff;
  }
`;
export const kanbancardTitleStyles = css`
  min-height: 3rem;
`;

export const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const UPDATE_INTERVAL = MINUTE;

const DATA_STORE_KEY = 'kanban-data-store';

function App() {
  const [todoList, setTodoList] = useState ( [
    {title: '开发任务-1', status: '22-05-22 18:15' },
    { title: '开发任务-3', status: '22-05-22 18:15' }, 
    { title: '开发任务-5', status: '22-05-22 18:15' },
    { title: '测试任务-3', status: '22-05-22 18:15' }
  ]);
  
  const handleAdd = (column, newCard) => {
    updaters[column]((currentStat) => [newCard, ...current]);
  };

  const handleRemove = (column, cardToRemove) => {
    updaters[column]((currentStat) => {
        currentStat.filter((item) => !Object.is(item, cardToRemove))
    })
  };


  const [ongoingList, setOngoingList] = useState ( [
    { title: '开发任务-4', status: '2022-05-22 18:15' },
    { title: '开发任务-6', status: '2022-05-22 18:15' },
    { title: '测试任务-2', status: '2022-05-22 18:15' }
  ]);
  const [doneList, setDoneList] = useState ( [
    { title: '开发任务-2', status: '2022-05-22 18:15' },
    { title: '测试任务-1', status: '2022-05-22 18:15' }
  ]);


  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const data = window.localStorage.getItem(DATA_STORE_KEY);
    setTimeout(() => { 
      if (data) {
        const kanbanColumnData = JSON.parse(data);
        setTodoList(kanbanColumnData.todoList);
        setOngoingList(kanbanColumnData.ongoingList);
        setDoneList(kanbanColumnData.doneList);
      }
      setIsLoading(false);
    }, 1000);
  }, []);


  const updaters = {
    [COLUMN_KEY_TODO]: setTodoList,
    [COLUMN_KEY_ONGOING]: setOngoingList,
    [COLUMN_KEY_DONE] : setDoneList,
  }


  const handleSaveAll = () => {
    const data = JSON.stringify({
      todoList,
      ongoingList,
      doneList
    });
    window.localStorage.setItem(DATA_STORE_KEY, data);
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板 <button onClick={handleSaveAll}>保存所有卡片</button></h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanbanBoard
        isLoading={isLoading}
        todoList={todoList}
        ongoingList={ongoingList}
        doneList={doneList}
        onAdd={handleAdd}
        onDrop={handleRemove}
        />
    </div>
    );
};

export default App;

