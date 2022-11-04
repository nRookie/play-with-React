/** @jsxImportSource @emotion/react */
import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {css} from '@emotion/react';
import KanbanBoard from './KanbanBoard';
import KanbanColumn from './KanbanColumn';

const COLUMN_BG_COLORS = {
  loading: '#E3E3E3',
  todo: '#C9AF97',
  ongoing: '#FFE799',
  done: '#C0E88A'
};

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
const COLUMN_KEY_TODO = 'todo';
const COLUMN_KEY_ONGOING = 'ongoing';
const COLUMN_KEY_DONE ='done';


function App() {
  const [todoList, setTodoList] = useState ( [
    {title: '开发任务-1', status: '22-05-22 18:15' },
    { title: '开发任务-3', status: '22-05-22 18:15' }, 
    { title: '开发任务-5', status: '22-05-22 18:15' },
    { title: '测试任务-3', status: '22-05-22 18:15' }
  ]);
  const handleAdd = (newCard) => {
    setTodoList(currentTodoList => [
      newCard,
      ...currentTodoList
    ]);
  };

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);


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


  const handleSaveAll = () => {
    const data = JSON.stringify({
      todoList,
      ongoingList,
      doneList
    });
    window.localStorage.setItem(DATA_STORE_KEY, data);
  }


  const handleDrop = (evt) => {
    if (!draggedItem || !dragSource || !dragTarget || dragSource === dragTarget) {
      return ;
    }

    const updaters = {
      [COLUMN_KEY_TODO]: setTodoList,
      [COLUMN_KEY_ONGOING]: setOngoingList,
      [COLUMN_KEY_DONE] : setDoneList,
    }

    if (dragSource) {
      updaters[dragSource]((currentStat) => 
        currentStat.filter((item) => !Object.is(item, draggedItem))
      );
    }

    if (dragTarget) {
      updaters[dragTarget]((currentStat) => [draggedItem, ...currentStat]);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板 <button onClick={handleSaveAll}>保存所有卡片</button></h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanbanBoard>
        {isLoading ? (
            <KanbanColumn title="读取中..." bgColor={COLUMN_BG_COLORS.loading}></KanbanColumn>
        ) :(<>   
          <KanbanColumn 
            bgColor={COLUMN_BG_COLORS.todo} 
            canAddNew
            title="待处理"
            setDraggedItem={setDraggedItem}
            setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_TODO : null)}
            setIsDragTarget={(isTgt) => setDragTarget(isTgt ? COLUMN_KEY_TODO : null)}
            onDrop={handleDrop}
            cardList={todoList}
            onAdd={handleAdd}
          >
          </KanbanColumn>

        <KanbanColumn bgColor={COLUMN_BG_COLORS.ongoing}  title="进行中"
            setDraggedItem={setDraggedItem}
            setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_ONGOING : null)}
            setIsDragTarget={(isTgt) => setDragTarget(isTgt ? COLUMN_KEY_ONGOING : null)}
            onDrop={handleDrop}
            cardList={ongoingList}
        >
        </KanbanColumn>
        <KanbanColumn bgColor={COLUMN_BG_COLORS.done}  title="已完成"
            setDraggedItem={setDraggedItem}
            setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_DONE : null)}
            setIsDragTarget={(isTgt) => setDragTarget(isTgt ? COLUMN_KEY_DONE : null)}
            onDrop={handleDrop}
            cardList={doneList}
        >
        </KanbanColumn>
        </>)
        }
      </KanbanBoard>
    </div>
    );
};

export default App;

