/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useEffect } from 'react';
import { css } from '@emotion/react';
import { kanbanCardStyles, kanbancardTitleStyles } from './App';

export default function KanbanNewCard({ onSubmit }) {
  const [title, setTitle] = useState('');
  const handleChange = (evt) => {
    setTitle(evt.target.value);
  };
  const handleKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      onSubmit(title);
    }
  };

  const inputElem = useRef(null);
  useEffect(() => {
    inputElem.current.focus();
  }, []);

  return (
    <li css={kanbanCardStyles}>
      <h3>添加新卡片</h3>
      <div css={css`
        ${kanbancardTitleStyles}
        & > input[type="text"] {
          width: 80%;
        }
      `}>
        <input type="text" value={title} ref={inputElem}
          onChange={handleChange} onKeyDown={handleKeyDown} />
      </div>
    </li>
  );
}
