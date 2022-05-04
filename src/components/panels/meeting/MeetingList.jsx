import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTimeFormat, useRedirect, useTodos } from "../../hooks";
import ListContainer from "../todos/ListContainer";
import { useTranslationActions } from "../../hooks";
import MeetingListItem from "./MeetingListItem";

const Wrapper = styled.div`
  flex: unset !important;
  height: 100% !important;
  overflow: unset !important;
  ${(props) =>
    props.active &&
    `
  height: 100% !important;
  `}
  .list-group {
    .list-group-item {
      padding: 0rem 1.5rem 0 0.75rem;

      > a {
        display: block;
        width: 100%;

        .badge-todo-type {
          border: 1px solid #000;
        }
      }
    }
  }

  .custom-checkbox {
    position: relative;
    top: 1.5px;
    padding: 0;
    input[type="checkbox"] {
      cursor: pointer;
    }

    .cci.cci-active + .ccl {
      span:first-child {
        background: #00c851;
        border-color: #00c851;
      }
    }
  }

  .todo-title {
    // color: #343a40;

    &.description {
      color: #b8b8b8;
    }

    svg {
      height: 16px;
    }
  }

  .card-body {
    padding: 0;
    overflow: unset;
    height: 100%;
    display: flex;
    flex-flow: column;
  }
`;

const StyledListContainer = styled(ListContainer)`
  padding-top: 15px;
  padding-bottom: 15px;
  :first-of-type {
    padding-bottom: 10px;
  }
  :nth-child(even) {
    background: #f8f9fa;
  }
  :nth-child(odd) {
    background: transparent;
  }
  border-bottom: 1px solid #ebebeb;
  :last-of-type {
    border: none;
  }
  .dark & {
    :first-of-type {
      border-bottom: none;
    }
    :last-of-type {
      background: #2b2d31;
      border-color: rgba(155, 155, 155, 0.1);
    }
    :last-of-type .list-group-item {
      background: transparent !important;
    }
  }

  .custom-checkbox .ccl span:first-child {
    border-radius: 10px;
  }

  .list-group-done .custom-checkbox .cci.cci-active + .ccl span:first-child {
    background: #efefef;
    border: 1px solid #9098a9;
    color: #8b8b8b;
  }
  .list-group-done .custom-checkbox .cci.cci-active + .ccl span:first-child svg {
    color: #8b8b8b;
    stroke: #8b8b8b;
  }
`;

