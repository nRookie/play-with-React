
import logo from './logo.svg';
import './App.css';

const todoList = [
  {title: '开发任务-1', status: '22-05-22 18:15'},
  {title: '开发任务-2', status: '22-05-22 18:15'},
  {title: '开发任务-3', status: '22-05-22 18:15'},
  {title: '开发任务-4', status: '22-05-22 18:15'}
];

const ongoingList = [
  { title: '开发任务-4', status: '22-05-22 18:15' },
  { title: '开发任务-6', status: '22-05-22 18:15' },
  { title: '测试任务-2', status: '22-05-22 18:15' }
];

const doneList = [
  { title: '开发任务-2', status: '22-05-22 18:15' },
  { title: '测试任务-1', status: '22-05-22 18:15' }
];

const KanbanCard = ({ title, status}) => {
  return (
    <li className="kanban-card">
      <div className="card-title">{title}</div>
      <div className="card-status">{status}</div>
    </li>
  );
};


const KanbanNewCard = () => {
  return (
    <li className="kanban-card">
      <h3>添加新卡片</h3>
      <div className="card-title">
        <input type="text" />
      </div>
    </li>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <main className="kanban-board">
        <section className="kanban-column column-todo">
          <h2>待处理</h2><button>&#8853; 添加新卡片</button>
          <ul>
            <KanbanNewCard />
          {
            todoList.map(props => <KanbanCard {...props} />)
          }
          </ul>
        </section>
        <section className="kanban-column column-ongoing">
          <h2>进行中</h2>
          <ul>
            {ongoingList.map(props => <KanbanCard {...props} /> )}
          </ul>
        </section>
        <section className="kanban-column column-done">
          <h2>已完成</h2>
          <ul>
            {doneList.map(props => <KanbanCard {... props} />)}
          </ul>
        </section>
      </main>
    </div>
      );
    }

export default App;