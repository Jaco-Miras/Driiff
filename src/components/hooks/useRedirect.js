import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { replaceChar } from "../../helpers/stringFormatter";
import { setActiveTopic, getWorkspace, setWorkspaceToDelete } from "../../redux/actions/workspaceActions";
import { useToaster } from "../hooks";

const useRedirect = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const toaster = useToaster();

  const toChannel = useCallback((channel, callback) => {
    history.push(`/chat/${channel.code}`);
  }, []);

  const toChat = useCallback((channel, message, callback) => {
    history.push(`/chat/${channel.code}/${message.code}`);
  }, []);

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
