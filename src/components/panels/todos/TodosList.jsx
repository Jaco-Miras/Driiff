import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, ToolTip } from "../../common";
import { TodoCheckBox } from "../../forms";
import quillHelper from "../../../helpers/quillHelper";
import { MoreOptions } from "../common";
import { setViewFiles } from "../../../redux/actions/fileActions";
import { useDispatch } from "react-redux";
import { SvgIconFeather } from "../../common";

const Description = styled.span`
  * {
    display: inline-block;
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 16px;
`;

const HoverButtons = styled.div`
  display: inline-block;
  > svg {
    width: 0.9rem;
    height: 0.9rem;
  }
  .feather-pencil {
    margin-right: 5px;
  }
`;

const ItemList = styled.li`
background: transparent;
font-size:13px;
padding:0;
.hover-btns {
  display: none;
  margin-right: 0.5rem;
}
&:hover {
  .more-options,
  .hover-btns {
    display: inline-block;
  }
}
:
`;

const TodosList = (props) => {
  const { chatHeader, todo, todoActions, handleLinkClick, dictionary, dark_mode, todoFormat, todoFormatShortCode, getFileIcon } = props;

  const dispatch = useDispatch();

  const [isDone, setIsDone] = useState(todo.status === "DONE");

  const bodyDescription = quillHelper.parseEmoji(todo.description);

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
      if (todoFormatShortCode(todo.remind_at.timestamp) === 'Yesterday')
        return "text-warning";
      return "text-danger";
    }

    if (todo.status === "TODAY") {
      if (todo.remind_at === null)
        return "text-default";
      return "text-success";
    }
    if (todo.status === "NEW") {
      return "text-default";
    }

    if (dark_mode === "1") {
      return "text-dark";
    } else {
      return "text-light";
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
      default:
        return null;
    }
  };

  useEffect(() => {
    if (todo.status === "DONE" && !isDone) {
      todoActions.markUnDone(todo);
    } else if (todo.status !== "DONE" && isDone) {
      todoActions.markDone(todo);
    }
  }, [isDone]);

  const handleRemoveClick = (e) => {
    setIsDone(!isDone);
  };

  const handleEditClick = (e) => {
    setIsDone(!isDone);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    todoActions.updateFromModal(todo)
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    todoActions.removeConfirmation(todo)
  };

  return (
    <>
      <ItemList className="pl-0 list-group-item" style={{ 'padding': '5px 20px', 'margin-top': '0px', 'border-radius': '0px', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none' }}>
        <a
          // href={todo.link}
          href="#"
          target="_blank"
          data-link={todo.link}
          onClick={(e) => {
            e.preventDefault();
            if (todo.link_type) handleLinkClick(e, todo);
            else todoActions.updateFromModal(todo);
          }}
        >
          <span className="d-flex justify-content-between w-100 align-items-center">
            <span className="d-inline-flex overflow-hidden w-100 mr-3">
              <span className="custom-control custom-checkbox custom-checkbox-warning mr-2">
                <ToolTip content={todo.status === "DONE" ? dictionary.actionMarkAsUndone : dictionary.actionMarkAsDone}>
                  <TodoCheckBox name="test" checked={isDone} onClick={handleDoneClick} />
                </ToolTip>
              </span>
              <span className="mr-3 d-grid justify-content-center align-items-center">
                <span className="todo-title mr-2" style={isDone ? { 'text-decoration': 'line-through' } : { 'text-decoration': 'none' }}>{todo.title}</span>
                {todo.files.map((file) => {
                  return (
                    <span key={`${todo.id}${file.file_id}`} onClick={(e) => handlePreviewFile(e, todo.files, file)}>
                      {getFileIcon(file.mime_type)}
                    </span>
                  );
                })}
              </span>
              <HoverButtons className="hover-btns ml-1">
                <Icon icon="pencil" onClick={handleEdit} />
                <Icon icon="trash" onClick={handleRemove} />
              </HoverButtons>
            </span>
            <span className="action d-inline-flex justify-content-center align-items-center">
              <span className="mr-3 align-items-center d-flex">
                <Icon icon="calendar" />
                <ToolTip content={todo.remind_at ? todoFormat(todo.remind_at.timestamp) : 'Add Date'}>
                  <span className={`badge ${getBadgeClass(todo)} mr-3`}>{todo.remind_at ? todoFormatShortCode(todo.remind_at.timestamp,'MM/DD/YYYY') : 'Add Date'}</span>
                </ToolTip>
                {todo.link_type !== null && <span className={"badge mr-3"} style={{ 'background': 'rgb(248, 249, 250)' }}>{getTodoType(todo)}</span>}
                {todo.author !== null && (
                  <Avatar key={todo.author.id} name={todo.author.name} imageLink={todo.author.profile_image_thumbnail_link ? todo.author.profile_image_thumbnail_link : todo.author.profile_image_link} id={todo.author.id} />
                )}
              </span>
            </span>
          </span>
        </a>
      </ItemList>
    </>
  );
};
export default TodosList;