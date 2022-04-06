import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Avatar, ToolTip } from "../../common";
import { TodoCheckBox } from "../../forms";
//import quillHelper from "../../../helpers/quillHelper";
import { setViewFiles, incomingFileData } from "../../../redux/actions/fileActions";
import { useDispatch, useSelector } from "react-redux";
import { SvgIconFeather } from "../../common";
import { sessionService } from "redux-react-session";

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
    .avatars-container {
      min-width: 40px;
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
  min-width: 130px;
`;

const LabelWrapper = styled.div`
  min-width: 142px;
  text-align: right;
  @media all and (max-width: 480px) {
    min-width: 70px;
  }
`;

const RightSectionWrapper = styled.div`
  @media all and (max-width: 480px) {
    flex-flow: row wrap;
  }
`;

const TodosList = (props) => {
  const { todo, todoActions, handleLinkClick, dictionary, todoFormat, todoFormatShortCode, getFileIcon, showWsBadge, handleRedirectToWorkspace } = props;

  const dispatch = useDispatch();
  //const user = useSelector((state) => state.session.user);

  const [isDone, setIsDone] = useState(todo.status === "DONE");

  //const bodyDescription = quillHelper.parseEmoji(todo.description);

  const fileBlobs = useSelector((state) => state.files.fileBlobs);

  const descriptionRef = useRef(null);

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
      // if (todoFormatShortCode(todo.remind_at.timestamp) === "Yesterday") return "text-warning";
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
    if (descriptionRef.current) {
      const images = descriptionRef.current.querySelectorAll("img");
      images.forEach((img) => {
        const imgSrc = img.getAttribute("src");
        if (!img.classList.contains("has-listener")) {
          img.classList.add("has-listener");
          const imgFile = todo.files.find((f) => imgSrc.includes(f.code));
          if (imgFile && fileBlobs[imgFile.id]) {
            img.setAttribute("src", fileBlobs[imgFile.id]);
            img.setAttribute("data-id", imgFile.id);
          }
        } else {
          const imgFile = todo.files.find((f) => imgSrc.includes(f.code));
          if (imgFile && fileBlobs[imgFile.id]) {
            img.setAttribute("src", fileBlobs[imgFile.id]);
            img.setAttribute("data-id", imgFile.id);
          }
        }
      });
    }
    const setFileSrc = (payload, callback = () => {}) => {
      dispatch(incomingFileData(payload, callback));
    };
    const imageFiles = todo.files.filter((f) => f.type && f.type.includes("image"));
    if (imageFiles.length) {
      imageFiles.forEach((file) => {
        if (!fileBlobs[file.id]) {
          sessionService.loadSession().then((current) => {
            let myToken = current.token;
            fetch(file.view_link, {
              method: "GET",
              keepalive: true,
              headers: {
                Authorization: myToken,
                "Access-Control-Allow-Origin": "*",
                Connection: "keep-alive",
                crossorigin: true,
              },
            })
              .then(function (response) {
                return response.blob();
              })
              .then(function (data) {
                const imgObj = URL.createObjectURL(data);
                setFileSrc({
                  id: file.id,
                  src: imgObj,
                });
              })
              .catch((error) => {
                console.log(error, "error fetching image");
              });
          });
        }
      });
    }
  }, [todo.files, todo.description, descriptionRef]);

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

  const showAssignedTo =
    (todo.assigned_to && todo.assigned_to.id !== todo.user) ||
    (todo.workspace !== null && todo.assigned_to === null) ||
    (todo.workspace === null && todo.assigned_to !== null && todo.assigned_to.id !== todo.user) ||
    (todo.assigned_to && todo.author && todo.assigned_to.id !== todo.author.id);

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
          <span className={`align-items-center todo-title-description text-truncate mr-3 ${isDone && "text-muted"}`} onClick={handleTitleClick}>
            <span className={"todo-title"}>{todo.title}</span>
            {todo.description && !isDone && <ReminderDescription ref={descriptionRef} className="text-truncate" dangerouslySetInnerHTML={{ __html: todo.description }} />}
            {!isDone &&
              todo.files.map((file) => {
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

          <RightSectionWrapper className="d-flex align-items-center ml-auto">
            <DateWrapper className={`${isDone && "text-muted"}`}>
              <Icon icon="calendar" />
              <ToolTip content={todo.remind_at ? todoFormat(todo.remind_at.timestamp) : dictionary.addDate}>
                <span className={`badge mr-3 reminder-date ${getTextColorClass(todo)}`} onClick={handleEdit}>
                  {todo.remind_at ? todoFormatShortCode(todo.remind_at.timestamp, "MM/DD/YYYY") : dictionary.addDate}
                </span>
              </ToolTip>
            </DateWrapper>
            <LabelWrapper>
              {todo.link_type !== null && (
                <span className={`badge mr-3 badge-light todo-type-badge ${isDone && "text-muted"}`} onClick={handleTitleClick}>
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
                    imageLink={todo.assigned_to ? todo.assigned_to.profile_image_link : todo.workspace && todo.workspace.team_channel ? todo.workspace.team_channel.icon_link : null}
                    id={todo.assigned_to ? todo.assigned_to.id : todo.workspace.id}
                    type={todo.assigned_to ? "USER" : "TOPIC"}
                    noDefaultClick={todo.assigned_to ? false : true}
                  />
                </>
              )}
            </div>
          </RightSectionWrapper>
        </div>
      </ItemList>
    </>
  );
};
export default TodosList;
