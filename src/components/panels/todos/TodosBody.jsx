import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";
import {useHistory} from "react-router-dom";

const Wrapper = styled.div`
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
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
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
                if (timestamp > todo.remind_at.timestamp) {
                  chatHeader = "Overdue"
                }
                if (timestamp <= todo.remind_at.timestamp) {
                  chatHeader = "Upcoming"
                }
                if (todo.status === "DONE") {
                  chatHeader = "Done"
                }
              } else {
                let prevTodo = todoItems[index - 1];
                if (timestamp > prevTodo && timestamp <= todo.remind_at.timestamp) {
                  chatHeader = "Upcoming"
                }
                if (prevTodo.status !== "DONE" && todo.status === "DONE")
                  chatHeader = "Done"
              }

              return (
                <>
                  {
                    chatHeader !== "" &&
                    <li key={`${index}.1`} className="list-group-item link-title bg-primary">
                      <div><span>{chatHeader}</span></div>
                    </li>
                  }
                  <li className="list-group-item" key={index}>
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <a href={todo.link} target="_blank" data-link={todo.link} onClick={handleLinkClick}>
                          {todo.title}
                        </a>
                      </div>
                      <div className="action">
                        <SvgIconFeather
                          className="cursor-pointer mr-2" data-index={index} icon="x"
                          onClick={() => todoActions.remove(todo)}/>
                        {
                          todo.status !== "DONE" &&
                          <SvgIconFeather
                            className="cursor-pointer mr-2" data-index={index} icon="check"
                            onClick={() => todoActions.markDone(todo)}/>
                        }
                        <SvgIconFeather
                          className="cursor-pointer" data-index={index} icon="pencil"
                          onClick={() => todoActions.updateFromModal(todo)}/>
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
