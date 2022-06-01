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
  const workspaceReminders = useSelector((state) => state.workspaces.workspaceReminders);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const onSharedWsURL = history.location.pathname.startsWith("/shared-workspace");
  const wsKey = workspace && onSharedWsURL ? workspace.key : params.workspaceId;
  const wsReminders = workspaceReminders[workspace && onSharedWsURL ? workspace.key : params.workspaceId];

  useEffect(() => {
    if (history.location.pathname.startsWith("/shared-workspace")) {
      if (params.workspaceId && workspace && !workspaceReminders[workspace.key]) {
        //fetch the workspace reminders count
        let payload = {
          topic_id: params.workspaceId,
        };
        if (workspace && workspace.sharedSlug && sharedWs[workspace.slug]) {
          payload = {
            ...payload,
            sharedPayload: { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true },
          };
        }
        dispatch(
          getWorkspaceRemindersCount(payload, (err, res) => {
            if (err) return;
            dispatch(updateWorkspaceRemindersCount({ count: res.data, id: wsKey }));
          })
        );
      }
    } else {
      if (params.workspaceId && !workspaceReminders[params.workspaceId]) {
        //fetch the workspace reminders count
        let payload = {
          topic_id: params.workspaceId,
        };

        dispatch(
          getWorkspaceRemindersCount(payload, (err, res) => {
            if (err) return;
            dispatch(updateWorkspaceRemindersCount({ count: res.data, id: wsKey }));
          })
        );
      }
    }
  }, []);

  const handleRedirect = () => {
    let ws_type = workspace && workspace.sharedSlug ? "shared-workspace" : "workspace";
    if (isWorkspace) {
      if (!workspace) return;
      if (type === "chat") {
        if (workspace.folder_id) {
          history.push(`/${ws_type}/chat/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
        } else {
          history.push(`/${ws_type}/chat/${workspace.id}/${replaceChar(workspace.name)}`);
        }
      } else if (type === "posts") {
        if (workspace.folder_id) {
          history.push(`/${ws_type}/posts/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
        } else {
          history.push(`/${ws_type}/posts/${workspace.id}/${replaceChar(workspace.name)}`);
        }
      } else {
        if (workspace.folder_id) {
          history.push(`/${ws_type}/reminders/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
        } else {
          history.push(`/${ws_type}/reminders/${workspace.id}/${replaceChar(workspace.name)}`);
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
      count = workspace ? workspace.unread_chats : 0;
    } else if (type === "posts") {
      count = workspace ? workspace.unread_posts : 0;
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
