import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useFileActions, useSettings, useTimeFormat, useRedirect } from "../../hooks";
import { TodosList } from "./index";
import ListContainer from "./ListContainer";

const Wrapper = styled.div`
  flex: unset !important;
  height: 100% !important;
  min-height: 150px;
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
    color: #343a40;

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
  }
  .list-group-done .custom-checkbox .cci.cci-active + .ccl span:first-child svg {
    stroke: #191c20;
  }
`;

const TodosBody = (props) => {
  const { className = "", dictionary, filter, isLoaded, todoActions, todoItems, doneTodoItems } = props;

  const { todoFormat, todoFormatShortCode } = useTimeFormat();
  const { getFileIcon } = useFileActions();
  const {
    generalSettings: { dark_mode },
  } = useSettings();

  const redirect = useRedirect();
  const params = useParams();

  const handleLinkClick = (e, todo) => {
    e.preventDefault();
    if (todo.link_type === "CHAT") {
      redirect.toChat(todo.data.channel, todo.data.chat_message);
    } else {
      let post = {
        id: todo.link_type === "POST_COMMENT" && todo.data ? todo.data.post.id : todo.link_id,
        title: todo.title,
      };
      let workspace = {
        ...todo.workspace,
        folder_id: todo.folder ? todo.folder.id : null,
        folder_name: todo.folder ? todo.folder.name : null,
      };
      redirect.toPost({ workspace, post });
    }
  };

  //const [activeTitles, setActiveTitles] = useState({});

  // const handleTitleClick = (e) => {
  //   setActiveTitles({
  //     ...activeTitles,
  //     [e.target.id]: !activeTitles[e.target.id],
  //   });
  // };

  const [showList, setShowList] = useState({
    todo: false,
    done: false,
  });

  const handleShowTodo = () => {
    if (showList.todo) {
      // to false
      setShowList({
        todo: doneTodoItems.length > 0 ? false : true,
        done: doneTodoItems.length > 0 ? true : false,
      });
    } else {
      // to true
      setShowList({
        todo: true,
        done: showList.done,
      });
    }
  };

  const handleShowDone = () => {
    if (showList.done) {
      // to false
      setShowList({
        todo: todoItems.length > 0 ? true : false,
        done: todoItems.length > 0 ? false : true,
      });
    } else {
      // to true
      setShowList({
        todo: todoItems.length > 0 ? true : false,
        done: doneTodoItems.length > 0 ? true : false,
      });
    }
  };

  useEffect(() => {
    setShowList((prevState) => {
      return {
        todo: todoItems.length > 0 || doneTodoItems.length === 0 ? true : prevState.todo,
        done: todoItems.length > 0 ? false : true,
      };
    });
  }, [filter]);

  useEffect(() => {
    // if bot category is set to false then show the category with posts
    if (!showList.done && !showList.todo) {
      if (doneTodoItems.length) {
        setShowList((prevState) => {
          return {
            ...prevState,
            done: true,
          };
        });
      } else {
        setShowList((prevState) => {
          return {
            ...prevState,
            todo: true,
          };
        });
      }
    }
  }, [showList, todoItems, doneTodoItems]);

  // const getTodoList = () => {
  //   return (
  //     <>
  //       {[dictionary.todo, dictionary.done].map((items, i) => {
  //         const todos = i === 0 ? todoItems : doneTodoItems;
  //         let reminder = todos.map((todo, ii) => {
  //           return (
  //             <TodosList
  //               key={todo.id}
  //               todo={todo}
  //               todoActions={todoActions}
  //               dictionary={dictionary}
  //               handleLinkClick={handleLinkClick}
  //               dark_mode={dark_mode}
  //               todoFormat={todoFormat}
  //               todoFormatShortCode={todoFormatShortCode}
  //               getFileIcon={getFileIcon}
  //             />
  //           );
  //         });
  //         return (
  //           <DivContainer key={items}>
  //             <div style={{ "padding-left": "20px", "padding-right": "0px" }}>
  //               <h6 className=" mb-0 font-size-11 ml-1">
  //                 <SpanTitle className={`badge  ${dark_mode === "1" && "badge-light"} `} todo={items === "To do" ? false : true} onClick={handleTitleClick} id={"t_" + items}>
  //                   <SvgIconFeather icon={activeTitles["t_" + items] ? "arrow-down" : "arrow-up"} width={16} height={16} className="mr-1" />
  //                   {items}
  //                 </SpanTitle>
  //               </h6>
  //             </div>
  //             <ListGroup className={`list-group list-group-flush ${items === "Done" && "list-group-done"} ui-sortable fadeIn`} style={activeTitles["t_" + items] ? { display: "none" } : { display: "block" }}>
  //               {reminder}
  //             </ListGroup>
  //           </DivContainer>
  //         );
  //       })}
  //     </>
  //   );
  // };

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
            items={todoItems}
            headerChild={params.hasOwnProperty("workspaceId") ? <span className="badge badge-light">{params.workspaceId}</span> : null}
            ItemList={(item) => (
              <TodosList
                key={item.id}
                todo={item}
                todoActions={todoActions}
                dictionary={dictionary}
                handleLinkClick={handleLinkClick}
                dark_mode={dark_mode}
                todoFormat={todoFormat}
                todoFormatShortCode={todoFormatShortCode}
                getFileIcon={getFileIcon}
                showWsBadge={!params.hasOwnProperty("workspaceId")}
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
            items={doneTodoItems}
            ItemList={(item) => (
              <TodosList
                key={item.id}
                todo={item}
                todoActions={todoActions}
                dictionary={dictionary}
                handleLinkClick={handleLinkClick}
                dark_mode={dark_mode}
                todoFormat={todoFormat}
                todoFormatShortCode={todoFormatShortCode}
                getFileIcon={getFileIcon}
                showWsBadge={!params.hasOwnProperty("workspaceId")}
              />
            )}
          ></StyledListContainer>
        </div>
      )}
    </Wrapper>
  );
};

export default React.memo(TodosBody);
