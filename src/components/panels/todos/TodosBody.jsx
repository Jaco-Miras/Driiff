import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { SvgEmptyState } from "../../common";
import { useHistory } from "react-router-dom";
import { useFileActions, useSettings, useTimeFormat } from "../../hooks";
import { getChatMessages, setLastVisitedChannel } from "../../../redux/actions/chatActions";
import { useDispatch, useSelector } from "react-redux";
import { TodosList } from "./index";

const Wrapper = styled.div`
  .list-group {
    .list-group-item {
      padding: 0.75rem 1.5rem 0 0.75rem;

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

    .cci.cci-active + .ccl {
      span:first-child {
        background: #00c851;
        border-color: #00c851;
      }
    }
  }

  li.link-title {
    border-radius: 6px;
    font-weight: 500;
    font-size: 11px;
    text-transform: uppercase;
    line-height: 1.2;

    &:not(:nth-child(1)) {
      margin-top: 2rem;
    }
  }

  .text-success {
    text-decoration: line-through;
  }

  .todo-title {
    color: #343a40;

    &.description {
      color: #b8b8b8;
    }

    svg {
      height: 16px;
    }
  }
`;

const EmptyState = styled.div`
  padding: 5rem 0;
  max-width: 750px;
  margin: auto;
  text-align: center;

  svg {
    display: block;
    margin: 0 auto;
  }

  h5 {
    margin-top: 2rem;
    margin-bottom: 0;
  }

  button {
    width: auto !important;
    margin: 2rem auto;
  }
`;

const TodosBody = (props) => {
  const { className = "", dictionary, filter, isLoaded, loadMore, todoActions, todoItems } = props;

  const config = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  const refs = {
    files: useRef(null),
    btnLoadMore: useRef(null),
  };

  const dispatch = useDispatch();
  const history = useHistory();
  const { todoFormat, todoFormatShortCode } = useTimeFormat();
  const { getFileIcon } = useFileActions();
  const {
    generalSettings: { dark_mode },
  } = useSettings();
  const initLoading = () => {
    loadMore.files();
  };

  const channels = useSelector((state) => state.chat.channels);

  const handleScroll = (e) => {
    if (e.target.dataset.loading === "false") {
      if (e.target.scrollTop + 500 >= e.target.scrollHeight - e.target.offsetHeight) {
        if (refs.btnLoadMore.current) refs.btnLoadMore.current.click();
      }
    }
  };

  const handleLinkClick = (e, todo) => {
    e.preventDefault();
    if (todo.link_type === "CHAT") {
      let payload = {
        channel_id: todo.data.channel.id,
        skip: 0,
        before_chat_id: todo.data.chat_message.id,
        limit: 10,
      };
      if (channels.hasOwnProperty(todo.data.channel.id)) {
        let channel = { ...channels[todo.data.channel.id] };
        let cb = () => {
          history.push(e.currentTarget.dataset.link, { focusOn: todo.data.chat_message.code });
        };
        if (channel.replies.find((r) => r.id === todo.data.chat_message.id)) {
          dispatch(setLastVisitedChannel(channel, cb));
        } else {
          dispatch(getChatMessages(payload));
          dispatch(setLastVisitedChannel(channel, cb));
        }
      }
    }
  };

  useEffect(() => {
    if (!refs.files.current) return;

    let el = refs.files.current;
    if (el && el.dataset.loaded === "0") {
      initLoading();

      el.dataset.loaded = "1";
      refs.files.current.addEventListener("scroll", handleScroll, false);
    }
  }, [refs.files.current]);

  return (
    <Wrapper className={`todos-body card app-content-body ${className}`}>
      <span className="d-none" ref={refs.btnLoadMore}>
        Load more
      </span>
      <div className="card-body app-lists" data-loaded={0}>
        {!isLoaded ? (
          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
        ) : todoItems.length !== 0 ? (
          <ul className="list-group list-group-flush ui-sortable fadeIn">
            {todoItems.map((todo, index) => {
              let chatHeader = "";
              if (index === 0) {
                switch (todo.status) {
                  case "OVERDUE": {
                    chatHeader = dictionary.statusOverdue;
                    break;
                  }
                  case "TODAY": {
                    chatHeader = dictionary.statusUpcomingToday;
                    break;
                  }
                  case "NEW": {
                    chatHeader = dictionary.statusUpcoming;
                    break;
                  }
                  case "DONE": {
                    chatHeader = dictionary.statusDone;
                    break;
                  }
                }
              } else {
                let prevTodo = todoItems[index - 1];
                if (prevTodo.status !== todo.status) {
                  switch (todo.status) {
                    case "TODAY": {
                      chatHeader = dictionary.statusToday;
                      break;
                    }
                    case "OVERDUE": {
                      chatHeader = dictionary.statusOverdue;
                      break;
                    }
                    case "NEW": {
                      chatHeader = dictionary.statusUpcoming;
                      break;
                    }
                    case "DONE": {
                      chatHeader = dictionary.statusDone;
                      break;
                    }
                  }
                }
              }

              return (
                <TodosList
                  key={todo.id}
                  chatHeader={chatHeader}
                  todo={todo}
                  todoActions={todoActions}
                  dictionary={dictionary}
                  handleLinkClick={handleLinkClick}
                  dark_mode={dark_mode}
                  todoFormat={todoFormat}
                  todoFormatShortCode={todoFormatShortCode}
                  getFileIcon={getFileIcon}
                />
              );
            })}
          </ul>
        ) : (
          <>
            {filter === "" ? (
              <EmptyState>
                <SvgEmptyState icon={1} height={282} />
                <h5>{dictionary.emptyText}</h5>
                <button onClick={() => todoActions.createFromModal()} className="btn btn-primary">
                  {dictionary.emptyButtonText}
                </button>
              </EmptyState>
            ) : (
              <EmptyState>
                <SvgEmptyState icon={1} height={282} />
                <h5>{dictionary.noItemsFound}</h5>
              </EmptyState>
            )}
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default React.memo(TodosBody);
