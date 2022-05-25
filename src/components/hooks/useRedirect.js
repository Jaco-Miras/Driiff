import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { replaceChar } from "../../helpers/stringFormatter";
import { setActiveTopic, getWorkspace, setWorkspaceToDelete } from "../../redux/actions/workspaceActions";
import { useToaster } from "../hooks";
import { setLastVisitedChannel, getChatMessages, getSelectChannel } from "../../redux/actions/chatActions";

const useRedirect = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const channels = useSelector((state) => state.chat.channels);
  const user = useSelector((state) => state.session.user);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const toaster = useToaster();

  const fetchSelectChannel = (code, callback) => {
    dispatch(
      getSelectChannel({ code: code }, (err, res) => {
        if (err) {
          return;
        }
        history.push(`/chat/${res.data.code}`);
        if (callback) callback();
      })
    );
  };

  const toChannel = (channel, callback) => {
    history.push(`/chat/${channel.code}`);
  };

  const toChat = (cnl, message) => {
    let cb = () => {
      if (user.type === "external") {
        let ws = Object.values(workspaces).find((ws) => ws.channel.id === cnl.id || (ws.team_channel && ws.team_channel.id === cnl.id));
        if (ws) {
          history.push({
            pathname: ws.folder_id ? `/workspace/chat/${ws.folder_id}/${ws.folder_name}/${ws.id}/${ws.name}` : `/workspace/chat/${ws.id}/${ws.name}`,
            state: { focusOn: message.code },
          });
        }
      } else {
        history.push({
          pathname: `/chat/${cnl.code}/${message.code}`,
          state: { focusOn: message.code },
        });
      }
    };
    if (channels.hasOwnProperty(cnl.id)) {
      let channel = { ...channels[cnl.id] };
      if (channel.replies.find((r) => r.id === message.id)) {
        dispatch(setLastVisitedChannel(channel, cb));
      } else {
        let payload = {
          channel_id: channel.id,
          skip: 0,
          before_chat_id: message.id,
          limit: 10,
        };
        if (cnl.slug && sharedWs[cnl.slug]) {
          const sharedPayload = { slug: cnl.slug, token: sharedWs[cnl.slug].access_token, is_shared: true };
          payload = {
            ...payload,
            sharedPayload: sharedPayload,
          };
        }
        dispatch(getChatMessages(payload));
        dispatch(setLastVisitedChannel(channel, cb));
      }
    } else {
      fetchSelectChannel(cnl.code, cb);
    }
  };

  const toFiles = (file) => {
    if (file.workspaces.length) {
      let workspace = {
        id: file.workspaces[0].topic.id,
        name: file.workspaces[0].topic.name,
        folder_id: file.workspaces[0].workspace ? file.workspaces[0].workspace.id : null,
        folder_name: file.workspaces[0].workspace ? file.workspaces[0].workspace.name : null,
      };
      dispatch(setActiveTopic(workspace));
      if (workspace.folder_id) {
        history.push(`/workspace/files/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
      } else {
        history.push(`/workspace/files/${workspace.id}/${replaceChar(workspace.name)}`);
      }
    } else {
      history.push("/files");
    }
  };

  const toPeople = (user) => {
    history.push(`/profile/${user.id}/${replaceChar(user.name)}`);
  };

  const toPost = (payload, locationState = null) => {
    const { post, workspace } = payload;
    if (workspace && workspaces[workspace.id]) {
      dispatch(setActiveTopic(workspace));
      if (workspace.folder_id) {
        history.push(`/workspace/posts/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}/post/${post.id}/${replaceChar(post.title)}`, locationState);
      } else {
        history.push(`/workspace/posts/${workspace.id}/${replaceChar(workspace.name)}/post/${post.id}/${replaceChar(post.title)}`, locationState);
      }
    } else if (workspace && typeof workspaces[workspace.id] === "undefined") {
      fetchWorkspaceAndRedirect(workspace, post);
    } else {
      history.push(`/posts/${post.id}/${replaceChar(post.title)}`, locationState);
    }
  };

  const toWorkspace = (ws, page = "chat") => {
    if (workspaces[ws.id]) {
      let workspace = { ...workspaces[ws.id] };
      dispatch(setActiveTopic(workspace));
      if (workspace.folder_id) {
        history.push(`/workspace/${page}/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
      } else {
        history.push(`/workspace/${page}/${workspace.id}/${replaceChar(workspace.name)}`);
      }
    } else {
      fetchWorkspaceAndRedirect(ws);
    }
  };

  const fetchWorkspaceAndRedirect = (workspace, post = null) => {
    dispatch(
      getWorkspace({ topic_id: workspace.id }, (err, res) => {
        if (err) {
          toaster.warning("This workspace cannot be found or accessed.");
          return;
        }
        dispatch(setActiveTopic(workspace));
        dispatch(setWorkspaceToDelete(workspace.id));
        if (post) {
          if (workspace.folder_id) {
            history.push(`/workspace/posts/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}/post/${post.id}/${replaceChar(post.title)}`);
          } else {
            history.push(`/workspace/posts/${workspace.id}/${replaceChar(workspace.name)}/post/${post.id}/${replaceChar(post.title)}`);
          }
        } else {
          if (workspace.folder_id) {
            history.push(`/workspace/dashboard/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
          } else {
            history.push(`/workspace/dashboard/${workspace.id}/${replaceChar(workspace.name)}`);
          }
        }
      })
    );
  };

  const toTodos = () => {
    history.push("/todos");
  };

  const toMeetings = () => {
    history.push("/meetings");
  };

  return {
    fetchWorkspaceAndRedirect,
    toChannel,
    toChat,
    toFiles,
    toPeople,
    toPost,
    toWorkspace,
    toTodos,
    toMeetings,
  };
};

export default useRedirect;
