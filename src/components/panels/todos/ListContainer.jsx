import React from "react";
import styled from "styled-components";
import ListHeader from "./ListHeader";
import ListEmptyState from "./ListEmptyState";

const Wrapper = styled.div`
  .badge.badge-light {
    background: rgba(175, 184, 189, 0.2);
    border: 1px solid #f8f9fa;
    color: #212529;
    .dark & {
      color: #fff;
      background: rgb(175, 184, 189, 0.2) !important;
      border: 1px solid rgb(175, 184, 189, 0.2);
    }
  }
`;

const ListGroup = styled.ul`
  list-style: none;
  background: transparent;
  margin: 0;
  padding: 0;
  .list-group-item:last-child {
    border-bottom: none;
  }
  li:last-child {
    border-bottom: none;
  }
`;

const ListContainer = (props) => {
  const { className = "", active, handleHeaderClick, headerText, dictionary, items, ItemList, showEmptyState = true, listGroupClassname = "", params, workspaceName, handleSort, sortByDate } = props;
  return (
    <Wrapper className={className}>
      <ListHeader active={active} headerText={headerText} handleClick={handleHeaderClick} params={params} workspaceName={workspaceName} handleSort={handleSort} sortByDate={sortByDate} dictionary={dictionary}/>
      {items.length === 0 && showEmptyState && active && <ListEmptyState dictionary={dictionary} />}
      {items.length > 0 && active && (
        <ListGroup className={listGroupClassname}>
          {items.map((item) => {
            return ItemList(item);
          })}
        </ListGroup>
      )}
      {props.children}
    </Wrapper>
  );
};

export default ListContainer;
