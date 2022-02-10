import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { SvgIconFeather } from "../../common";
import { FancyLink } from "../../common";

const Wrapper = styled.div`
  > span {
    display: flex;
    align-items: center;
    font-weight: 600;
  }
  .feather {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
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
  a {
    box-shadow: none !important;
  }
`;

const ShortcutsCard = (props) => {
  const links = useSelector((state) => state.global.links.filter((l) => l.id && l.menu_name.trim() !== "" && l.link.trim() !== ""));
  return (
    <Wrapper>
      <span>
        <SvgIconFeather icon="link" /> Company shortcuts
      </span>
      <ul className="mt-2">
        {links.map((l) => {
          return (
            <li key={l.id}>
              <FancyLink link={l.link} title={l.menu_name} />
            </li>
          );
        })}
      </ul>
    </Wrapper>
  );
};

export default ShortcutsCard;
