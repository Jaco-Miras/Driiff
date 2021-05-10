import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useTodos, useTranslation } from "../../hooks";
import { TodosBody, TodosHeader, TodosSidebar } from "../todos";

const Wrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  text-align: left;
  .app-sidebar-menu {
    overflow: hidden;
    outline: currentcolor none medium;
  }
`;

const WorkspaceRemindersPanel = (props) => {
  const { getSortedItems, action: todoActions, isLoaded, count } = useTodos(true); //pass true to fetch to do list on mount - default to false

  const { _t } = useTranslation();

  const activeTopic = useSelector((state) => state.workspaces.activeTopic);

  const dictionary = {
    searchInputPlaceholder: _t("REMINDER.SEARCH_INPUT_PLACEHOLDER", "Search your reminders on title and description."),
    createNewTodoItem: _t("REMINDER.CREATE_NEW_TODO_ITEM", "Add new"),
    typePost: _t("REMINDER.TYPE_POST", "Post"),
    typeChat: _t("REMINDER.TYPE_CHAT", "Chat"),
    typePostComment: _t("REMINDER.TYPE_POST_COMMENT", "Post comment"),
    statusToday: _t("REMINDER.STATUS_TODAY", "Today"),
    statusAll: _t("REMINDER.STATUS_ALL", "ALL"),
    statusExpired: _t("REMINDER.STATUS_EXPIRED", "Expired"),
    statusUpcoming: _t("REMINDER.STATUS_UPCOMING", "Today"),
    statusOverdue: _t("REMINDER.STATUS_OVERDUE", "Overdue"),
    statusUpcomingToday: _t("REMINDER.STATUS_UPCOMING", "Upcoming Today"),
    statusDone: _t("REMINDER.STATUS_DONE", "Done"),
    emptyText: _t("REMINDER.EMPTY_STATE_TEXT", "Use your reminder list to keep track of all your tasks and activities."),
    emptyButtonText: _t("REMINDER.EMPTY_STATE_BUTTON_TEXT", "New reminder"),
    noItemsFoundHeader: _t("REMINDER.NO_ITEMS_FOUND_HEADER", "Some random Header"),
    noItemsFoundText: _t("REMINDER.NO_ITEMS_FOUND_TEXT", "Some random text here..."),
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

  const getDone = (filter, search) => {
    return filter === "" ? getSortedItems({ filter: { status: "DONE", search: search } }).filter((item) => item.workspace && activeTopic && item.workspace.id === activeTopic.id) : [];
  };

  const workspaceReminders = items.filter((item) => item.workspace && activeTopic && item.workspace.id === activeTopic.id);
  console.log(workspaceReminders, items);
  return (
    <Wrapper className={"container-fluid h-100 fadeIn"}>
      <div className="row app-block" style={{ oveflow: "inherit", height: workspaceReminders.length ? "auto" : "100%" }}>
        <TodosSidebar className="col-lg-3" dictionary={dictionary} todoActions={todoActions} setFilter={handleFilterFile} filter={filter} count={count} />
        <div className="col-lg-9 app-content mb-4">
          <div className="app-content-overlay" />
          <TodosHeader dictionary={dictionary} onSearchChange={handleSearchChange} clearSearch={clearSearch} searchValue={search} />
          <TodosBody complete={false} isLoaded={isLoaded} todoItems={workspaceReminders} dictionary={dictionary} todoActions={todoActions} filter={filter} getDone={getDone(filter, search)} />
        </div>
      </div>
    </Wrapper>
  );
};

export default WorkspaceRemindersPanel;
