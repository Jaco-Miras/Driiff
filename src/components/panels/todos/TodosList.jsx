import React from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.li`
`;

const TodosList = (props) => {
  const {className = ""} = props;

  const history = useHistory();

  return (
    <Wrapper className={`todos-list fadeIn ${className}`}>
      Todo list
    </Wrapper>
  );
};

export default TodosList;
