import React, { useState } from "react";
import styled from "styled-components";
import { useTodos, useTranslation } from "../../hooks";
import { TodosBody, TodosHeader, TodosSidebar } from "./index";

const Wrapper = styled.div`
overflow: ${(props) => (props.hasReminders ? "auto !important" : "unset !important")} ;
  text-align: left;
  .app-sidebar-menu {
    overflow: hidden;
    outline: currentcolor none medium;
  }
  .app-block {
    overflow: unset !important;
    height: ${(props) => (props.hasReminders ? "auto" : "100%")};
  }
`;

const TodosPanel = (props) => {
  const { className = "" } = props;

  const { getReminders, action: todoActions, isLoaded, count } = useTodos(true); //pass true to fetch to do list on mount - default to false

  const { _t } = useTranslation();

  var newItemsFoundHeader = [_t("REMINDER.NO_ITEMS_FOUND_HEADER_1", 'Couldn’t find what you’re looking for.'),
  _t("REMINDER.NO_ITEMS_FOUND_HEADER_2", 'WOO!'),
  _t("REMINDER.NO_ITEMS_FOUND_HEADER_3", 'Nothing is overdue.'),
  _t("REMINDER.NO_ITEMS_FOUND_HEADER_4", 'Queue’s empty, time to dance!'),
  _t("REMINDER.NO_ITEMS_FOUND_HEADER_5", 'No reminders.')];

  var newItemsFoundText = [_t("REMINDER.NO_ITEMS_FOUND_TEXT_1", 'Try something else, Sherlock. 🕵'),
  _t("REMINDER.NO_ITEMS_FOUND_TEXT_2", 'Nothing here but me… 👻'),
  _t("REMINDER.NO_ITEMS_FOUND_TEXT_3", 'You are out of this world! 👨‍🚀'),
  _t("REMINDER.NO_ITEMS_FOUND_TEXT_4", 'Job well done!💃🕺'),
  _t("REMINDER.NO_ITEMS_FOUND_TEXT_5", 'You run a tight ship captain! 🚀')];

  var randomI = Math.floor(Math.random() * 5);

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
    noItemsFoundHeader: newItemsFoundHeader[randomI],
    noItemsFoundText: newItemsFoundText[randomI],
    actionReschedule: _t("REMINDER.ACTION_RESCHEDULE", "Reschedule"),
    actionEdit: _t("REMINDER.ACTION_EDIT", "Edit"),
    actionMarkAsDone: _t("REMINDER.ACTION_MARK_AS_DONE", "Mark as done"),
    actionMarkAsUndone: _t("REMINDER.ACTION_MARK_AS_UNDONE", "Mark as not done"),
    actionRemove: _t("REMINDER.ACTION_REMOVE", "Remove"),
    actionFilter: _t("REMINDER.ACTION_FILTER", "Filter"),
    reminderAuthor: _t("REMINDER.AUTHOR", "Author"),
    reminderAssignedTo: _t("REMINDER.ASSIGNED_TO", "Assigned to")
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

  const reminders = getReminders({ filter: { status: filter, search: search } });
  return (
    <Wrapper className={`container-fluid h-100 fadeIn ${className}`} hasReminders={reminders.length > 0}>
      <div className="row app-block">
        <TodosSidebar className="col-lg-3" dictionary={dictionary} todoActions={todoActions} setFilter={handleFilterFile} filter={filter} count={count} />
        <div className="col-lg-9 app-content mb-4">
          <div className="app-content-overlay" />
          <TodosHeader dictionary={dictionary} onSearchChange={handleSearchChange} clearSearch={clearSearch} searchValue={search} />
          <TodosBody complete={false} isLoaded={isLoaded} todoItems={reminders.filter((i) => i.status !== "DONE")} dictionary={dictionary} todoActions={todoActions} filter={filter} getDone={reminders.filter((i) => i.status === "DONE")} />
        </div>
      </div>
    </Wrapper>
  );
};
export default React.memo(TodosPanel);