const MeetingList = (props) => {
  const { className = "", workspaceName = null, isWorkspace } = props;

  const { _t } = useTranslationActions();
  const meetings = useSelector((state) => state.global.meetings);

  let newItemsFoundHeader = [_t("REMINDER.NO_ITEMS_FOUND_HEADER_2", "WOO!"), _t("REMINDER.NO_ITEMS_FOUND_HEADER_4", "Queue’s empty, time to dance!"), _t("REMINDER.NO_ITEMS_FOUND_HEADER_5", "No reminders.")];

  let newItemsFoundText = [_t("REMINDER.NO_ITEMS_FOUND_TEXT_2", "Nothing here but me… 👻"), _t("REMINDER.NO_ITEMS_FOUND_TEXT_4", "Job well done!💃🕺"), _t("REMINDER.NO_ITEMS_FOUND_TEXT_5", "You run a tight ship captain! 🚀")];

  if (meetings.search !== "") {
    newItemsFoundHeader = [_t("REMINDER.NO_ITEMS_FOUND_HEADER_1", "Couldn’t find what you’re looking for.")];
    newItemsFoundText = [_t("REMINDER.NO_ITEMS_FOUND_TEXT_1", "Try something else, Sherlock. 🕵")];
  }
  const [inDexer, setInDexer] = useState(Math.floor(Math.random() * newItemsFoundHeader.length));
  const dictionary = {
    searchInputPlaceholder: _t("REMINDER.SEARCH_INPUT_PLACEHOLDER", "Search your reminders on title and description."),
    createNewTodoItem: _t("REMINDER.CREATE_NEW_TODO_ITEM", "Add new"),
    typePost: _t("REMINDER.TYPE_POST", "Post"),
    typeChat: _t("REMINDER.TYPE_CHAT", "Chat"),
    typePostComment: _t("REMINDER.TYPE_POST_COMMENT", "Post comment"),
    statusToday: _t("REMINDER.STATUS_TODAY", "Today"),
    statusAll: _t("REMINDER.STATUS_ALL", "ALL"),
    statusExpired: _t("REMINDER.STATUS_EXPIRED", "Expired"),
    statusUpcoming: _t("REMINDER.STATUS_UPCOMING", "Upcoming"),
    statusOverdue: _t("REMINDER.STATUS_OVERDUE", "Overdue"),
    statusUpcomingToday: _t("REMINDER.STATUS_UPCOMING", "Upcoming Today"),
    statusDone: _t("REMINDER.STATUS_DONE", "Done"),
    emptyText: _t("REMINDER.EMPTY_STATE_TEXT", "Use your reminder list to keep track of all your tasks and activities."),
    emptyButtonText: _t("REMINDER.EMPTY_STATE_BUTTON_TEXT", "New reminder"),
    noItemsFoundHeader: newItemsFoundHeader[inDexer],
    noItemsFoundText: newItemsFoundText[inDexer],
    actionReschedule: _t("REMINDER.ACTION_RESCHEDULE", "Reschedule"),
    actionEdit: _t("REMINDER.ACTION_EDIT", "Edit"),
    actionMarkAsDone: _t("REMINDER.ACTION_MARK_AS_DONE", "Mark as done"),
    actionMarkAsUndone: _t("REMINDER.ACTION_MARK_AS_UNDONE", "Mark as not done"),
    actionRemove: _t("REMINDER.ACTION_REMOVE", "Remove"),
    actionFilter: _t("REMINDER.ACTION_FILTER", "Filter"),
    reminderAuthor: _t("REMINDER.AUTHOR", "Author"),
    reminderAssignedTo: _t("REMINDER.ASSIGNED_TO", "Assigned to"),
    todo: _t("REMINDER.TO_DO", "To do"),
    done: _t("REMINDER.DONE", "Done"),
    addDate: _t("REMINDER.ADD_DATE", "Add date"),
    addedByMe: _t("REMINDER.ADDED_BY_ME", "Added by me"),
    addedByOthers: _t("REMINDER.ADDED_BY_OTHERS", "Added by others"),
    sortAlpha: _t("TODO_SORT_OPTIONS.ALPHA", "Sort by alphabetical order"),
    sortDate: _t("TODO_SORT_OPTIONS.DATE", "Sort by due date"),
  };

  const { getVideoReminders, action: todoActions, isLoaded } = useTodos(true); //pass true to fetch to do list on mount - default to false
  const { todoFormat, todoFormatShortCode } = useTimeFormat();

  const videoReminders = getVideoReminders({ filter: { status: meetings.filter, search: meetings.search, isWorkspace: isWorkspace } });
  let timestamp = Math.floor(Date.now() / 1000);
  const meetingItems = videoReminders.filter((t) => {
    const notExpired = t.remind_at === null || (t.remind_at && t.remind_at.timestamp > timestamp);
    return notExpired;
  });
  const pastMeetingItems = videoReminders.filter((t) => {
    const notExpired = t.remind_at === null || (t.remind_at && t.remind_at.timestamp > timestamp);
    return !notExpired;
  });

  const redirect = useRedirect();
  const params = useParams();

  const [showList, setShowList] = useState({
    todo: true,
    done: false,
  });

  const [sortByDate, setSortByDate] = useState(true);

  useEffect(() => {
    setInDexer(Math.floor(Math.random() * newItemsFoundHeader.length));
  }, [meetings.filter]);

  const handleShowTodo = () => {
    setShowList({
      todo: !showList.todo,
      done: showList.done,
    });
  };

  const handleShowDone = () => {
    setShowList({
      todo: showList.todo,
      done: !showList.done,
    });
  };

  const handleRedirectToWorkspace = (e, todo) => {
    e.preventDefault();
    e.stopPropagation();
    redirect.toWorkspace(todo.workspace, "reminders");
  };

  const handleSort = () => {
    setSortByDate(!sortByDate);
  };

  const sortItems = (items) => {
    return Object.values(items).sort((a, b) => {
      if (sortByDate) {
        if (a.remind_at && b.remind_at) {
          return b.remind_at.timestamp - a.remind_at.timestamp;
        }
        if (a.remind_at === null && b.remind_at === null) {
          return a.title.localeCompare(b.title);
        }
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  };

  return (
    <Wrapper className={`todos-body card app-content-body mb-4 ${className}`} active={meetingItems.length ? false : true}>
      {!isLoaded && (
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
        </div>
      )}
      {isLoaded && (
        <div className="card-body">
          <StyledListContainer
            active={showList.todo}
            dictionary={dictionary}
            handleHeaderClick={handleShowTodo}
            headerText={"Meetings"}
            items={sortItems(meetingItems)}
            params={params}
            workspaceName={workspaceName}
            sortByDate={sortByDate}
            handleSort={handleSort}
            ItemList={(item) => (
              <MeetingListItem
                key={item.id}
                todo={item}
                todoActions={todoActions}
                dictionary={dictionary}
                todoFormat={todoFormat}
                todoFormatShortCode={todoFormatShortCode}
                showWsBadge={!params.hasOwnProperty("workspaceId")}
                handleRedirectToWorkspace={handleRedirectToWorkspace}
              />
            )}
          ></StyledListContainer>
          <StyledListContainer
            active={showList.done}
            dictionary={dictionary}
            showEmptyState={false}
            listGroupClassname={"list-group-done"}
            handleHeaderClick={handleShowDone}
            headerText={"Past meetings"}
            items={sortItems(pastMeetingItems)}
            params={params}
            workspaceName={null}
            sortByDate={sortByDate}
            handleSort={handleSort}
            ItemList={(item) => (
              <MeetingListItem
                key={item.id}
                todo={item}
                todoActions={todoActions}
                dictionary={dictionary}
                todoFormat={todoFormat}
                todoFormatShortCode={todoFormatShortCode}
                showWsBadge={!params.hasOwnProperty("workspaceId")}
                handleRedirectToWorkspace={handleRedirectToWorkspace}
              />
            )}
          ></StyledListContainer>
        </div>
      )}
    </Wrapper>
  );
};

export default React.memo(MeetingList);
