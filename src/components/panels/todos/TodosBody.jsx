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
flex: unset !important;
height: auto !important;
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
background:transparent;
.list-group-item:last-child {
  border-bottom: none;
}
`;

const EmptyState = styled.div`
margin: 0;
position: absolute;
top: 50%;
width: 100%;
text-align:center;
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


const Icon = styled(SvgIconFeather)`
  width: 16px;
`;

const DivContainer = styled.div`
padding-top:15px;
padding-bottom:15px;
:first-of-type {padding-bottom:10px;}
:nth-child(even) {background: #F8F9FA}
:nth-child(odd) {background: transparent}
border-bottom: 1px solid #ebebeb;
:last-of-type { border: none;}

`;
const TodosBody = (props) => {
  const { className = "", dictionary, filter, isLoaded, loadMore, todoActions, todoItems, getDone } = props;

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

  const [activeTitles, setActiveTitles] = useState({});

  const handleTitleClick = (e) => {
    setActiveTitles({
      ...activeTitles,
      [e.target.id]: !activeTitles[e.target.id]
    });
  };

  return (
    <Wrapper className={`todos-body card app-content-body mb-4 ${className}`} active={todoItems.length ? false : true}>
      <span className="d-none" ref={refs.btnLoadMore}>
        Load more
      </span>
      <div className="card-body app-lists" data-loaded={0} style={{ 'padding': '0px' }}>
        {!isLoaded ? (
          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
        ) : todoItems.length ? (
          <DivContainer >
            <div style={{ 'padding-left': '20px', 'padding-right': '0px' }} >
              <h6 className="mt-3 mb-0 font-size-11 text-uppercase">
                <span className={`badge`} style={{ 'font-weight': '700', 'cursor': 'pointer', 'background': '#F8F9FA' }} onClick={handleTitleClick} onClick={handleTitleClick} id={'ttodo'}>
                  <SvgIconFeather icon={activeTitles['ttodo'] ? "arrow-down" : "arrow-up"} width={16} height={16} className="mr-1" />
                To do
              </span>
              </h6>
            </div>
            <ListGroup
              className="list-group  ui-sortable fadeIn" style={activeTitles['ttodo'] ? { 'display': 'none' } : { 'display': 'block' }}>
              {todoItems.map((rec, i) => {
                return (
                  <TodosList
                    key={rec.id}
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
        ) : (
          <DivContainer >

            {filter === "" ? (
              <>
                <div style={{ 'padding-left': '20px', 'padding-right': '0px' }} W>
                  <h6 className="mt-3 mb-0 font-size-11 text-uppercase">
                    <span className={`badge`} style={{ 'font-weight': '700', 'cursor': 'pointer', 'background': '#F8F9FA' }}>
                      <SvgIconFeather icon="arrow-up" width={16} height={16} className="mr-1" />To do
                    </span>
                  </h6>
                </div>
                <EmptyState>
                  <SvgEmptyState icon={1} height={282} />
                  <h5>{dictionary.emptyText}</h5>
                  <button onClick={() => todoActions.createFromModal()} className="btn btn-primary">
                    {dictionary.emptyButtonText}
                  </button>
                </EmptyState>
              </>
            ) : (
              <>
                <div style={{ 'padding-left': '20px', 'padding-right': '0px' }} W>
                  <h6 className="mt-3 mb-0 font-size-11 text-uppercase">
                    <span className={`badge`} style={{ 'font-weight': '700', 'cursor': 'pointer', 'background': '#F8F9FA' }}>
                      <SvgIconFeather icon="arrow-up" width={16} height={16} className="mr-1" />To do
                    </span>
                  </h6>
                </div>
                <EmptyState>
                  <h3>{dictionary.noItemsFoundHeader}</h3>
                  <h5>{dictionary.noItemsFoundText} </h5>
                </EmptyState>
              </>
            )}
          </DivContainer >

        )}
        {getDone.length > 0 && (
          <DivContainer >
            <div style={{ 'padding-left': '20px', 'padding-right': '0px' }} >
              <h6 className="mt-3 mb-0 font-size-11 text-uppercase">
                <span className={`badge`} style={{ 'font-weight': '700', 'cursor': 'pointer', 'background': '#F8F9FA' }} onClick={handleTitleClick} id={'tdone'}>
                  <SvgIconFeather icon={activeTitles['tdone'] ? "arrow-down" : "arrow-up"} width={16} height={16} className="mr-1" />
                  Done
                </span>
              </h6>
            </div>
            <ListGroup
              className="list-group  ui-sortable fadeIn" style={activeTitles['tdone'] ? { 'display': 'none' } : { 'display': 'block' }}>
              {getDone.map((rec, i) => {
                return (
                  <TodosList
                    key={rec.id}
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
      </div>
    </Wrapper>
  );
};
export default React.memo(TodosBody);