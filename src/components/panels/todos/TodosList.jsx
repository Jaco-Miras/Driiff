import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, ToolTip } from "../../common";
import { TodoCheckBox } from "../../forms";
//import quillHelper from "../../../helpers/quillHelper";
//import { MoreOptions } from "../common";
import { setViewFiles } from "../../../redux/actions/fileActions";
import { useDispatch } from "react-redux";
import { SvgIconFeather } from "../../common";

// const Description = styled.span`
//   * {
//     display: inline-block;
//   }
// `;

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
  &.reminder-list {
    background: transparent;
    font-size: 13px;
    padding: 5px 20px;
    margin-top: 0;
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom: 1px solid #ebebeb;
    .dark & {
      border-color: rgba(155, 155, 155, 0.1);
    }
  }
  .todo-title {
    text-decoration: ${(props) => (props.isDone ? "line-through" : "none")};
    cursor: pointer;
  }
  .badge.badge-light {
    background: #efefef;
    color: #828282;
    .dark & {
      background: rgb(175, 184, 189, 0.2) !important;
      color: #fff;
    }
  }
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
  .reminder-date,
  .todo-type-badge,
  .todo-title-description {
    cursor: pointer;
  }
`;

const TodosList = (props) => {
  const { todo, todoActions, handleLinkClick, dictionary, dark_mode, todoFormat, todoFormatShortCode, getFileIcon, showWsBadge } = props;

  const dispatch = useDispatch();

  const [isDone, setIsDone] = useState(todo.status === "DONE");

  //const bodyDescription = quillHelper.parseEmoji(todo.description);

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

  const getTextDarkModeClass = () => {
    return dark_mode === "1" && "text-light";
  };

  const getTextColorClass = (todo) => {
    if (todo.status === "OVERDUE") {
      if (todoFormatShortCode(todo.remind_at.timestamp) === "Yesterday") return "text-warning";
      return "text-danger";
    }

    if (todo.status === "TODAY") {
      if (todo.remind_at === null) return "text-default";
      return "text-success";
    }
    if (todo.status === "NEW") {
      return "text-default";
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

  // const handleRemoveClick = (e) => {
  //   setIsDone(!isDone);
  // };

  // const handleEditClick = (e) => {
  //   setIsDone(!isDone);
  // };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    todoActions.updateFromModal(todo);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    todoActions.removeConfirmation(todo);
  };

  const handleTitleClick = (e) => {
    e.preventDefault();
    if (todo.link_type) handleLinkClick(e, todo);
    else todoActions.updateFromModal(todo);
  };

  return (
    <>
      <ItemList className="pl-0 reminder-list" isDone={isDone}>
        {/* <a
          // href={todo.link}
          href="#"
          target="_blank"
          data-link={todo.link}
          onClick={(e) => {
            e.preventDefault();
            if (todo.link_type) handleLinkClick(e, todo);
            else todoActions.updateFromModal(todo);
          }}
        > */}
        {todo.workspace && showWsBadge && (
          <div className="text-truncate false mt-2">
            <span className={"badge ml-4 badge-light border-0"}>{todo.workspace.name}</span>
          </div>
        )}
        <span className="d-flex justify-content-between w-100 align-items-center">
          <span className="d-inline-flex overflow-hidden w-100 align-items-center mr-3">
            <span className="custom-control custom-checkbox mr-2">
              <ToolTip content={todo.status === "DONE" ? dictionary.actionMarkAsUndone : dictionary.actionMarkAsDone}>
                <TodoCheckBox checked={isDone} onClick={handleDoneClick} />
              </ToolTip>
            </span>
            <span className="mr-3 d-grid justify-content-center align-items-center todo-title-description" onClick={handleTitleClick}>
              <span className={`todo-title mr-2 ${getTextColorClass(todo)} ${getTextDarkModeClass()}`}>{todo.title}</span>
              {(todo.link_type === "CHAT" || todo.link_type === "POST_COMMENT") && todo.data && <span dangerouslySetInnerHTML={{ __html: todo.description }} />}
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
              <ToolTip content={todo.remind_at ? todoFormat(todo.remind_at.timestamp) : dictionary.addDate}>
                <span className={`badge mr-3 reminder-date ${getTextColorClass(todo)} ${getTextDarkModeClass()}`} onClick={handleEdit}>
                  {todo.remind_at ? todoFormatShortCode(todo.remind_at.timestamp, "MM/DD/YYYY") : dictionary.addDate}
                </span>
              </ToolTip>
              {todo.link_type !== null && (
                <span className={"badge mr-3 badge-light todo-type-badge"} onClick={handleTitleClick}>
                  {getTodoType(todo)}
                </span>
              )}
              {todo.author !== null && (
                <Avatar name={todo.author.name} tooltipName={dictionary.reminderAuthor} imageLink={todo.author.profile_image_thumbnail_link ? todo.author.profile_image_thumbnail_link : todo.author.profile_image_link} id={todo.author.id} />
              )}
              {todo.assigned_to && (
                <>
                  <Icon icon="chevron-right" />
                  <Avatar
                    name={todo.assigned_to.id === todo.author.id && todo.workspace ? todo.workspace.name : todo.assigned_to.name}
                    tooltipName={dictionary.reminderAssignedTo}
                    imageLink={
                      todo.assigned_to.id === todo.author.id && todo.workspace
                        ? todo.workspace.channel.icon_link
                        : todo.assigned_to.profile_image_thumbnail_link
                        ? todo.assigned_to.profile_image_thumbnail_link
                        : todo.assigned_to.profile_image_link
                    }
                    id={todo.assigned_to.id === todo.author.id && todo.workspace ? todo.workspace.id : todo.assigned_to.id}
                    type={todo.workspace ? "TOPIC" : "USER"}
                    noDefaultClick={todo.workspace ? true : false}
                  />
                </>
              )}
            </span>
          </span>
        </span>
        {/* </a> */}
      </ItemList>
    </>
  );
};
export default TodosList;
