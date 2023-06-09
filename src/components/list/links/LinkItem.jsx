import React from "react";
import styled from "styled-components";

const LinkItemWrapper = styled.li`
  cursor: pointer;
  background: ${(props) => (props.selected ? "#fff3" : "#ffffff14")};
  height: 40px;
  width: 100%;
  padding: 0 10px;
  font-weight: ${(props) => (props.selected ? "600" : "400")};
  color: ${(props) => (props.selected ? "#ffffffEB" : "#cbd4db")};
  div {
    position: relative;
    height: 40px;
    display: inline-flex;
    align-items: center;
    svg {
      margin-left: 6px;
    }
    a {
      display: block;
      background-color: transparent;
    }
  }
  @media (max-width: 620px) {
    color: #ffffff;
  }
`;

const LinkItem = (props) => {
  const { className = "", link } = props;

  return (
    <LinkItemWrapper className={`topic-list ${className}`}>
      <div>
        <a href={link.link} target="_blank">
          {link.menu_name}
        </a>
      </div>
    </LinkItemWrapper>
  );
};

export default LinkItem;
