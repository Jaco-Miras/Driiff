import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getWorkspaceRemindersCount, updateWorkspaceRemindersCount } from "../../../redux/actions/workspaceActions";
import { replaceChar } from "../../../helpers/stringFormatter";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    margin: 0;
  }
  .text-label {
    width: 65%;
  }
  span:last-child {
    width: 35%;
    text-align: center;
    color: ${(props) => (props.count === 0 ? "green" : "inherit")};
    font-size: 1.75rem;
    border-left: 1px solid rgba(0, 0, 0, 0.125);
    cursor: pointer;
  }
`;

const CountCard = (props) => {
  const { type, text, isWorkspace = false, workspace } = props;
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();
  const unreadCounter = useSelector((state) => state.global.unreadCounter);
  const todosCount = useSelector((state) => state.global.todos.count);
  const wsReminders = useSelector((state) => state.workspaces.workspaceReminders[params.workspaceId]);

  useEffect(() => {
    if (params.workspaceId && !wsReminders) {
      //fetch the workspace reminders count
      dispatch(
        getWorkspaceRemindersCount({ topic_id: params.workspaceId }, (err, res) => {
          if (err) return;
          dispatch(updateWorkspaceRemindersCount({ count: res.data, id: parseInt(params.workspaceId) }));
        })
      );
    }
  }, []);

  const handleRedirect = () => {
    if (isWorkspace) {
      if (!workspace) return;
      if (type === "chat") {
        if (workspace.folder_id) {
          history.push(`/workspace/chat/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
        } else {
          history.push(`/workspace/chat/${workspace.id}/${replaceChar(workspace.name)}`);
        }
      } else if (type === "posts") {
        if (workspace.folder_id) {
          history.push(`/workspace/posts/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
        } else {
          history.push(`/workspace/posts/${workspace.id}/${replaceChar(workspace.name)}`);
        }
      } else {
        if (workspace.folder_id) {
          history.push(`/workspace/reminders/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
        } else {
          history.push(`/workspace/reminders/${workspace.id}/${replaceChar(workspace.name)}`);
        }
      }
    } else {
      if (type === "chat") {
        history.push("/chat");
      } else if (type === "posts") {
        history.push("/posts");
      } else {
        history.push("/todos");
      }
    }
  };

  let count = 0;
  if (isWorkspace) {
    if (type === "chat") {
      count = workspace.unread_chats;
    } else if (type === "posts") {
      count = workspace.unread_posts;
    } else {
      count = wsReminders && wsReminders.count.today ? wsReminders.count.today : 0;
    }
  } else {
    if (type === "chat") {
      count = unreadCounter.chat_message;
    } else if (type === "posts") {
      count = unreadCounter.general_post;
    } else {
      count = todosCount.todo_with_date;
    }
  }

  return (
    <Wrapper count={count}>
      <span className="text-label">
        <h5 className="card-title mb-0">{text}</h5>
      </span>
      <span onClick={handleRedirect}>{count}</span>
    </Wrapper>
  );
};

export default CountCard;
