import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";
import {useTodos} from "../../hooks";

const Wrapper = styled.li`
  position: relative;
  transition: all 0.3s ease;

  > a {
    position: relative;
    font-weight: ${(props) => (props.selected ? "600" : "400")};
    height: 40px;
    display: flex;
    color: #fff;
    justify-content: flex-start;
    align-items: center;
    margin: 0 15px;
    border-radius: 8px 8px 0 0;
  }
  .sub-menu-arrow {
    margin-right: 10px;
  }
`;

const LinkNav = styled.ul`
  overflow: hidden;
  transition: all 0.3s ease;
  display: block !important;
  margin: 0 15px !important;
  border-radius: 0 0 8px 8px;

  li {
    height: 40px;
    width: 100%;
    padding: 0 10px;
    font-weight: 400;
    color: #cbd4db;
    background: #ffffff14;
    
    &.link-title {
      background: #ffffff30;
    }

    > div {
      position: relative;
      height: 40px;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;

      > div {
        display: flex;
      }

      a {
        background-color: transparent;
      }
    }

    .action {
      display: none;
      align-items: center;
    }

    &:hover {
      .action {
        display: flex;
      }
    }

    svg {
      height: 14px;
      width: 14px;
      margin-right: 4px;
    }
  }

  &.enter-active {
    max-height: ${(props) => props.maxHeight}px !important;
  }
  &.leave-active {
    max-height: 0;
  }
`;

const NavIcon = styled(SvgIconFeather)`
  cursor: pointer;
  margin: 0 8px 0 15px;
`;

const TodoLinks = (props) => {
  const {className = "", dictionary} = props;

  const {items: todos, action: todoActions} = useTodos();

  const ref = {
    container: useRef(),
    arrow: useRef(),
    nav: useRef(),
  };

  const [showLinks, setShowLinks] = useState(false);
  const [maxHeight, setMaxHeight] = useState(0);
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));

  const handleShowLinks = (e) => {
    e.preventDefault();
    setShowLinks((prevState) => !prevState);
  };

  const handleAddItemClick = () => {
    todoActions.createFromModal();
  };

  useEffect(() => {
    if (ref.nav.current !== null) {
      let maxHeight = window.innerHeight * 5;
      maxHeight = maxHeight < ref.nav.current.offsetHeight ? ref.nav.current.offsetHeight : maxHeight;
      setMaxHeight(maxHeight);
    }
  }, [ref.nav, maxHeight]);

  let todoItems = Object.values(todos);

  return (
    <Wrapper ref={ref.container} className={`fadeIn ${className} ${showLinks && "folder-open"}`} selected={showLinks}>
      <a href="/" onClick={handleShowLinks}>
        <NavIcon icon="bell"/>
        <div>{dictionary.todoLinks}</div>
        <i ref={ref.arrow} className={`sub-menu-arrow ti-angle-up ${showLinks ? "ti-minus rotate-in" : "ti-plus"}`}/>
      </a>

      <LinkNav ref={ref.nav} maxHeight={maxHeight} className={showLinks ? "enter-active" : "leave-active"}>
        {todoItems
          .sort((a, b) => {
            if (a.status !== b.status) {
              if (a.status === "DONE") {
                return 1;
              }

              if (b.status === "DONE") {
                return -1;
              }
            }

            return b.remind_at.timestamp - a.remind_at.timestamp;
          })
          .map((todo, index) => {
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
                  <li className="link-title">
                    <div><span>{chatHeader}</span></div>
                  </li>
                }
                <li key={index}>
                  <div>
                    <div>
                      <a href={`#`} target="_blank">
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
        <li className="nav-action cursor-pointer" onClick={handleAddItemClick}>
          <div>
            <span><SvgIconFeather icon="circle-plus" width={24} height={24}/> {dictionary.addTodoItem}</span>
          </div>
        </li>
      </LinkNav>
    </Wrapper>
  );
};

export default TodoLinks;
