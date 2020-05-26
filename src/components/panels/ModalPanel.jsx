import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import FileViewer from "../common/FileViewer";
import {
    ChatForwardModal, ChatReminderModal, ConfirmationModal, CreateEditChatModal, 
    FileUploadModal, WorkspaceFolderModal,
} from "../modals";

const ModalPanelContainer = styled.div`
    z-index: 7;
    // height: 100%;
    // width: 100%;
    // position: fixed;
    // top: 0;
    // left: 0;
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
                                return <WorkspaceFolderModal key={modal.type} data={modal}/>;
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