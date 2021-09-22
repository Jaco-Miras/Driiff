import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  ChatForwardModal,
  ChatReminderModal,
  CompanyMoveFilesModal,
  ConfirmationModal,
  CreateEditChatModal,
  CreateEditWorkspaceModal,
  CreatePersonalLinksModal,
  CreateWorkspaceFolderModal,
  FileCropUploadModal,
  FileUploadModal,
  InvitedUsersModal,
  MoveFilesModal,
  PostSnoozeModal,
  SingleInputModal,
  TodoReminderModal,
  ReleaseModal,
  CreateEditPostListModal,
  PostModal,
  CreateAdminBotModal,
  UpdateAdminBotModal,
  TrialEndedModal,
} from "../modals";

const ModalPanelContainer = styled.div`
  z-index: 7;
`;

const ModalPanel = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const modals = useSelector((state) => state.global.modals);
  const componentIsMounted = useRef(true);

  useEffect(() => {
    return () => {
      componentIsMounted.current = null;
    };
  }, []);

  useEffect(() => {
    if (Object.keys(modals).length > 0) {
      if (componentIsMounted.current) setScrollTop(document.documentElement.scrollTop);
    } else {
      if (componentIsMounted.current) {
        window.scrollTo(0, scrollTop);
        setScrollTop(0);
      }
    }
    document.body.classList.remove("mobile-modal-open");
  }, [modals]);

  return (
    <ModalPanelContainer>
      {Object.values(modals).map((modal) => {
        switch (modal.type) {
          case "confirmation":
            return <ConfirmationModal key={modal.type} data={modal} />;
          case "forward":
            return <ChatForwardModal key={modal.type} data={modal} />;
          case "reminder":
            return <ChatReminderModal key={modal.type} data={modal} />;
          case "file_upload":
            return <FileUploadModal key={modal.type} data={modal} />;
          case "file_crop_upload":
            return <FileCropUploadModal key={modal.type} data={modal} />;
          case "chat_create_edit":
            return <CreateEditChatModal key={modal.type} data={modal} />;
          case "workspace_folder":
            return <CreateWorkspaceFolderModal key={modal.type} data={modal} />;
          case "workspace_create_edit":
            return <CreateEditWorkspaceModal key={modal.type} data={modal} />;
          case "snooze_post":
            return <PostSnoozeModal key={modal.type} data={modal} />;
          case "driff_invite_users":
            return <InvitedUsersModal key={modal.type} data={modal} />;
          case "single_input":
            return <SingleInputModal key={modal.type} {...modal} />;
          case "move_files":
            return <MoveFilesModal key={modal.type} {...modal} />;
          case "move_company_files":
            return <CompanyMoveFilesModal key={modal.type} data={modal} />;
          case "personal_link_create_edit":
            return <CreatePersonalLinksModal key={modal.type} data={modal} />;
          case "todo_reminder":
            return <TodoReminderModal key={modal.type} data={modal} />;
          // case "update_found":
          //   return <DriffUpdateModal key={modal.type} data={modal} />;
          case "release":
            return <ReleaseModal key={modal.type} data={modal} />;
          case "post_list":
            return <CreateEditPostListModal key={modal.type} data={modal} />;
          case "post_modal":
            return <PostModal key={modal.type} data={modal} />;
          case "create_bot":
            return <CreateAdminBotModal key={modal.type} />;
          case "update_bot":
            return <UpdateAdminBotModal key={modal.type} data={modal} />;
          case "trial_ended_modal":
            return <TrialEndedModal key={modal.type} data={modal} />;
          default:
            return null;
        }
      })}
    </ModalPanelContainer>
  );
};

export default React.memo(ModalPanel);
