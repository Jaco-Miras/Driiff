import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
// import FileViewer from "../common/FileViewer";
//import //ChatForwardModal,
//ChatReminderModal,
//CompanyMoveFilesModal,
//ConfirmationModal,
//CreateEditChatModal,
//CreateEditWorkspaceModal,
//CreatePersonalLinksModal,
//CreateWorkspaceFolderModal,
//DriffUpdateModal,
//FileCropUploadModal,
//FileUploadModal,
//InvitedUsersModal,
//MoveFilesModal,
//PostSnoozeModal,
//SingleInputModal,
//TodoReminderModal,
//ReleaseModal,
//CreateEditPostListModal,
//PostModal,
//"../modals";

const PostModal = lazy(() => import("../modals/PostModal"));
const CreateEditWorkspaceModal = lazy(() => import("../modals/CreateEditWorkspaceModal"));
const CreateEditPostListModal = lazy(() => import("../modals/CreateEditPostListModal"));
const ReleaseModal = lazy(() => import("../modals/ReleaseModal"));
const TodoReminderModal = lazy(() => import("../modals/TodoReminderModal"));
const ConfirmationModal = lazy(() => import("../modals/ConfirmationModal"));
const ChatForwardModal = lazy(() => import("../modals/ChatForwardModal"));
const FileUploadModal = lazy(() => import("../modals/FileUploadModal"));
const FileCropUploadModal = lazy(() => import("../modals/FileCropUploadModal"));
const InvitedUsersModal = lazy(() => import("../modals/InvitedUsersModal"));
const MoveFilesModal = lazy(() => import("../modals/MoveFilesModal"));
const ChatReminderModal = lazy(() => import("../modals/ChatReminderModal"));
const CompanyMoveFilesModal = lazy(() => import("../modals/CompanyMoveFilesModal"));
const CreateEditChatModal = lazy(() => import("../modals/CreateEditChatModal"));
const CreatePersonalLinksModal = lazy(() => import("../modals/CreatePersonalLinksModal"));
const CreateWorkspaceFolderModal = lazy(() => import("../modals/CreateWorkspaceFolderModal"));
const DriffUpdateModal = lazy(() => import("../modals/DriffUpdateModal"));
const PostSnoozeModal = lazy(() => import("../modals/PostSnoozeModal"));
const SingleInputModal = lazy(() => import("../modals/SingleInputModal"));
const ZoomInviteModal = lazy(() => import("../modals/ZoomInviteModal"));

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
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <ConfirmationModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "forward":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <ChatForwardModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "reminder":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <ChatReminderModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "file_upload":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <FileUploadModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "file_crop_upload":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <FileCropUploadModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "chat_create_edit":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <CreateEditChatModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "workspace_folder":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <CreateWorkspaceFolderModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "workspace_create_edit":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <CreateEditWorkspaceModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "snooze_post":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <PostSnoozeModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "driff_invite_users":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <InvitedUsersModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "single_input":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <SingleInputModal key={modal.type} {...modal} />
              </Suspense>
            );
          case "move_files":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <MoveFilesModal key={modal.type} {...modal} />
              </Suspense>
            );
          case "move_company_files":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <CompanyMoveFilesModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "personal_link_create_edit":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <CreatePersonalLinksModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "todo_reminder":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <TodoReminderModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "update_found":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <DriffUpdateModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "release":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <ReleaseModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "post_list":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <CreateEditPostListModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "post_modal":
            return (
              <Suspense fallback={<div></div>} key={modal.type}>
                <PostModal key={modal.type} data={modal} />
              </Suspense>
            );
          case "zoom_invite":
            return (
              <Suspense fallback={<div></div>}>
                <ZoomInviteModal key={modal.type} data={modal} />
              </Suspense>
            );
          default:
            return null;
        }
      })}
    </ModalPanelContainer>
  );
};

export default React.memo(ModalPanel);
