import React from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";

const Wrapper = styled.div`
`;

const Filter = styled.span`
  cursor: pointer;

  ${(props) =>
  props.active &&
  `
        background-color: black !important;
        border-color: #ffffff14 !important;
        color: #fff;
    `}
  &.folder-list {
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    > ul {
      list-style: none;
      padding: 0.75rem 1.5rem;
      width: 100%;
      margin: 0;

      li {
        margin-bottom: 5px;
      }
    }
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 15px;
`;

const TodosSidebar = (props) => {
  const {
    className = "",
    dictionary,
    todoActions,
    setFilter,
    filter,
    count
  } = props;

  return (
    <Wrapper className={`todo-sidebar bottom-modal-mobile ${className}`}>
      <div className="card">
        <div className="card-body">
          <button className="btn btn-primary btn-block" onClick={() => todoActions.createFromModal()}>
            {dictionary.createNewTodoItem}
          </button>
        </div>

        <div>
          <div className="app-sidebar-menu" tabIndex="1">
            <div className="list-group list-group-flush">
              <Filter onClick={() => setFilter("")} active={filter === ""}
                      className="list-group-item d-flex align-items-center">
                <Icon className="mr-2" icon="list"/>
                {dictionary.statusAll}
              </Filter>
              <Filter onClick={() => setFilter(filter === "OVERDUE" ? "" : "OVERDUE")} active={filter === "OVERDUE"}
                      className="list-group-item d-flex align-items-center">
                <Icon className="mr-2" icon="alert-circle"/>
                {dictionary.statusOverdue} {/*{count.overdue}*/}
              </Filter>
              <Filter onClick={() => setFilter(filter === "NEW" ? "" : "NEW")} active={filter === "NEW"}
                      className="list-group-item d-flex align-items-center">
                <Icon className="mr-2" icon="clock"/>
                {dictionary.statusUpcoming} {/*{count.new}*/}
              </Filter>
              <Filter onClick={() => setFilter(filter === "DONE" ? "" : "DONE")} active={filter === "DONE"}
                      className="list-group-item d-flex align-items-center">
                <Icon className="mr-2" icon="check"/>
                {dictionary.statusDone} {/*{count.done}*/}
              </Filter>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(TodosSidebar);
