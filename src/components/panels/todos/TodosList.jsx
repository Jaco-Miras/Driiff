import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, ToolTip } from "../../common";
import { TodoCheckBox } from "../../forms";
//import quillHelper from "../../../helpers/quillHelper";
import { setViewFiles } from "../../../redux/actions/fileActions";
import { useDispatch } from "react-redux";
import { SvgIconFeather } from "../../common";

const Icon = styled(SvgIconFeather)`
  width: 16px;
  cursor: pointer;
`;

const HoverButtons = styled.div`
  display: flex;
  > svg {
    width: 1rem;
    height: 1rem;
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
  .avatars-container {
    display: flex;
    align-items: center;
    min-width: 105px;
    justify-content: flex-end;
  }
  .workspace-label {
    text-align: right;
    cursor: pointer;
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
    .hover-btns {
      display: flex;
    }
    .more-options {
      display: inline-block;
    }
  }
  .reminder-date,
  .todo-type-badge,
  .todo-title-description {
    cursor: pointer;
  }
  .todo-title-description i {
    margin-right: 5px;
  }
  @media all and (max-width: 480px) {
    .reminder-content {
      flex-wrap: wrap;
    }
  }
`;

const ReminderDescription = styled.div`
  max-height: 50px;
  > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const DateWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LabelWrapper = styled.div`
  min-width: 142px;
  text-align: right;
`;

const TodosList = (props) => {
  const { todo, todoActions, handleLinkClick, dictionary, todoFormat, todoFormatShortCode, getFileIcon, showWsBadge, handleRedirectToWorkspace } = props;

  const dispatch = useDispatch();
  //const user = useSelector((state) => state.session.user);

  const [isDone, setIsDone] = useState(todo.status === "DONE");

  //const bodyDescription = quillHelper.parseEmoji(todo.description);

  const handlePreviewFile = (e, files, file) => {
    e.preventDefault();
    e.stopPropagation();
    const payload = {
      files: files.map((f) => {
        return {
          ...f,
          filename: f.name,
        };
      }),
      file_id: file.file_id,
    };
    dispatch(setViewFiles(payload));
  };

  const handleDoneClick = (e) => {
    setIsDone(!isDone);
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

  const showAssignedTo = (todo.assigned_to && todo.assigned_to.id !== todo.user) || (todo.workspace !== null && todo.assigned_to === null) || (todo.workspace === null && todo.assigned_to !== null);

  return (
    <>
      <ItemList className="reminder-list" isDone={isDone}>
        {todo.workspace && showWsBadge && (
          <div className="text-truncate false mt-2 workspace-label" onClick={(e) => handleRedirectToWorkspace(e, todo)}>
            <span className={"badge ml-4 badge-light border-0"}>{todo.workspace.name}</span>
          </div>
        )}
        <div className="d-flex align-items-center reminder-content">
          <span className="custom-control custom-checkbox mr-2">
            <ToolTip content={todo.status === "DONE" ? dictionary.actionMarkAsUndone : dictionary.actionMarkAsDone}>
              <TodoCheckBox checked={isDone} onClick={handleDoneClick} />
            </ToolTip>
          </span>
          <span className="align-items-center todo-title-description text-truncate mr-3" onClick={handleTitleClick}>
            <span className={`todo-title ${getTextColorClass(todo)}`}>{todo.title}</span>
            {todo.description && <ReminderDescription className="text-truncate" dangerouslySetInnerHTML={{ __html: todo.description }} />}
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

          <div className="d-flex align-items-center ml-auto">
            <DateWrapper>
              <Icon icon="calendar" />
              <ToolTip content={todo.remind_at ? todoFormat(todo.remind_at.timestamp) : dictionary.addDate}>
                <span className={`badge mr-3 reminder-date ${getTextColorClass(todo)}`} onClick={handleEdit}>
                  {todo.remind_at ? todoFormatShortCode(todo.remind_at.timestamp, "MM/DD/YYYY") : dictionary.addDate}
                </span>
              </ToolTip>
            </DateWrapper>
            <LabelWrapper>
              {todo.link_type !== null && (
                <span className={"badge mr-3 badge-light todo-type-badge"} onClick={handleTitleClick}>
                  {getTodoType(todo)}
                </span>
              )}
            </LabelWrapper>
            <div className="avatars-container">
              {todo.author !== null && (
                <Avatar name={todo.author.name} tooltipName={dictionary.reminderAuthor} imageLink={todo.author.profile_image_thumbnail_link ? todo.author.profile_image_thumbnail_link : todo.author.profile_image_link} id={todo.author.id} />
              )}
              {showAssignedTo && (
                <>
                  <Icon icon="chevron-right" />
                  <Avatar
                    name={todo.assigned_to ? todo.assigned_to.name : todo.workspace.name}
                    tooltipName={dictionary.reminderAssignedTo}
                    imageLink={todo.assigned_to ? todo.assigned_to.profile_image_link : todo.workspace ? todo.workspace.channel.icon_link : null}
                    id={todo.assigned_to ? todo.assigned_to.id : todo.workspace.id}
                    type={todo.assigned_to ? "USER" : "TOPIC"}
                    noDefaultClick={todo.assigned_to ? false : true}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </ItemList>
    </>
  );
};
export default TodosList;
