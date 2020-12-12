import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, ToolTip } from "../../common";
import { TodoCheckBox } from "../../forms";
import quillHelper from "../../../helpers/quillHelper";
import { MoreOptions } from "../common";
import { setViewFiles } from "../../../redux/actions/fileActions";
import { useDispatch } from "react-redux";

const Wrapper = styled.ul``;

const TodosList = (props) => {
  const { className = "", chatHeader, todo, todoActions, handleLinkClick, dictionary, dark_mode, todoFormat, todoFormatShortCode, getFileIcon } = props;

  const dispatch = useDispatch();

  const [isDone, setIsDone] = useState(todo.status === "DONE");

  const handlePreviewFile = (e, files, file) => {
    e.preventDefault();
    e.stopPropagation();
    const payload = {
      files: files,
      file_id: file.file_id,
    };
    dispatch(setViewFiles(payload));
  };

  const handleDoneClick = (e) => {
    setIsDone(!isDone);
  };

  const getBadgeClass = (todo) => {
    if (todo.status === "OVERDUE") {
      return "badge-warning";
    }

    if (dark_mode === "1") {
      return "badge-dark";
    } else {
      return "badge-light";
    }
  };

  const getTodoType = (todo) => {
    switch (todo.link_type) {
      case "POST":
        return dictionary.typePost;
      case "CHAT":
        return dictionary.typeChat;
      case "POST_COMMENT":
        return dictionary.typePostComment;
    }
  };

  useEffect(() => {
    if (todo.status === "DONE" && !isDone) {
      todoActions.markUnDone(todo);
    } else if (todo.status !== "DONE" && isDone) {
      todoActions.markDone(todo);
    }
  }, [isDone]);

  return (
    <>
      {chatHeader !== "" && (
        <li className="list-group-item link-title">
          <div>
            <h6 className="mt-3 mb-0 font-size-11 text-uppercase">{chatHeader}</h6>
          </div>
        </li>
      )}
      <li className="pl-0 list-group-item">
        <a
          className={todo.status === "DONE" ? "text-success" : ""}
          href={todo.link}
          target="_blank"
          data-link={todo.link}
          onClick={(e) => {
            e.preventDefault();
            if (todo.link_type) handleLinkClick(e, todo);
            else todoActions.updateFromModal(todo);
          }}
        >
          <span className="d-flex justify-content-between w-100 align-items-center">
            <span className="d-inline-flex overflow-hidden mr-3">
              <span className="custom-control custom-checkbox custom-checkbox-success mr-2">
                <ToolTip content={todo.status === "DONE" ? dictionary.actionMarkAsUndone : dictionary.actionMarkAsDone}>
                  <TodoCheckBox name="test" checked={isDone} onClick={handleDoneClick} />
                </ToolTip>
              </span>
              <span className="mr-3 d-grid justify-content-center align-items-center">
                <span className="todo-title mr-2">{todo.title}</span>
                <span className="todo-title mr-2 description" dangerouslySetInnerHTML={{ __html: quillHelper.parseEmoji(todo.description) }} />
                {todo.files.map((file) => {
                  return (
                    <span key={file.id} onClick={(e) => handlePreviewFile(e, todo.files, file)}>
                      {getFileIcon(file.mime_type)}
                    </span>
                  );
                })}
              </span>
            </span>
            <span className="action d-inline-flex justify-content-center align-items-center">
              <span className="mr-3 align-items-center d-flex">
                {todo.link_type !== null && <span className={"badge badge-white badge-todo-type text-black mr-3"}>{getTodoType(todo)}</span>}
                {todo.remind_at && (
                  <ToolTip content={todoFormat(todo.remind_at.timestamp)}>
                    <span className={`badge ${getBadgeClass(todo)} text-white mr-3`}>{todoFormatShortCode(todo.remind_at.timestamp)}</span>
                  </ToolTip>
                )}
                {todo.author !== null && (
                  <Avatar key={todo.author.id} name={todo.author.name} imageLink={todo.author.profile_image_thumbnail_link ? todo.author.profile_image_thumbnail_link : todo.author.profile_image_link} id={todo.author.id} />
                )}
              </span>
              <MoreOptions className="ml-2" item={todo} width={170} moreButton={"more-horizontal"}>
                <div onClick={() => todoActions.updateFromModal(todo)}>{dictionary.actionEdit}</div>
                <div onClick={() => todoActions.removeConfirmation(todo)}>{dictionary.actionRemove}</div>
              </MoreOptions>
            </span>
          </span>
        </a>
      </li>
    </>
  );
};

export default TodosList;
