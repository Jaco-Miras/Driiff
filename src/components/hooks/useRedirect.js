import { useCallback } from "react";
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
  const toaster = useToaster();

  const fetchSelectChannel = useCallback(
    (code, callback) => {
      dispatch(
        getSelectChannel({ code: code }, (err, res) => {
          if (err) {
            return;
          }
          history.push(`/chat/${res.data.code}`);
          if (callback) callback();
        })
      );
    },
    [dispatch]
  );

  const toChannel = useCallback((channel, callback) => {
    history.push(`/chat/${channel.code}`);
  }, []);

  const toChat = useCallback(
    (cnl, message, callback) => {
      console.log(cnl);
      //history.push(`/chat/${channel.code}/${message.code}`);
      let cb = () => {
        history.push({
          pathname: `/chat/${cnl.code}/${message.code}`,
          state: { focusOn: message.code },
        });
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
          dispatch(getChatMessages(payload));
          dispatch(setLastVisitedChannel(channel, cb));
        }
      } else {
        fetchSelectChannel(cnl.code, cb);
      }
    },
    [channels, history]
  );

  const toFiles = useCallback((file) => {
    console.log(file);
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
  }, []);

  const toPeople = useCallback((user) => {
    history.push(`/profile/${user.id}/${replaceChar(user.name)}`);
  }, []);

  const toPost = useCallback(
    (payload, locationState = null) => {
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
    },
    [workspaces]
  );

  const toWorkspace = useCallback((workspace) => {
    dispatch(setActiveTopic(workspace));
    if (workspace.folder_id) {
      history.push(`/workspace/chat/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
    } else {
      history.push(`/workspace/chat/${workspace.id}/${replaceChar(workspace.name)}`);
    }
  }, []);

  const fetchWorkspaceAndRedirect = useCallback((workspace, post = null) => {
    dispatch(
      getWorkspace({ topic_id: workspace.id }, (err, res) => {
        console.log(res, err);
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
            history.push(`/workspace/chat/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
          } else {
            history.push(`/workspace/chat/${workspace.id}/${replaceChar(workspace.name)}`);
          }
        }
      })
    );
  }, []);

  const toTodos = useCallback(() => {
    history.push("/todos");
  }, []);

  return {
    fetchWorkspaceAndRedirect,
    toChannel,
    toChat,
    toFiles,
    toPeople,
    toPost,
    toWorkspace,
    toTodos,
  };
};

export default useRedirect;
