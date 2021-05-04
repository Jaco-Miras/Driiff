import React, { useState } from "react";
import styled from "styled-components";
import { useTodos, useTranslation } from "../../hooks";
import { TodosBody, TodosHeader, TodosSidebar } from "./index";

const Wrapper = styled.div`
  .app-sidebar-menu {
    overflow: hidden;
    outline: currentcolor none medium;
  }

`;

const TodosPanel = (props) => {
  const { className = "" } = props;

  const { getSortedItems, action: todoActions, isLoaded, count, doneRecently } = useTodos(true); //pass true to fetch to do list on mount - default to false
  const { _t } = useTranslation();

  const dictionary = {
    searchInputPlaceholder: _t("REMINDER.SEARCH_INPUT_PLACEHOLDER", "Search your reminders on title and description."),
    createNewTodoItem: _t("REMINDER.CREATE_NEW_TODO_ITEM", "Add new"),
    typePost: _t("REMINDER.TYPE_POST", "Post"),
    typeChat: _t("REMINDER.TYPE_CHAT", "Chat"),
    typePostComment: _t("REMINDER.TYPE_POST_COMMENT", "Post comment"),
    statusToday: _t("REMINDER.STATUS_TODAY", "Today"),
    statusExpired: _t("REMINDER.STATUS_EXPIRED", "Expired"),
    statusUpcoming: _t("REMINDER.STATUS_UPCOMING", "Today"),
    statusAll: _t("REMINDER.STATUS_ALL", "All"),
    statusOverdue: _t("REMINDER.STATUS_OVERDUE", "Overdue"),
    statusUpcomingToday: _t("REMINDER.STATUS_UPCOMING", "Upcoming Today"),
    statusUpcoming: _t("REMINDER.STATUS_UPCOMING", "Upcoming"),
    statusDone: _t("REMINDER.STATUS_DONE", "Done"),
    emptyText: _t("REMINDER.EMPTY_STATE_TEXT", "Use your reminder list to keep track of all your tasks and activities."),
    emptyButtonText: _t("REMINDER.EMPTY_STATE_BUTTON_TEXT", "New reminder"),
    noItemsFoundHeader: _t("REMINDER.NO_ITEMS_FOUND_HEADER", "WOO!"),
    noItemsFoundText: _t("REMINDER.NO_ITEMS_FOUND_TEXT", "Nothing here but me..."),
    actionReschedule: _t("REMINDER.ACTION_RESCHEDULE", "Reschedule"),
    actionEdit: _t("REMINDER.ACTION_EDIT", "Edit"),
    actionMarkAsDone: _t("REMINDER.ACTION_MARK_AS_DONE", "Mark as done"),
    actionMarkAsUndone: _t("REMINDER.ACTION_MARK_AS_UNDONE", "Mark as not done"),
    actionRemove: _t("REMINDER.ACTION_REMOVE", "Remove"),
    actionFilter: _t("REMINDER.ACTION_FILTER", "Filter"),
  };

  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const handleFilterFile = (e) => {
    setFilter(e.target.dataset.filter);
    document.body.classList.remove("mobile-modal-open");
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const items = getSortedItems({ filter: { status: filter, search: search } });

  function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
  
  return (
    <Wrapper className={`container-fluid h-100 fadeIn ${className}`}>
      <div className="row app-block">
        <TodosSidebar className="col-lg-3" dictionary={dictionary} todoActions={todoActions} setFilter={handleFilterFile} filter={filter} count={count} />
        <div className="col-lg-9 app-content mb-4">
          <div className="app-content-overlay" />
          <TodosHeader dictionary={dictionary} onSearchChange={handleSearchChange} clearSearch={clearSearch} searchValue={search} />
          <TodosBody complete={false} isLoaded={isLoaded}  groupedTodoItems={groupBy(items, item => item.status)} todoItems={items} recent={doneRecently} dictionary={dictionary} todoActions={todoActions} filter={filter} />
        </div>
      </div>
    </Wrapper>
  );
};
export default React.memo(TodosPanel);
