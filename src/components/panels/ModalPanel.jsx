import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import FileViewer from "../common/FileViewer";
import {
  ChatForwardModal,
  ChatReminderModal,
  ConfirmationModal,
  CreateEditChatModal,
  CreateEditCompanyPostModal,
  CreateEditWorkspaceModal,
  CreateEditWorkspacePostModal,
  CreatePersonalLinksModal,
  CreateWorkspaceFolderModal,
  FileCropUploadModal,
  FileUploadModal,
  InvitedUsersModal,
  MoveFilesModal,
  PostSnoozeModal,
  SingleInputModal,
} from "../modals";

const ModalPanelContainer = styled.div`
  z-index: 7;
`;

const ModalPanel = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const modals = useSelector((state) => state.global.modals);
  const viewFiles = useSelector((state) => state.files.viewFiles);

  useEffect(() => {
    if (Object.keys(modals).length > 0) {
      setScrollTop(document.documentElement.scrollTop);
    } else {
      window.scrollTo(0, scrollTop);
      setScrollTop(0);
    }
    document.body.classList.remove("mobile-modal-open");
  }, [modals]);

  if (Object.keys(modals).length > 0) {
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
              return <FileUploadModal key={modal.type} data={modal}/>;
            case "file_crop_upload":
              return <FileCropUploadModal key={modal.type} data={modal}/>;
            case "chat_create_edit":
              return <CreateEditChatModal key={modal.type} data={modal}/>;
            case "workspace_folder":
              return <CreateWorkspaceFolderModal key={modal.type} data={modal}/>;
            case "workspace_create_edit":
              return <CreateEditWorkspaceModal key={modal.type} data={modal}/>;
            case "company_post_create_edit":
              return <CreateEditCompanyPostModal key={modal.type} data={modal}/>;
            case "workspace_post_create_edit":
              return <CreateEditWorkspacePostModal key={modal.type} data={modal}/>;
            case "snooze_post":
              return <PostSnoozeModal key={modal.type} data={modal}/>;
            case "driff_invite_users":
              return <InvitedUsersModal key={modal.type} data={modal}/>;
            case "single_input":
              return <SingleInputModal key={modal.type} {...modal} />;
            case "move_files":
              return <MoveFilesModal key={modal.type} {...modal} />;
            case "personal_link_create_edit":
              return <CreatePersonalLinksModal key={modal.type} data={modal}/>
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
