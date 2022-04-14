import React, { useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useFileActions, useTimeFormat, useRedirect } from "../../hooks";
import { TodosList } from "./index";
import ListContainer from "./ListContainer";
import { SvgIconFeather } from "../../common";

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

const TodosBody = (props) => {
  const { className = "", dictionary, isLoaded, todoActions, todoItems, doneTodoItems, workspaceName = null } = props;

  const { todoFormat, todoFormatShortCode } = useTimeFormat();
  const { getFileIcon } = useFileActions();

  const redirect = useRedirect();
  const params = useParams();

  const handleLinkClick = (e, todo) => {
    e.preventDefault();
    if (todo.link_type === "DRIFF_TALK") {
      todoActions.updateFromModal(todo);
    } else if (todo.link_type === "CHAT") {
      redirect.toChat(todo.data.channel, todo.data.chat_message);
    } else {
      let post = {
        id: todo.link_type === "POST_COMMENT" && todo.data ? todo.data.post.id : todo.link_id,
        title: todo.title,
      };
      let workspace = null;
      if (todo.workspace) {
        workspace = {
          ...todo.workspace,
          folder_id: todo.folder ? todo.folder.id : null,
          folder_name: todo.folder ? todo.folder.name : null,
        };
      }

      redirect.toPost({ workspace, post });
    }
  };

  const [showList, setShowList] = useState({
    todo: true,
    done: false,
  });

  const [sortByDate, setSortByDate] = useState(true);

  const handleShowTodo = () => {
    // if (showList.todo) {
    //   // to false
    //   setShowList({
    //     todo: doneTodoItems.length > 0 ? false : true,
    //     done: doneTodoItems.length > 0 ? true : false,
    //   });
    // } else {
    //   // to true
    //   setShowList({
    //     todo: true,
    //     done: showList.done,
    //   });
    // }
    setShowList({
      todo: !showList.todo,
      done: showList.done,
    });
  };

  const handleShowDone = () => {
    // if (showList.done) {
    //   // to false
    //   setShowList({
    //     todo: todoItems.length > 0 ? true : false,
    //     done: todoItems.length > 0 ? false : true,
    //   });
    // } else {
    //   // to true
    //   setShowList({
    //     todo: todoItems.length > 0 ? true : false,
    //     done: doneTodoItems.length > 0 ? true : false,
    //   });
    // }
    setShowList({
      todo: showList.todo,
      done: !showList.done,
    });
  };

  // useEffect(() => {
  //   setShowList((prevState) => {
  //     return {
  //       todo: todoItems.length > 0 || doneTodoItems.length === 0 ? true : prevState.todo,
  //       done: todoItems.length > 0 ? false : true,
  //     };
  //   });
  // }, [filter]);

  // useEffect(() => {
  //   // if bot category is set to false then show the to do section
  //   if (!showList.done && !showList.todo) {
  //     if (todoItems.length && doneTodoItems.length) {
  //       setShowList((prevState) => {
  //         return {
  //           ...prevState,
  //           done: true,
  //         };
  //       });
  //     } else {
  //       setShowList((prevState) => {
  //         return {
  //           ...prevState,
  //           todo: true,
  //         };
  //       });
  //     }
  //   }
  // }, [showList, todoItems, doneTodoItems]);
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
          return a.remind_at.timestamp - b.remind_at.timestamp;
        }
        if (a.remind_at && b.remind_at === null) {
          return -1;
        }

        if (a.remind_at === null && b.remind_at) {
          return 1;
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
    <Wrapper className={`todos-body card app-content-body mb-4 ${className}`} active={todoItems.length ? false : true}>
      {!isLoaded && (
        <div className="card-body">
          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
        </div>
      )}
      {/* {isLoaded && (todoItems.length > 0 || doneTodoItems.length > 0) && getTodoList()} */}
      {isLoaded && (
        <div className="card-body">
          <StyledListContainer
            active={showList.todo}
            dictionary={dictionary}
            handleHeaderClick={handleShowTodo}
            headerText={dictionary.todo}
            items={sortItems(todoItems)}
            params={params}
            workspaceName={workspaceName}
            sortByDate={sortByDate}
            handleSort={handleSort}
            //headerChild={params.hasOwnProperty("workspaceId") ? <span className="badge badge-light">{workspaceName}</span> : null}
            ItemList={(item) => (
              <TodosList
                key={item.id}
                todo={item}
                todoActions={todoActions}
                dictionary={dictionary}
                handleLinkClick={handleLinkClick}
                todoFormat={todoFormat}
                todoFormatShortCode={todoFormatShortCode}
                getFileIcon={getFileIcon}
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
            headerText={dictionary.done}
            items={sortItems(doneTodoItems)}
            params={params}
            workspaceName={null}
            sortByDate={sortByDate}
            handleSort={handleSort}
            ItemList={(item) => (
              <TodosList
                key={item.id}
                todo={item}
                todoActions={todoActions}
                dictionary={dictionary}
                handleLinkClick={handleLinkClick}
                todoFormat={todoFormat}
                todoFormatShortCode={todoFormatShortCode}
                getFileIcon={getFileIcon}
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

export default React.memo(TodosBody);
