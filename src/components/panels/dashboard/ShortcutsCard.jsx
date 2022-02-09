import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Wrapper = styled.div`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      padding-top: 10px;
    }
    li:not(:last-child) {
      border-bottom: 1px solid #f1f2f7;
    }
  }
`;

const ShortcutsCard = (props) => {
  const links = useSelector((state) => state.global.links.filter((l) => l.id && l.menu_name.trim() !== "" && l.link.trim() !== ""));
  return (
    <Wrapper>
      <span>
        <strong>Company shortcuts</strong>
      </span>
      <ul className="mt-2">
        {links.map((l) => {
          return (
            <li key={l.id}>
              <a href={l.link} target="_blank" rel="noopener noreferrer">
                {l.menu_name}
              </a>
            </li>
          );
        })}
      </ul>
    </Wrapper>
  );
};

export default ShortcutsCard;
