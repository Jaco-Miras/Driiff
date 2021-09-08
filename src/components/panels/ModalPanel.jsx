import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
//import FileViewer from "../common/FileViewer";
import {
  ChatForwardModal,
  ChatReminderModal,
  CompanyMoveFilesModal,
  ConfirmationModal,
  CreateEditChatModal,
  CreateEditWorkspaceModal,
  CreatePersonalLinksModal,
  CreateWorkspaceFolderModal,
  //DriffUpdateModal,
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
  ZoomInviteModal,
} from "../modals";

// const PostModal = lazy(() => import("../modals/PostModal"));
// const CreateEditWorkspaceModal = lazy(() => import("../modals/CreateEditWorkspaceModal"));
// const CreateEditPostListModal = lazy(() => import("../modals/CreateEditPostListModal"));
// const ReleaseModal = lazy(() => import("../modals/ReleaseModal"));
// const TodoReminderModal = lazy(() => import("../modals/TodoReminderModal"));
// const ConfirmationModal = lazy(() => import("../modals/ConfirmationModal"));
// const ChatForwardModal = lazy(() => import("../modals/ChatForwardModal"));
// const FileUploadModal = lazy(() => import("../modals/FileUploadModal"));
// const FileCropUploadModal = lazy(() => import("../modals/FileCropUploadModal"));
// const InvitedUsersModal = lazy(() => import("../modals/InvitedUsersModal"));
// const MoveFilesModal = lazy(() => import("../modals/MoveFilesModal"));
// const ChatReminderModal = lazy(() => import("../modals/ChatReminderModal"));
// const CompanyMoveFilesModal = lazy(() => import("../modals/CompanyMoveFilesModal"));
// const CreateEditChatModal = lazy(() => import("../modals/CreateEditChatModal"));
// const CreatePersonalLinksModal = lazy(() => import("../modals/CreatePersonalLinksModal"));
// const CreateWorkspaceFolderModal = lazy(() => import("../modals/CreateWorkspaceFolderModal"));
// const DriffUpdateModal = lazy(() => import("../modals/DriffUpdateModal"));
// const PostSnoozeModal = lazy(() => import("../modals/PostSnoozeModal"));
// const SingleInputModal = lazy(() => import("../modals/SingleInputModal"));

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
          case "zoom_invite":
            return <ZoomInviteModal key={modal.type} data={modal} />;

          default:
            return null;
        }
      })}
    </ModalPanelContainer>
  );
};

export default React.memo(ModalPanel);
