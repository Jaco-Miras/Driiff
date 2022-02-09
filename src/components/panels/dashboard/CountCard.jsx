import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    margin: 0;
  }
  span:last-child {
    min-width: 55px;
    text-align: right;
    color: ${(props) => (props.count === 0 ? "green" : "inherit")};
    border-left: 1px solid #8b8b8b;
  }
`;

const CountCard = (props) => {
  const { type, text } = props;
  const unreadCounter = useSelector((state) => state.global.unreadCounter);
  const todosCount = useSelector((state) => state.global.todos.count);
  let count = 0;
  if (type === "chat") {
    count = unreadCounter.chat_message;
  } else if (type === "posts") {
    count = unreadCounter.general_post;
  } else {
    count = todosCount.todo_with_date;
  }
  return (
    <Wrapper count={count}>
      <span className="text-label">
        <strong>{text}</strong>
      </span>
      <span>
        <h2>{count}</h2>
      </span>
    </Wrapper>
  );
};

export default CountCard;
