import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Avatar, SvgEmptyState, ToolTip } from "../../common";
import { useHistory } from "react-router-dom";
import { TodoCheckBox } from "../../forms";
import quillHelper from "../../../helpers/quillHelper";
import { useFileActions, useSettings, useTimeFormat } from "../../hooks";
import { MoreOptions } from "../common";
import { setViewFiles } from "../../../redux/actions/fileActions";
import { useDispatch } from "react-redux";

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
  const {
    className = "",
    dictionary,
    filter,
    isLoaded,
    loadMore,
    todoActions,
    todoItems
  } = props;

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
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
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
  }

  const handleScroll = (e) => {
    if (e.target.dataset.loading === "false") {
      if ((e.target.scrollTop + 500) >= e.target.scrollHeight - e.target.offsetHeight) {
        if (refs.btnLoadMore.current)
          refs.btnLoadMore.current.click();
      }
    }
  }

  const handleLinkClick = (e) => {
    e.preventDefault();
    history.push(e.currentTarget.dataset.link);
  }

  const getBadgeClass = (todo) => {
    if (todo.status === "OVERDUE") {
      return "badge-warning";
    }

    if (dark_mode === "1") {
      return "badge-dark";
    } else {
      return "badge-light";
    }
  }

  const getTodoType = (todo) => {
    switch (todo.link_type) {
      case "POST":
        return dictionary.typePost;
      case "CHAT":
        return dictionary.typeChat;
      case "POST_COMMENT":
        return dictionary.typePostComment;
    }
  }

  const handlePreviewFile = (e, files, file) => {
    e.preventDefault();
    e.stopPropagation();
    const payload = {
      files: files,
      file_id: file.file_id,
    };
    dispatch(setViewFiles(payload));
  };

  useEffect(() => {
    if (!refs.files.current)
      return;

    let el = refs.files.current;
    if (el && el.dataset.loaded === "0") {
      initLoading();

      el.dataset.loaded = "1";
      refs.files.current.addEventListener("scroll", handleScroll, false);
    }
  }, [refs.files.current]);

  return (
    <Wrapper className={`todos-body card app-content-body ${className}`}>
      <span className="d-none" ref={refs.btnLoadMore}>Load more</span>
      <div className="card-body app-lists" data-loaded={0}>
        {
          !isLoaded ?
            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"/>
            :
            todoItems.length !== 0 ?
              <ul className="list-group list-group-flush ui-sortable fadeIn">
                {
                  todoItems.map((todo, index) => {
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
                      <React.Fragment key={index}>
                        {
                          chatHeader !== "" &&
                          <li className="list-group-item link-title">
                            <div><h6 className="mt-3 mb-0 font-size-11 text-uppercase">{chatHeader}</h6></div>
                          </li>
                        }
                        <li className="pl-0 list-group-item">
                          <a className={todo.status === "DONE" ? "text-success" : ""} href={todo.link}
                             target="_blank" data-link={todo.link} onClick={(e) => {
                            e.preventDefault();
                            if (todo.link_type)
                              handleLinkClick(e);
                            else
                              todoActions.updateFromModal(todo)
                          }}>
                          <span className="d-flex justify-content-between w-100 align-items-center">
                              <span className="d-inline-flex overflow-hidden mr-3">
                                <span className="custom-control custom-checkbox custom-checkbox-success mr-2">
                                <ToolTip
                                  content={todo.status === "DONE" ? dictionary.actionMarkAsUndone : dictionary.actionMarkAsDone}>
                                    <TodoCheckBox name="test" checked={todo.status === "DONE"} onClick={(e) => {
                                      todoActions.toggleDone(todo);
                                    }}/>
                                </ToolTip>
                              </span>
                              <span className="mr-3 d-flex justify-content-center align-items-center">
                                <span className="todo-title mr-2">{todo.title}</span>
                                <span className="todo-title"
                                      dangerouslySetInnerHTML={{ __html: quillHelper.parseEmoji(todo.description) }}/>
                                {
                                  todo.files.map((file) => {
                                    return <span key={file.id}
                                                 onClick={e => handlePreviewFile(e, todo.files, file)}>{getFileIcon(file.mime_type)}</span>;
                                  })
                                }
                              </span>
                            </span>
                            <span className="action d-inline-flex justify-content-center align-items-center">
                              <span className="mr-3 align-items-center d-flex">
                                {
                                  todo.link_type !== null &&
                                  <span
                                    className={`badge badge-white badge-todo-type text-black mr-3`}>{getTodoType(todo)}</span>
                                }
                                {
                                  todo.remind_at &&
                                  <ToolTip content={todoFormat(todo.remind_at.timestamp)}>
                                    <span
                                      className={`badge ${getBadgeClass(todo)} text-white mr-3`}>{todoFormatShortCode(todo.remind_at.timestamp)}</span>
                                  </ToolTip>
                                }
                                {
                                  todo.author !== null &&
                                  <Avatar key={todo.author.id} name={todo.author.name}
                                          imageLink={todo.author.profile_image_link} id={todo.author.id}/>
                                }
                              </span>
                                <MoreOptions className="ml-2" item={todo} width={170} moreButton={"more-horizontal"}>
                                <div onClick={() => todoActions.updateFromModal(todo)}>{dictionary.actionEdit}</div>
                                <div
                                  onClick={() => todoActions.removeConfirmation(todo)}>{dictionary.actionRemove}</div>
                              </MoreOptions>
                            </span>
                          </span>
                          </a>
                        </li>
                      </React.Fragment>
                    );
                  })}
              </ul>
              :
              <>
                {
                  filter === "" ?
                    <EmptyState>
                      <SvgEmptyState icon={1} height={282}/>
                      <h5>{dictionary.emptyText}</h5>
                      <button onClick={() => todoActions.createFromModal()}
                              className="btn btn-primary">{dictionary.emptyButtonText}</button>
                    </EmptyState>
                    :
                    <EmptyState>
                      <SvgEmptyState icon={1} height={282}/>
                      <h5>{dictionary.noItemsFound}</h5>
                    </EmptyState>
                }
              </>
        }
      </div>
    </Wrapper>
  );
};

export default React.memo(TodosBody);
