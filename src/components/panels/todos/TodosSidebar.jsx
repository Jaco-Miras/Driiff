import React from "react";
import styled from "styled-components";

const Wrapper = styled.div``;

const Filter = styled.span`
  cursor: pointer;
  font-size: 13px;
  .dark & {
    background: #191c20 !important;
    border-color: #ffffff14 !important;
  }

  ${(props) =>
    props.active &&
    `
        background: 0 0;
        color: ${props.theme.colors.secondary};
        &:after {
          content: "";
          width: 3px;
          height: 100%;
          background-color: ${props.theme.colors.secondary};
          display: block;
          position: absolute;
          top: 0;
          animation: fadeIn 0.15s linear;
          left: 0;
        }
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

const TodosSidebar = (props) => {
  const { className = "", dictionary, todoActions, setFilter, filter, count } = props;

  return (
    <Wrapper className={`todo-sidebar bottom-modal-mobile ${className}`}>
      <div className="card">
        <div className="card-body">
          <button className="btn btn-primary btn-block" onClick={() => todoActions.createFromModal()}>
            {dictionary.createNewTodoItem}
          </button>
        </div>
        <div className="app-sidebar-menu" tabIndex="1">
          <div className="list-group list-group-flush">
            <Filter onClick={setFilter} data-filter="" active={filter === ""} className={"list-group-item d-flex align-items-center"}>
              <span className="text-secondary fa fa-circle mr-2" />
              {dictionary.statusAll}
              {count && count.all > 0 && <span className="small ml-auto">{count.all}</span>}
            </Filter>
            <Filter onClick={setFilter} data-filter="OVERDUE" active={filter === "OVERDUE"} className={"list-group-item d-flex align-items-center"}>
              <span className="text-danger fa fa-circle mr-2" />
              {dictionary.statusExpired}
              {count && count.overdue > 0 && <span className="small ml-auto">{count.overdue}</span>}
            </Filter>
            <Filter onClick={setFilter} data-filter="TODAY" active={filter === "TODAY"} className={"list-group-item d-flex align-items-center"}>
              <span data-filter="TODAY">
                <span className="text-success fa fa-circle mr-2" />
                {dictionary.statusToday}
              </span>
              {count && count.today > 0 && <span className="small ml-auto">{count.today}</span>}
            </Filter>
            <Filter onClick={setFilter} data-filter="NEW" active={filter === "NEW"} className={"list-group-item d-flex align-items-center"}>
              <span data-filter="NEW">
                <span className="text-default fa fa-circle mr-2" />
                {dictionary.statusUpcoming}
              </span>
              {count && count.new > 0 && <span className="small ml-auto">{count.new}</span>}
            </Filter>
            <Filter onClick={setFilter} data-filter="ASSIGNED_TO_OTHERS" active={filter === "ASSIGNED_TO_OTHERS"} className={"list-group-item d-flex align-items-center"}>
              <span data-filter="ASSIGNED_TO_OTHERS">
                <span className="text-info fa fa-circle mr-2" />
                {dictionary.addedByMe}
              </span>
              {count && count.assigned_to_others > 0 && <span className="small ml-auto">{count.assigned_to_others}</span>}
            </Filter>
            <Filter onClick={setFilter} data-filter="ADDED_BY_OTHERS" active={filter === "ADDED_BY_OTHERS"} className={"list-group-item d-flex align-items-center"}>
              <span data-filter="ADDED_BY_OTHERS">
                <span className="text-info fa fa-circle mr-2" />
                {dictionary.addedByOthers}
              </span>
              {count && count.added_by_others > 0 && <span className="small ml-auto">{count.added_by_others}</span>}
            </Filter>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default React.memo(TodosSidebar);
