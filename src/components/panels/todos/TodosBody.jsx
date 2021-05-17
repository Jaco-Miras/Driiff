import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
//import { SvgEmptyState } from "../../common";
//import { useHistory } from "react-router-dom";
import { useFileActions, useSettings, useTimeFormat, useRedirect } from "../../hooks";
// import { getChatMessages, setLastVisitedChannel } from "../../../redux/actions/chatActions";
// import { useDispatch, useSelector } from "react-redux";
import { TodosList } from "./index";
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

const EmptyState = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  width: 100%;
  text-align: center;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  margin: auto;
  text-align: center;

  svg {
    display: block;
    margin: 0 auto;
  }

  h3 {
    font-size: 16px;
  }
  h5 {
    margin-bottom: 0;
    font-size: 14px;
  }

  button {
    width: auto !important;
    margin: 2rem auto;
  }
`;

// const Icon = styled(SvgIconFeather)`
//   width: 16px;
// `;

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
  const { className = "", dictionary, filter, isLoaded, loadMore, todoActions, todoItems, getDone } = props;

  // const config = {
  //   angle: 90,
  //   spread: 360,
  //   startVelocity: 40,
  //   elementCount: 70,
  //   dragFriction: 0.12,
  //   duration: 3000,
  //   stagger: 3,
  //   width: "10px",
  //   height: "10px",
  //   perspective: "500px",
  //   colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  // };

  const refs = {
    files: useRef(null),
    btnLoadMore: useRef(null),
  };

  const { todoFormat, todoFormatShortCode } = useTimeFormat();
  const { getFileIcon } = useFileActions();
  const {
    generalSettings: { dark_mode },
  } = useSettings();
  const initLoading = () => {
    loadMore.files();
  };

  const redirect = useRedirect();

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
      redirect.toChat(todo.data.channel, todo.data.chat_message);
    } else {
      let post = {
        id: todo.link_id,
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

  useEffect(() => {
    if (!refs.files.current) return;

    let el = refs.files.current;
    if (el && el.dataset.loaded === "0") {
      initLoading();

      el.dataset.loaded = "1";
      refs.files.current.addEventListener("scroll", handleScroll, false);
    }
  }, [refs.files.current]);

  // const getTodoStatus = (todo) => {
  //   switch (todo.status) {
  //     case "OVERDUE":
  //       return dictionary.statusOverdue;
  //     case "TODAY":
  //       return dictionary.statusUpcomingToday;
  //     case "NEW":
  //       return dictionary.statusUpcoming;
  //     case "DONE":
  //       return dictionary.statusDone;
  //     default:
  //       return "";
  //   }
  // };

  const [activeTitles, setActiveTitles] = useState({});

  const handleTitleClick = (e) => {
    setActiveTitles({
      ...activeTitles,
      [e.target.id]: !activeTitles[e.target.id],
    });
  };

  const setTodoList = () => {
    return filter === "" ? ["To do", "Done"] : ["To do"];
  };

  const getTodoList = () => {
    return (
      <>
        {setTodoList().map((items, index) => {
          let x = items === "To do" ? todoItems : getDone;
          let reminder = x.map((todo, indexx) => {
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
                <h6 className=" mb-0 font-size-11 text-uppercase ml-1">
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
      <span className="d-none" ref={refs.btnLoadMore}>
        Load more
      </span>
      <div className="card-body app-lists" data-loaded={0} style={{ padding: "0px", overflow: "unset" }}>
        {!isLoaded ? (
          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
        ) : todoItems.length || getDone.length ? (
          getTodoList()
        ) : (
          <DivContainer>
            {filter === "" ? (
              <>
                <div style={{ "padding-left": "20px", "padding-right": "0px" }} W>
                  <h6 className="mt-3 mb-0 font-size-11 text-uppercase">
                    <SpanTitle className={"badge"}>
                      <SvgIconFeather icon="arrow-up" width={16} height={16} className="mr-1" />
                      To do
                    </SpanTitle>
                  </h6>
                </div>
                <EmptyState>
                  <h3>{dictionary.noItemsFoundHeader}</h3>
                  <h5>{dictionary.noItemsFoundText} </h5>
                </EmptyState>
              </>
            ) : (
              <>
                <div style={{ "padding-left": "20px", "padding-right": "0px" }} W>
                  <h6 className="mt-3 mb-0 font-size-11 text-uppercase">
                    <SpanTitle className={"badge"}>
                      <SvgIconFeather icon="arrow-up" width={16} height={16} className="mr-1" />
                      To do
                    </SpanTitle>
                  </h6>
                </div>
                <EmptyState>
                  <h3>{dictionary.noItemsFoundHeader}</h3>
                  <h5>{dictionary.noItemsFoundText} </h5>
                </EmptyState>
              </>
            )}
          </DivContainer>
        )}
      </div>
    </Wrapper>
  );
};
export default React.memo(TodosBody);
