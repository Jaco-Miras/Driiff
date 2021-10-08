import React from "react";
import { renderToString } from "react-dom/server";
import { useTranslationActions } from "../hooks";

const usePostModalDictionary = (props) => {
  const { workspace_ids, addressIds } = props;
  const { _t } = useTranslationActions();
  const dictionary = {
    createPost: _t("POST.CREATE_POST", "Create post"),
    createNewPost: _t("POST.CREATE_NEW_POST", "Create new post"),
    editPost: _t("POST.EDIT_POST", "Edit post"),
    postTitle: _t("POST.TITLE", "Title"),
    postInfo: _t("POST_INFO", "A post is a message that can contain text and images. It can be directed at one or more workspaces, and to one or multiple persons."),
    visibility: _t("POST.VISIBILITY", "Visibility"),
    workspace: _t("POST.WORKSPACE", "Workspace"),
    responsible: _t("POST.RESPONSIBLE", "Responsible"),
    addressed: _t("POST.ADDRESSED", "Addressed"),
    addressedTo: _t("POST.ADDRESSED_TO", "Addressed to"),
    addressedPeople: _t("POST.ADDRESSED_PEOPLE", "Addressed people"),
    addressedPeopleOnly: _t("POST.ADDRESSED_PEOPLE_ONLY", "Addressed people only"),
    description: _t("POST.DESCRIPTION", "Description"),
    saveAsDraft: _t("POST.SAVE_AS_DRAFT", "Save as draft"),
    moreOptions: _t("POST.MORE_OPTIONS", "More options"),
    replyRequired: _t("POST.REPLY_REQUIRED", "Reply required"),
    mustRead: _t("POST.MUST_READ", "Must read"),
    noReplies: _t("POST.NO_REPLIES", "No replies"),
    schedulePost: _t("POST.SCHEDULE", "Schedule"),
    updatePostButton: _t("POST.UPDATE_BUTTON", "Update post"),
    createPostButton: _t("POST.CREATE_BUTTON", "Create post"),
    save: _t("POST.SAVE", "Save"),
    discard: _t("POST.DISCARD", "Discard"),
    draftBody: _t("POST.DRAFT_BODY", "Not sure about the content? Save it as a draft."),
    postVisibilityInfo: _t("POST.POST_VISIBILITY_COUNT_INFO", "This post will be visible to ::user_count:: in ::workspace_count::", {
      user_count: renderToString(
        <span className="user-popup">
          {addressIds.length === 1
            ? _t("POST.NUMBER_USER", "1 user")
            : _t("POST.NUMBER_USERS", "::count:: users", {
                count: addressIds.length,
              })}
        </span>
      ),
      workspace_count: renderToString(
        <span className="workspace-popup">
          {workspace_ids.length === 1
            ? _t("POST.NUMBER_WORKSPACE", "1 workspace")
            : _t("POST.NUMBER_WORKSPACES", "::count:: workspaces", {
                count: workspace_ids.length,
              })}
        </span>
      ),
    }),
    approve: _t("POST.APPROVE", "Approve"),
    shareWithClient: _t("POST.SHARE_WITH_CLIENT", "Who can read this post"),
    fileUploadLabel: _t("LABEL.EXTERNAL_WORKSPACE_FILES", "Files added to workspace can be seen by internal and external accounts"),
    internalTeamLabel: _t("LABEL.INTERNAL_TEAM", "Internal team"),
    internalAndExternalTeamLabel: _t("LABEL.INTERNAL_AND_EXTERTNAL_TEAM", "Internal and external team"),
    uploading: _t("FILE_UPLOADING", "Uploading File"),
    unsuccessful: _t("FILE_UNSUCCESSFULL", "Upload File Unsuccessful"),
    fileAttachments: _t("POST.FILE_ATTACHMENTS", "File attachments"),
    sendingPost: _t("TOASTER.SENDING_POST", "Sending post"),
    updatingPost: _t("TOASTER.UPDATING_POST", "Updating post"),
    uploadingAndSending: _t("TOASTER.SENDING_POST_WITH_FILE", "Uploading file and sending post"),
    teamLabel: _t("LABEL_OPTIONS.TEAM", "Team"),
  };

  return {
    dictionary,
  };
};

export default usePostModalDictionary;
