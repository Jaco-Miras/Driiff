import React from "react";
import styled from "styled-components";
import { SvgIconFeather, ToolTip } from "../../common";

const Wrapper = styled.div`
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .ws-name {
    line-height: 1.45;
  }
`;
const SpanTitle = styled.span`
  font-weight: 700;
  cursor: pointer;
`;

const ListHeader = (props) => {
  const { className = "", id = "", handleClick, active, headerText = "", params, workspaceName, handleSort, sortByDate, dictionary } = props;

  return (
    <Wrapper className={className}>
      <SpanTitle className={"badge badge-light"} onClick={handleClick} id={id}>
        <SvgIconFeather icon={active ? "arrow-down" : "arrow-up"} width={16} height={16} className="mr-1" />
        {headerText}
      </SpanTitle>
      {params.hasOwnProperty("workspaceId") ? (
        <div>
          <span className="badge badge-light mr-1 ws-name">{workspaceName}</span>
          <ToolTip content={sortByDate ? dictionary.sortDate : dictionary.sortAlpha}>
          <span className={"badge badge-light"} onClick={handleSort}>
            <SvgIconFeather icon={sortByDate ? "arrow-down" : "arrow-up"} width={16} height={16} />
          </span>
          </ToolTip>
        </div>
      ) : (
        <ToolTip content={sortByDate ? dictionary.sortDate : dictionary.sortAlpha}>
        <span className={"badge badge-light"} onClick={handleSort}>
          <SvgIconFeather icon={sortByDate ? "arrow-down" : "arrow-up"} width={16} height={16} />
        </span>
        </ToolTip>
      )}
    </Wrapper>
  );
};

export default ListHeader;
