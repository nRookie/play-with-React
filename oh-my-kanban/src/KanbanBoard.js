/** @jsxImportSource @emotion/react */
import React, {useState} from 'react';
import { css } from '@emotion/react';
import KanbanColumn from './KanbanColumn';


const COLUMN_BG_COLORS = {
  loading: '#E3E3E3',
  todo: '#C9AF97',
  ongoing: '#FFE799',
  done: '#C0E88A'
};

const DATA_STORE_KEY = 'kanban-data-store';
const COLUMN_KEY_TODO = 'todo';
const COLUMN_KEY_ONGOING = 'ongoing';
const COLUMN_KEY_DONE ='done';

const kanbanBoardStyles = css`
    flex : 10;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin: 0 1rem 1rem;
  `;
export default function KanbanBoard({
   isLoading = true,
   todoList,
   ongoingList,
   doneList,
   onAdd,
   onDrop
}) {
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragSource, setDragSource] = useState(null); 
    const [dragTarget, setDragTarget] = useState(null);
  return (
  <main css={kanbanBoardStyles}> {isLoading ? (
    <KanbanColumn title="读取中..." bgColor={COLUMN_BG_COLORS.loading}></KanbanColumn>
    ) :(<>   
    <KanbanColumn 
      bgColor={COLUMN_BG_COLORS.todo} 
      canAddNew
      title="待处理"
      setDraggedItem={setDraggedItem}
      setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_TODO : null)}
      setIsDragTarget={(isTgt) => setDragTarget(isTgt ? COLUMN_KEY_TODO : null)}
      onDrop={onDrop}
      cardList={todoList}
      onAdd={onAdd}
    >
    </KanbanColumn>

    <KanbanColumn bgColor={COLUMN_BG_COLORS.ongoing}  title="进行中"
        setDraggedItem={setDraggedItem}
        setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_ONGOING : null)}
        setIsDragTarget={(isTgt) => setDragTarget(isTgt ? COLUMN_KEY_ONGOING : null)}
        onDrop={onDrop}
        cardList={ongoingList}
    >
    </KanbanColumn>
    <KanbanColumn bgColor={COLUMN_BG_COLORS.done}  title="已完成"
        setDraggedItem={setDraggedItem}
        setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_DONE : null)}
        setIsDragTarget={(isTgt) => setDragTarget(isTgt ? COLUMN_KEY_DONE : null)}
        onDrop={onDrop}
        cardList={doneList}
    >
    </KanbanColumn>
  </>)}
  </main>
  );
}
