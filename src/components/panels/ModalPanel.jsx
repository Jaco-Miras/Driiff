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
  SingleInputModal,
  TodoReminderModal,
  ReleaseModal,
  CreateEditPostListModal,
  PostModal,
  CreateAdminBotModal,
  UpdateAdminBotModal,
  TrialEndedModal,
  CreateFilesFolderModal,
  CreateFilesModal,
  AboutWorkspaceModal,
  CreateExternalFileFolder,
  CreateEditTeamModal,
  AddToTeamModal,
  ZoomInviteModal,
  WIPModal,
  ZoomMeetingInProgress,
  WIPFileModal,
  ZoomConfirmationModal,
  CompanyWorkspaceModal,
  WorkspaceQuickLinksModal,
  FolderNoAccessModal,
  UploadProfilePicModal,
  GoogleMeetInviteModal,
  JitsiInviteModal,
  JitsiConfirmationModal,
  VideoMeetingModal,
  JitsiScheduleModal,
  ImpersonationLoginModal,
  WebhookModal,
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
          case "video_reminder":
            return <VideoMeetingModal key={modal.type} data={modal} />;
          // case "update_found":
          //   return <DriffUpdateModal key={modal.type} data={modal} />;
          case "release":
            return <ReleaseModal key={modal.type} data={modal} />;
          case "post_list":
            return <CreateEditPostListModal key={modal.type} data={modal} />;
          case "post_modal":
            return <PostModal key={modal.type} data={modal} />;
          case "zoom_invite":
            return <ZoomInviteModal key={modal.type} data={modal} />;
          case "zoom_inprogress":
            return <ZoomMeetingInProgress key={modal.type} data={modal} />;
          case "zoom_confirmation":
            return <ZoomConfirmationModal key={modal.type} data={modal} />;
          case "create_bot":
            return <CreateAdminBotModal key={modal.type} />;
          case "update_bot":
            return <UpdateAdminBotModal key={modal.type} data={modal} />;
          case "trial_ended_modal":
            return <TrialEndedModal key={modal.type} data={modal} />;
          case "files_folder":
            return <CreateFilesFolderModal key={modal.type} data={modal} />;
          case "files":
            return <CreateFilesModal key={modal.type} data={modal} />;
          case "about_workspace":
            return <AboutWorkspaceModal key={modal.type} data={modal} />;
          case "external_file_folder":
            return <CreateExternalFileFolder key={modal.type} data={modal} />;
          case "team":
            return <CreateEditTeamModal key={modal.type} data={modal} />;
          case "add-to-team":
            return <AddToTeamModal key={modal.type} data={modal} />;
          case "wip":
            return <WIPModal key={modal.type} data={modal} />;
          case "wip_file":
            return <WIPFileModal key={modal.type} data={modal} />;
          case "company-workspace":
            return <CompanyWorkspaceModal key={modal.type} data={modal} />;
          case "workspace-quicklinks":
            return <WorkspaceQuickLinksModal key={modal.type} data={modal} />;
          case "no_access_folder":
            return <FolderNoAccessModal key={modal.type} data={modal} />;
          case "upload-profile-pic":
            return <UploadProfilePicModal key={modal.type} data={modal} />;
          case "meet_invite":
            return <GoogleMeetInviteModal key={modal.type} data={modal} />;
          case "jitsi_invite":
            return <JitsiInviteModal key={modal.type} data={modal} />;
          case "jitsi_confirmation":
            return <JitsiConfirmationModal key={modal.type} data={modal} />;
          case "jitsi_schedule_meeting":
            return <JitsiScheduleModal key={modal.type} data={modal} />;
          case "impersonation_login":
            return <ImpersonationLoginModal key={modal.type} data={modal} />;
          case "chat_webhook":
            return <WebhookModal key={modal.type} data={modal} />;
          default:
            return null;
        }
      })}
    </ModalPanelContainer>
  );
};

export default React.memo(ModalPanel);
