import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import FileViewer from "../common/FileViewer";
import //ChatForwardModal,
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
"../modals";
import { useHuddleNotification } from "../hooks";

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

const ModalPanelContainer = styled.div`
  z-index: 7;
`;

const ModalPanel = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const modals = useSelector((state) => state.global.modals);
  const viewFiles = useSelector((state) => state.files.viewFiles);
  const componentIsMounted = useRef(true);
  useHuddleNotification();

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

  if (Object.keys(modals).length > 0) {
    return (
      <ModalPanelContainer>
        {Object.values(modals).map((modal) => {
          switch (modal.type) {
            case "confirmation":
              return (
                <Suspense fallback={<div></div>}>
                  <ConfirmationModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "forward":
              return (
                <Suspense fallback={<div></div>}>
                  <ChatForwardModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "reminder":
              return (
                <Suspense fallback={<div></div>}>
                  <ChatReminderModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "file_upload":
              return (
                <Suspense fallback={<div></div>}>
                  <FileUploadModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "file_crop_upload":
              return (
                <Suspense fallback={<div></div>}>
                  <FileCropUploadModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "chat_create_edit":
              return (
                <Suspense fallback={<div></div>}>
                  <CreateEditChatModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "workspace_folder":
              return (
                <Suspense fallback={<div></div>}>
                  <CreateWorkspaceFolderModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "workspace_create_edit":
              return (
                <Suspense fallback={<div></div>}>
                  <CreateEditWorkspaceModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "snooze_post":
              return (
                <Suspense fallback={<div></div>}>
                  <PostSnoozeModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "driff_invite_users":
              return (
                <Suspense fallback={<div></div>}>
                  <InvitedUsersModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "single_input":
              return (
                <Suspense fallback={<div></div>}>
                  <SingleInputModal key={modal.type} {...modal} />
                </Suspense>
              );
            case "move_files":
              return (
                <Suspense fallback={<div></div>}>
                  <MoveFilesModal key={modal.type} {...modal} />
                </Suspense>
              );
            case "move_company_files":
              return (
                <Suspense fallback={<div></div>}>
                  <CompanyMoveFilesModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "personal_link_create_edit":
              return (
                <Suspense fallback={<div></div>}>
                  <CreatePersonalLinksModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "todo_reminder":
              return (
                <Suspense fallback={<div></div>}>
                  <TodoReminderModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "update_found":
              return (
                <Suspense fallback={<div></div>}>
                  <DriffUpdateModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "release":
              return (
                <Suspense fallback={<div></div>}>
                  <ReleaseModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "post_list":
              return (
                <Suspense fallback={<div></div>}>
                  <CreateEditPostListModal key={modal.type} data={modal} />
                </Suspense>
              );
            case "post_modal":
              return (
                <Suspense fallback={<div></div>}>
                  <PostModal key={modal.type} data={modal} />
                </Suspense>
              );
            default:
              return null;
          }
        })}
      </ModalPanelContainer>
    );
  } else if (viewFiles !== null) {
    return (
      <ModalPanelContainer>
        <FileViewer />
      </ModalPanelContainer>
    );
  } else return null;
};

export default React.memo(ModalPanel);
