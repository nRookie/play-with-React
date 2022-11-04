/** @jsxImportSource @emotion/react */
import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {css} from '@emotion/react';

const COLUMN_BG_COLORS = {
  todo: '#C9AF97',
  ongoing: '#FFE799',
  done: '#C0E88A'
};

const kanbanCardStyles = css`
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
const kanbancardTitleStyles = css`
  min-height: 3rem;
`;

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const UPDATE_INTERVAL = MINUTE;

const KanbanCard = ({ title, status}) => {

  const [displayTime, setDisplayTime] = useState(status);
  useEffect(() => {
    const updateDisplayTime = () => {
      const timePassed = new Date() - new Date(status);
      let relativeTime = '刚刚';
      if (MINUTE <= timePassed && timePassed < HOUR) {
        relativeTime = `${Math.ceil(timePassed / MINUTE)} 分钟前`;
      } else if (HOUR <= timePassed && timePassed < DAY) {
        relativeTime = `${Math.ceil(timePassed / HOUR)} 小时前`;
      } else if (DAY <= timePassed) {
        relativeTime = `${Math.ceil(timePassed / DAY)} 天前`
      }
      setDisplayTime(relativeTime);
    }
    const intervalId = setInterval(updateDisplayTime, UPDATE_INTERVAL);
    updateDisplayTime();
  
    return function cleanup() {
      clearInterval(intervalId);
    }
  }, [status])


  return (
    <li css={kanbanCardStyles}>
      <div css={kanbancardTitleStyles}>{title}</div>
      <div css={css`/*省略*/`} title={status}>{displayTime}</div>
    </li>
  );
};


const KanbanBoard = ({ children}) => (
  <main css= {css `
    flex : 10;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin: 0 1rem 1rem;
  `}>{children}</main>
)

const KanbanColumn = ( { children, bgColor, title }) => {
  return (
    <section css={css`
      flex: 1 1 ;
      display: flex;
      flex-direction: column;
      border: 1px solid gray;
      border-radius: 1rem;
      background-color: ${bgColor};

      & > h2 {
        margin: 0.6rem 1rem;
        padding-bottom: 0.6rem;
        border-bottom: 1px solid gray;

        & > button {
          float: right;
          margin-top: 0.2rem;
          padding: 0.2rem 0.5rem;
          border: 0;
          border-radius: 1rem;
          height: 1.8rem;
          line-height: 1rem;
          font-size: 1rem;
        }
      }

      & > ul {
        flex: 1;
        flex-basis: 0;
        margin: 1rem;
        padding: 0;
        overflow:auto;
      }

    `}>
      <h2>{title}</h2>
      <ul>{children}</ul>
    </section>
  );
}

const KanbanNewCard = ({onSubmit}) => {
  const [title, setTitle] = useState('');
  const handleChange = (evt) => {
    setTitle(evt.target.value);
  };
  const handleKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      onSubmit(title);
    }
  };
  return (
    <li className="kanban-card">
      <li css={kanbanCardStyles}></li>
      <h3>添加新卡片</h3>
      <div css={css`
        ${kanbancardTitleStyles}
        & > input[type="text"] {
          width: 80%;
        }
      `}>
        <input type="text" value={title}
          onChange={handleChange} onKeyDown={handleKeyDown} />
      </div>
    </li>
  );
};

function App() {
  const [showAdd, setShowAdd] = useState(false);

  const [todoList, setTodoList] = useState ( [
    {title: '开发任务-1', status: '22-05-22 18:15' },
    { title: '开发任务-3', status: '22-05-22 18:15' }, 
    { title: '开发任务-5', status: '22-05-22 18:15' },
    { title: '测试任务-3', status: '22-05-22 18:15' }
  ]);
  const handleAdd = (evt) => {
    setShowAdd(true);
  };
  const handleSubmit = (title) => {
    setTodoList(currentTodoList => [
      { title, status: new Date().toDateString()},
      ...currentTodoList
    ]);
    setOngoingList(currentOngoingList => [
      { title, status: new Date().toDateString()},
      ...currentOngoingList
    ]);
    setDoneList(currentDoneList => [
      { title, status: new Date().toDateString()},
      ...currentDoneList
    ]);
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanbanBoard>
        <KanbanColumn bgColor={COLUMN_BG_COLORS.todo} title={<>
  "待处理"<button onClick={handleAdd} 
  disabled={showAdd}>&#8853; 添加新卡片</button>
  </>}>
            { showAdd && <KanbanNewCard onSubmit={handleSubmit} />  }
            { todoList.map(props => <KanbanCard key={props.title} {...props} />)}
        </KanbanColumn>
        <KanbanColumn bgColor={COLUMN_BG_COLORS.ongoing}  title="进行中">
          {ongoingList.map(props => <KanbanCard key={props.title} {...props} />)}
        </KanbanColumn>
        <KanbanColumn bgColor={COLUMN_BG_COLORS.done}  title="已完成">
          {doneList.map(props => <KanbanCard key={props.title} {...props} />)}
        </KanbanColumn>
      </KanbanBoard>
    </div>
    );
};

export default App;