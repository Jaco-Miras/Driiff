import React, { useState } from "react";
import styled from "styled-components";
import { useFileActions, useSettings, useTimeFormat, useRedirect } from "../../hooks";
import { TodosList, TodoEmptyState } from "./index";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  flex: unset !important;
  height:  100% !important;
  overflow: unset !important;
  ${(props) =>
    props.active &&
    `
  height: 100% !important;
  `}
  .badge-light {color:#FFF; background: rgb(175,184,189,0.2) !important; border 1px solid rgb(175,184,189,0.2);} 
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
  }
`;

const ListGroup = styled.ul`
  list-style: none;
  background: transparent;
  .list-group-item:last-child {
    border-bottom: none;
  }
  li:last-child {
    border-bottom: none;
  }
`;

const DivContainer = styled.div`
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
  ${(props) =>
    props.dark === "1" &&
    `
    :first-of-type {
      border-bottom: none;
    }
    :last-of-type {
      background: #2b2d31;
      border-color: rgba(155, 155, 155, 0.1)
      
    }
    :last-of-type .list-group-item {  background: transparent !important;}

  `}

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
const SpanTitle = styled.span`
  font-weight: 700;
  cursor: pointer;
  background: #f8f9fa !important;
  border: 1px solid #f8f9fa;
  ${(props) => props.todo && "border:1px solid rgba(0, 0, 0, 0.125);"}
`;

const TodosBody = (props) => {
  const { className = "", dictionary, isLoaded, todoActions, todoItems, doneTodoItems } = props;

  // const refs = {
  //   files: useRef(null),
  //   btnLoadMore: useRef(null),
  // };

  const { todoFormat, todoFormatShortCode } = useTimeFormat();
  const { getFileIcon } = useFileActions();
  const {
    generalSettings: { dark_mode },
  } = useSettings();
  // const initLoading = () => {
  //   loadMore.files();
  // };

  const redirect = useRedirect();

  // const handleScroll = (e) => {
  //   if (e.target.dataset.loading === "false") {
  //     if (e.target.scrollTop + 500 >= e.target.scrollHeight - e.target.offsetHeight) {
  //       if (refs.btnLoadMore.current) refs.btnLoadMore.current.click();
  //     }
  //   }
  // };

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

  // useEffect(() => {
  //   if (!refs.files.current) return;

  //   let el = refs.files.current;
  //   if (el && el.dataset.loaded === "0") {
  //     initLoading();

  //     el.dataset.loaded = "1";
  //     refs.files.current.addEventListener("scroll", handleScroll, false);
  //   }
  // }, [refs.files.current]);

  const [activeTitles, setActiveTitles] = useState({});

  const handleTitleClick = (e) => {
    setActiveTitles({
      ...activeTitles,
      [e.target.id]: !activeTitles[e.target.id],
    });
  };

  /*
  const setTodoList = () => {
   //return filter === "" ? ["To do", "Done"] : ["To do", "Done"];
   return  ["To do", "Done"];
  };*/

  const getTodoList = () => {
    return (
      <>
        {[dictionary.todo, dictionary.done].map((items, i) => {
          const todos = i === 0 ? todoItems : doneTodoItems;
          let reminder = todos.map((todo, ii) => {
            return (
              <TodosList
                key={todo.id}
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
          });
          return (
            <DivContainer key={items} dark={dark_mode}>
              <div style={{ "padding-left": "20px", "padding-right": "0px" }}>
                <h6 className=" mb-0 font-size-11 ml-1">
                  <SpanTitle className={`badge  ${dark_mode === "1" && "badge-light"} `} todo={items === "To do" ? false : true} onClick={handleTitleClick} id={"t_" + items}>
                    <SvgIconFeather icon={activeTitles["t_" + items] ? "arrow-down" : "arrow-up"} width={16} height={16} className="mr-1" />
                    {items}
                  </SpanTitle>
                </h6>
              </div>
              <ListGroup className={`list-group list-group-flush ${items === "Done" && "list-group-done"} ui-sortable fadeIn`} style={activeTitles["t_" + items] ? { display: "none" } : { display: "block" }}>
                {reminder}
              </ListGroup>
            </DivContainer>
          );
        })}
      </>
    );
  };

  return (
    <Wrapper className={`todos-body card app-content-body mb-4 ${className}`} active={todoItems.length ? false : true}>
      <div className="card-body" data-loaded={0}>
        {!isLoaded && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
        {isLoaded && (todoItems.length > 0 || doneTodoItems.length > 0) && getTodoList()}
        {isLoaded && !todoItems.length && !doneTodoItems.length && <TodoEmptyState dictionary={dictionary} />}
      </div>
    </Wrapper>
  );
};
export default React.memo(TodosBody);
