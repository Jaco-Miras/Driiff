import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {useTodos, useTranslation} from "../../hooks";
import {TodosBody, TodosHeader, TodosSidebar} from "./index";

const Wrapper = styled.div`
  .app-sidebar-menu {
    overflow: hidden;
    outline: currentcolor none medium;
  }
`;

const CreateFolderLabel = styled.div`
  padding-top: 10px;
`;

const TodosPanel = (props) => {
  const {className = ""} = props;

  const history = useHistory();
  const {getSortedItems, action: todoActions} = useTodos();
  const {_t} = useTranslation();

  const dictionary = {
    createNewTodoItem: _t("REMINDER.CREATE_NEW_TODO_ITEM", "Create new todo item"),
    statusAll: _t("REMINDER.STATUS_ALL", "All"),
    statusOverdue: _t("REMINDER.STATUS_OVERDUE", "Overdue"),
    statusUpcoming: _t("REMINDER.STATUS_UPCOMING", "Upcoming"),
    statusDone: _t("REMINDER.STATUS_DONE", "Done"),
  }

  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  return (
    <Wrapper className={`container-fluid h-100 fadeIn ${className}`}>
      <div className="row app-block">
        <TodosSidebar
          className="col-md-3" dictionary={dictionary} todoActions={todoActions}
          setFilter={setFilter} filter={filter}/>
        <div className="col-md-9 app-content mb-4">
          <div className="app-content-overlay"/>
          <TodosHeader dictionary={dictionary} setSearch={setSearch} searchValue={search}/>
          <TodosBody
            todoItems={getSortedItems({filter: {status: filter}})} dictionary={dictionary}
            todoActions={todoActions} filter={filter}/>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(TodosPanel);
