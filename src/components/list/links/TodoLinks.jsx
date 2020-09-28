import React from "react";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import {SvgIconFeather} from "../../common";

const Wrapper = styled.li`
  position: relative;
  transition: all 0.3s ease;

  > a {
    position: relative;
    font-weight: ${(props) => (props.selected ? "600" : "400")};
    height: 40px;
    display: flex;
    color: #fff;
    justify-content: flex-start;
    align-items: center;
    margin: 0 15px;
    border-radius: 8px 8px 0 0;
  }
`;

const NavIcon = styled(SvgIconFeather)`
  cursor: pointer;
  margin: 0 8px 0 15px;
`;

const TodoLinks = (props) => {
  const {className = "", dictionary} = props;

  const history = useHistory();

  const handleRedirectLink = (e) => {
    e.preventDefault();
    history.push("/todos");
  };

  return (
    <Wrapper className={`fadeIn ${className}`}>
      <a href="/todos" onClick={handleRedirectLink}>
        <NavIcon icon="bell"/>
        <div>{dictionary.todoLinks}</div>
      </a>
    </Wrapper>
  );
};

export default TodoLinks;
