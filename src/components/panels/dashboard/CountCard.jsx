import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    margin: 0;
  }
  .text-label {
    width: 65%;
  }
  span:last-child {
    width: 35%;
    text-align: center;
    color: ${(props) => (props.count === 0 ? "green" : "inherit")};
    font-size: 2.25rem;
    border-left: 1px solid rgba(0, 0, 0, 0.125);
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
      <span>{count}</span>
    </Wrapper>
  );
};

export default CountCard;
