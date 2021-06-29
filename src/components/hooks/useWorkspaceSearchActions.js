import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { replaceChar } from "../../helpers/stringFormatter";
import { putChannel } from "../../redux/actions/chatActions";
import { getWorkspaceFitlerCount, getAllWorkspace, favouriteWorkspace, joinWorkspace, leaveWorkspace, updateWorkspace, updateWorkspaceSearch, setActiveTopic, getWorkspace, setWorkspaceToDelete } from "../../redux/actions/workspaceActions";
import { addToModals } from "../../redux/actions/globalActions";
import { useToaster, useTranslationActions } from "./index";

const useWorkspaceSearchActions = () => {
  const dispatch = useDispatch();
  const toaster = useToaster();
  const history = useHistory();
  const { _t } = useTranslationActions();
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const user = useSelector((state) => state.session.user);

  const dictionary = {
    archiveWorkspace: _t("HEADER.ARCHIVE_WORKSPACE", "Archive workspace"),
    archive: _t("BUTTON.ARCHIVE", "Archive"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    archiveBodyText: _t("TEXT.ARCHIVE_CONFIRMATION", "Are you sure you want to archive this workspace?"),
    unArchiveBodyText: _t("TEXT.UNARCHIVE_CONFIRMATION", "Are you sure you want to un-archive this workspace?"),
    unArchiveWorkspace: _t("HEADER.UNARCHIVE_WORKSPACE", "Un-archive workspace"),
    leaveWorkspace: _t("TOASTER.LEAVE_WORKSPACE", "You have left #"),
    joinWorkspace: _t("TOASTER.JOIN_WORKSPACE", "You have joined #"),
  };

  const search = (payload, callback) => {
    dispatch(getAllWorkspace(payload, callback));
  };

  const updateSearch = (payload, callback) => {
    dispatch(updateWorkspaceSearch(payload, callback));
  };

  const showWorkspaceModal = () => {
    let payload = {
      type: "workspace_create_edit",
      mode: "create",
    };

    dispatch(addToModals(payload));
  };

  const archive = (item) => {
    let payload = {
      id: item.channel.id,
      is_archived: !item.topic.is_archive,
      is_muted: false,
      is_pinned: false,
      is_shared: item.topic.is_shared,
    };

    if (item.topic.is_archive) {
      payload.push_unarchived = 1;
    }

    dispatch(
      putChannel(payload, (err, res) => {
        if (err) return;
        getFilterCount();
        toaster.success(
          <span>
            {item.topic.is_archive ? "Unarchived " : "Archived "} <b>{item.topic.name}</b>
          </span>
        );
      })
    );
  };

  const showArchiveConfirmation = (item) => {
    let payload = {
      type: "confirmation",
      headerText: dictionary.archiveWorkspace,
      submitText: dictionary.archive,
      cancelText: dictionary.cancel,
      bodyText: dictionary.archiveBodyText,
      actions: {
        onSubmit: () => archive(item),
      },
    };

    if (item.topic.is_archive) {
      payload = {
        ...payload,
        headerText: dictionary.unArchiveWorkspace,
        submitText: dictionary.unArchiveWorkspace,
        bodyText: dictionary.unArchiveBodyText,
      };
    }

    dispatch(addToModals(payload));
  };

  const edit = (item) => {
    if (workspaces[item.topic.id]) {
      let payload = {
        type: "workspace_create_edit",
        mode: "edit",
        item: workspaces[item.topic.id],
      };

      dispatch(addToModals(payload));
    }
  };

  const join = (item) => {
    let payload = {
      channel_id: item.channel.id,
      recipient_ids: [user.id],
    };
    let callback = (err, res) => {
      if (err) return;
      //handleRedirect(item);
      getFilterCount();
      toWorkspace({
        id: item.topic.id,
        name: item.topic.name,
        folder_id: item.workspace ? item.workspace.id : null,
        folder_name: item.workspace ? item.workspace.name : null,
      });
      toaster.success(
        <>
          {dictionary.joinWorkspace}
          <b>{item.topic.name}</b>
        </>
      );
    };
    dispatch(joinWorkspace(payload, callback));
  };

  const leave = (item) => {
    favourite(item);
    if (item.members.length === 1 && item.topic.is_locked) {
      let archivePayload = {
        id: item.channel.id,
        is_archived: true,
        is_muted: false,
        is_pinned: false,
      };
      dispatch(putChannel(archivePayload));
    } else {
      let payload = {
        name: item.topic.name,
        description: item.topic.description,
        topic_id: item.topic.id,
        is_external: item.topic.is_shared ? 1 : 0,
        member_ids: item.members.map((m) => m.id),
        is_lock: item.topic.is_locked ? 1 : 0,
        workspace_id: item.workspace ? item.workspace.id : 0,
        new_member_ids: [],
        remove_member_ids: [user.id],
      };
      payload.system_message = `CHANNEL_UPDATE::${JSON.stringify({
        author: {
          id: user.id,
          name: user.name,
          first_name: user.first_name,
          partial_name: user.partial_name,
          profile_image_link: user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link,
        },
        title: "",
        added_members: [],
        removed_members: [user.id],
      })}`;
      let callback = (err, res) => {
        if (err) return;
        getFilterCount();
        toaster.success(
          <>
            {dictionary.leaveWorkspace}
            <b>{item.topic.name}</b>
          </>
        );
      };
      dispatch(leaveWorkspace({ workspace_id: item.topic.id, channel_id: item.channel.id }, callback));
      dispatch(updateWorkspace(payload));
    }
  };

  const toWorkspace = (workspace) => {
    if (workspaces[workspace.id]) {
      dispatch(setActiveTopic(workspace));
      if (workspace.folder_id) {
        history.push(`/workspace/chat/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
      } else {
        history.push(`/workspace/chat/${workspace.id}/${replaceChar(workspace.name)}`);
      }
    } else {
      fetchWorkspaceAndRedirect(workspace);
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
            history.push(`/workspace/chat/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
          } else {
            history.push(`/workspace/chat/${workspace.id}/${replaceChar(workspace.name)}`);
          }
        }
      })
    );
  };

  const favourite = (item) => {
    let payload = {
      id: item.topic.id,
      workspace_id: item.workspace ? item.workspace.id : 0,
      is_pinned: item.topic.is_favourite ? 0 : 1,
    };

    dispatch(
      favouriteWorkspace(payload, (err, res) => {
        if (err) return;
        getFilterCount();
      })
    );
  };

  const getFilterCount = () => {
    dispatch(getWorkspaceFitlerCount());
  };

  return {
    edit,
    favourite,
    getFilterCount,
    leave,
    join,
    search,
    showArchiveConfirmation,
    showWorkspaceModal,
    toWorkspace,
    updateSearch,
  };
};

export default useWorkspaceSearchActions;
