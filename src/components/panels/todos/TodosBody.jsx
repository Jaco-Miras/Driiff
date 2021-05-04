import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SvgEmptyState } from "../../common";
//import { useHistory } from "react-router-dom";
import { useFileActions, useSettings, useTimeFormat, useRedirect } from "../../hooks";
// import { getChatMessages, setLastVisitedChannel } from "../../../redux/actions/chatActions";
// import { useDispatch, useSelector } from "react-redux";
import { TodosList } from "./index";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
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

const ListGroup = styled.ul`
background:transparent;

.list-group-item:last-child {
  border-bottom: none;
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

  h3 {
    font-size: 16px;
  }
  h5 {
    margin-top: 2rem;
    margin-bottom: 0;
    font-size: 14px;
  }

  button {
    width: auto !important;
    margin: 2rem auto;
  }
`;


const Icon = styled(SvgIconFeather)`
  width: 16px;
`;

const DivContainer = styled.div`
padding-top:15px;
padding-bottom:15px;
:first-of-type {padding-top:10px;padding-bottom:10px;}
:nth-child(even) {background: #F8F9FA}
:nth-child(odd) {background: transparent}
border-bottom: 1px solid #ebebeb;
:last-of-type { border: none;}

`;

/*
:last-of-type .list-group .list-group-item:last-child{
  border-bottom-width: 0px !important;
}*/


const TodosBody = (props) => {
  const { className = "", dictionary, filter, isLoaded, loadMore, groupedTodoItems, todoActions, todoItems, recent } = props;

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

  const getTodoStatus = (todo) => {
    switch (todo.status) {
      case "OVERDUE":
        return dictionary.statusOverdue;
      case "TODAY":
        return dictionary.statusUpcomingToday;
      case "NEW":
        return dictionary.statusUpcoming;
      case "DONE":
        return dictionary.statusDone;
      default:
        return "";
    }
  };

  const Stats = ["REC", "OVERDUE", "TODAY", "NEW", "DONE"];

  const [activeTitles, setActiveTitles] = useState({});

  const handleTitleClick = (e) => {
    setActiveTitles({
      ...activeTitles,
      [e.target.id]: !activeTitles[e.target.id]
    });
  };
  // const Stats = ["OVERDUE", "TODAY", "NEW", "DONE"];

  const setTodo = () => {
    return (
      <>
        {Stats.map((item, it) => {
          let chatHeader = "";
          let items = groupedTodoItems.get(item);
          let x = (typeof items !== 'undefined') ?
            items.map((todo, index) => {
              let chatHeader = "";
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
            }) : [];
          return ((typeof items !== 'undefined') ? (
            <DivContainer>
              <div style={{ 'padding-left': '20px', 'padding-right': '0px' }} >
                <h6 className=" mb-0 font-size-11 text-uppercase">
                  <spanTitle className={`badge badge-light`} style={{ 'font-weight': '700', 'cursor': 'pointer','background': '#F8F9FA' }} onClick={handleTitleClick} id={'t_' + item}>
                    <SvgIconFeather icon={activeTitles['t_' + item] ? "arrow-down" : "arrow-up"} width={16} height={16} className="mr-1" />
                    {item}
                  </spanTitle>
                </h6>
              </div><ListGroup className="list-group list-group-flush ui-sortable fadeIn" style={activeTitles['t_' + item] ? { 'display': 'none' } : { 'display': 'block' }} >{x}</ListGroup></DivContainer>) : <></>)
        })}
      </>
    )
  };

  return (
    <Wrapper className={`todos-body card app-content-body ${className}`}>
      <span className="d-none" ref={refs.btnLoadMore}>
        Load more
      </span>
      <div className="card-body app-lists" data-loaded={0} style={{ 'padding': '0px' }}>
        {recent.length > 0 && filter === "" && (
          <DivContainer >
            <div style={{ 'padding-left': '20px', 'padding-right': '0px' }} >
              <h6 className="mt-3 mb-0 font-size-11 text-uppercase">
                <spanTitle className={`badge`} style={{ 'font-weight': '700', 'cursor': 'pointer','background': '#F8F9FA' }} onClick={handleTitleClick} id={'t_REC'}>
                  <SvgIconFeather icon={activeTitles['t_REC'] ? "arrow-down" : "arrow-up"} width={16} height={16} className="mr-1" />
                  Recently done
                </spanTitle>
              </h6>
            </div>
            <ListGroup
              className="list-group  ui-sortable fadeIn" style={activeTitles['t_REC'] ? { 'display': 'none' } : { 'display': 'block' }}>
              {recent.slice(0, 5).map((rec, i) => {
                return (
                  <TodosList
                    key={rec.id}
                    chatHeader={""}
                    todo={rec}
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
            </ListGroup>
          </DivContainer >
        )}
        {!isLoaded ? (
          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
        ) : todoItems.length ? (
          setTodo()
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
                <h3>{dictionary.noItemsFoundHeader}</h3>
                <h5>{dictionary.noItemsFoundText}  <Icon icon="ghost" /></h5>
              </EmptyState>
            )}
          </>
        )}
      </div>
    </Wrapper>
  );
};
export default React.memo(TodosBody);