
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <main className="kanban-board">
        <section className="kanban-column"></section>
        <section className="kanban-column"></section>
        <section className="kanban-column"></section>
      </main>
    </div>
      );
    }

export default App;