import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {Avatar, SvgIconFeather, ToolTip} from "../../common";
import {useHistory} from "react-router-dom";
import {CheckBox} from "../../forms";
import quillHelper from "../../../helpers/quillHelper";
import {useTimeFormat} from "../../hooks";

const Wrapper = styled.div`
`;

const Icon = styled(SvgIconFeather)`
  width: 16px;
`;

const TodosBody = (props) => {
  const {
    className = "",
    getSortedItems,
    loadMore,
    todoActions,
    todoItems
  } = props;

  const refs = {
    files: useRef(null),
    btnLoadMore: useRef(null),
  }

  const history = useHistory();
  const { timestamp, setTimestamp } = useState(Math.floor(Date.now() / 1000));
  const {localizeDate} = useTimeFormat();
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
        <ul className="list-group list-group-flush ui-sortable fadeIn">
          {
            todoItems.map((todo, index) => {
              let chatHeader = "";
              if (index === 0) {
                switch (todo.status) {
                  case "OVERDUE": {
                    chatHeader = "Overdue";
                    break;
                  }
                  case "NEW": {
                    chatHeader = "Upcoming";
                    break;
                  }
                  case "DONE": {
                    chatHeader = "Done";
                    break;
                  }
                }
              } else {
                let prevTodo = todoItems[index - 1];
                if (prevTodo.status !== todo.status) {
                  switch (todo.status) {
                    case "OVERDUE": {
                      chatHeader = "Overdue";
                      break;
                    }
                    case "NEW": {
                      chatHeader = "Upcoming";
                      break;
                    }
                    case "DONE": {
                      chatHeader = "Done";
                      break;
                    }
                  }
                }
              }

              console.log(todo)

              return (
                <>
                  {
                    chatHeader !== "" &&
                    <li key={`${index}.1`} className="list-group-item link-title">
                      <div><h6 className="mt-3 mb-0 font-size-11 text-uppercase">{chatHeader}</h6></div>
                    </li>
                  }
                  <li className="pl-0 list-group-item" key={index}>
                    <div className="d-flex justify-content-between w-100 align-items-center">
                      <div className="d-flex">
                        <div className="custom-control custom-checkbox custom-checkbox-success mr-2">
                          <CheckBox name="test" checked={todo.status === "DONE"} onClick={() => {
                            if (todo.status !== "DONE") todoActions.markDone(todo)
                          }} disabled={todo.status === "DONE"}/>
                        </div>
                        <div className="mr-3">
                          <a href={todo.link} target="_blank" data-link={todo.link} onClick={handleLinkClick}>
                            <span className="todo-title">{todo.title}</span>
                          </a>
                        </div>
                        <div>
                          <span className="todo-title" dangerouslySetInnerHTML={{__html:  quillHelper.parseEmoji( todo.description )}}/>
                        </div>
                      </div>
                      <div className="action d-flex justify-content-center align-items-center">
                        <div className="mr-3 align-items-center d-flex">
                        <div className={`badge badge-dark text-white mr-3`}>{localizeDate(todo.remind_at ? todo.remind_at.timestamp : "")}</div>
                        {
                          todo.author !== null &&
                          <Avatar key={todo.author.id} name={todo.author.name}
                                  imageLink={todo.author.profile_image_link} id={todo.author.id}/>
                        }
                        </div>
                        <Icon
                          className="cursor-pointer mr-2" data-index={index} icon="archive"
                          onClick={() => todoActions.remove(todo)}/>
                        <ToolTip content="Reschedule">
                          <Icon
                            className="cursor-pointer" data-index={index} icon="clock"
                            onClick={() => todoActions.updateFromModal(todo)}/>
                        </ToolTip>
                      </div>
                    </div>
                  </li>
                </>
              );
            })}
        </ul>
      </div>
    </Wrapper>
  );
};

export default React.memo(TodosBody);
