import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div``;

const Filter = styled.span`
  cursor: pointer;
  font-size:13px;
  .dark & {
    background: #191c20 !important;
    border-color: #ffffff14 !important;
  }

  ${(props) =>
    props.active &&
    `
        background: 0 0;
        color: #7a1b8b;
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

const Badge = styled.span`  
.badge {
  position: absolute;
  width: 6px;
  height: 6px;
  padding: 0;
  background: #28a745;
  z-index: 9;
}`
const Icon = styled(SvgIconFeather)`
  width: 15px;
`;

const StyledIcon = styled(SvgIconFeather)`
  width: 1em;
  vertical-align: bottom;
  margin-right: 40px;
  
  &:hover {
    color: #000000;
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

        <div>
        <div className="post-filter-item list-group list-group-flush">
            <span className={`list-group-item d-flex align-items-center pr-3`} data-value="inbox">
              {dictionary.actionFilter}
              <span className="ml-auto" onClick="" disabled="">
                <StyledIcon className="mr-0" icon="plus" />
              </span>
            </span>
          </div>
          <div className="app-sidebar-menu" tabIndex="1">
            <div className="list-group list-group-flush">
              <Filter onClick={setFilter} data-filter="OVERDUE" active={filter === "OVERDUE"} className={`list-group-item d-flex justify-content-between align-items-center`}>
                <span className="text-danger fa fa-circle mr-2" />
                {dictionary.statusExpired}
                <span className="small ml-auto">{count.overdue}</span>
              </Filter>
              <Filter onClick={setFilter} data-filter="TODAY" active={filter === "TODAY"} className={`list-group-item d-flex justify-content-between align-items-center`}>
                <span data-filter="TODAY">
                  <span className="text-success fa fa-circle mr-2" />
                  {dictionary.statusToday}
                </span>
                <span className="small ml-auto">{count.today}</span>
              </Filter>
              <Filter onClick={setFilter} data-filter="NEW" active={filter === "NEW"} className={`list-group-item d-flex justify-content-between align-items-center`}>
                <span data-filter="NEW">
                  <span className="text-default fa fa-circle mr-2" />
                  {dictionary.statusUpcoming}
                </span>
                <span className="small ml-auto">{count.NEW}</span>
              </Filter>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(TodosSidebar);
