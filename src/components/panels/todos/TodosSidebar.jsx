import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
`;

const Filter = styled.span`
  cursor: pointer;
  
  .dark & {
    background: #191c20 !important;
    border-color: #ffffff14 !important;
  }
    
  &:hover,
  &.active {
    background-color: #7a1b8b;
    border-color: #7a1b8b;
    color: #fff;
    
    .dark & {
      background: #ffffff14 !important;
      border-color: #ffffff14 !important;
    }  
  }
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
              <Filter onClick={() => setFilter("")}
                      className={`list-group-item d-flex align-items-center ${filter === "" ? "active" : ""}`}>
                <Icon className="mr-2" icon="list"/>
                {dictionary.statusAll}
              </Filter>
              <Filter onClick={() => setFilter(filter === "OVERDUE" ? "" : "OVERDUE")}
                      className={`list-group-item d-flex align-items-center ${filter === "OVERDUE" ? "active" : ""}`}>
                <Icon className="mr-2" icon="alert-circle"/>
                {dictionary.statusOverdue} {/*{count.overdue}*/}
              </Filter>
              <Filter onClick={() => setFilter(filter === "NEW" ? "" : "NEW")}
                      className={`list-group-item d-flex align-items-center ${filter === "NEW" ? "active" : ""}`}>
                <Icon className="mr-2" icon="clock"/>
                {dictionary.statusUpcoming} {/*{count.new}*/}
              </Filter>
              <Filter onClick={() => setFilter(filter === "DONE" ? "" : "DONE")}
                      className={`list-group-item d-flex align-items-center ${filter === "DONE" ? "active" : ""}`}>
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
