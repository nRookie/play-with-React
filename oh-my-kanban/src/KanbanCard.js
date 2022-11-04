/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { MINUTE, HOUR, DAY, UPDATE_INTERVAL, kanbanCardStyles, kanbancardTitleStyles } from './App';

export default function KanbanCard({ title, status, onDragStart }) {

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
        relativeTime = `${Math.ceil(timePassed / DAY)} 天前`;
      }
      setDisplayTime(relativeTime);
    };
    const intervalId = setInterval(updateDisplayTime, UPDATE_INTERVAL);
    updateDisplayTime();

    return function cleanup() {
      clearInterval(intervalId);
    };
  }, [status]);


  const handleDragStart = (evt) => {
    evt.dataTransfer.effectAllowed = 'move';
    evt.dataTransfer.setData('text/plain', title);
    onDragStart && onDragStart(evt);
  };

  return (
    <li css={kanbanCardStyles} draggable onDragStart={handleDragStart}>
      <div css={kanbancardTitleStyles}>{title}</div>
      <div css={css`/*省略*/`} title={status}>{displayTime}</div>
    </li>
  );
}
