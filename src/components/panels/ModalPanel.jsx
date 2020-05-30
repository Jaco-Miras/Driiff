import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import FileViewer from "../common/FileViewer";
import {
    ChatForwardModal,
    ChatReminderModal,
    ConfirmationModal,
    CreateEditChatModal,
    CreateEditWorkspaceModal,
    CreateEditWorkspacePostModal,
    CreateWorkspaceFolderModal,
    FileUploadModal,
} from "../modals";

const ModalPanelContainer = styled.div`
    z-index: 7;
`;

const ModalPanel = props => {

    const modals = useSelector(state => state.global.modals);
    const viewFiles = useSelector(state => state.files.viewFiles);

    if (Object.keys(modals).length > 0) {
        return (
            <ModalPanelContainer>
                {
                    Object.values(modals).map(modal => {
                        switch (modal.type) {
                            case "confirmation":
                                return <ConfirmationModal key={modal.type} data={modal}/>;
                            case "forward":
                                return <ChatForwardModal key={modal.type} data={modal}/>;
                            case "reminder":
                                return <ChatReminderModal key={modal.type} data={modal}/>;
                            case "file_upload":
                                return <FileUploadModal key={modal.type} data={modal}/>;
                            case "chat_create_edit":
                                return <CreateEditChatModal key={modal.type} data={modal}/>;
                            case "workspace_folder":
                                return <CreateWorkspaceFolderModal key={modal.type} data={modal}/>;
                            case "workspace_create_edit":
                                return <CreateEditWorkspaceModal key={modal.type} data={modal}/>;
                            case "workspace_post_create_edit":
                                return <CreateEditWorkspacePostModal key={modal.type} data={modal}/>;
                            default:
                                return null;
                        }
                    })
                }
            </ModalPanelContainer>
        );
    } else if (viewFiles !== null) {
        return (
            <ModalPanelContainer>
                <FileViewer/>
            </ModalPanelContainer>
        );
    } else return null;
};

export default React.memo(ModalPanel);