import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import ChatMessages from "../../list/chat/ChatMessages";
import {ChatFooterPanel, ChatHeaderPanel} from "./index";
import { DropDocument } from "../../dropzone/DropDocument";
import { addToModals } from "../../../redux/actions/globalActions";


const Wrapper = styled.div`
`;

const ChatContentPanel = (props) => {

    const dispatch = useDispatch();
    const dropzoneRef = useRef();
    const {className = ""} = props;
    const selectedChannel = useSelector(state => state.chat.selectedChannel);
    const [showDropzone, setShowDropzone] = useState(false)

    const handleOpenFileDialog = () => {
        if (dropzoneRef.current) {
            dropzoneRef.current.open();
        }
    };
    
    const handleHideDropzone = () => {
        setShowDropzone(false)
    };

    const dropAction = (acceptedFiles) => {

        let attachedFiles = [];
        acceptedFiles.forEach(file => {
            var bodyFormData = new FormData();
            bodyFormData.append("file", file);
            let shortFileId = require("shortid").generate();
            if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif" || file.type === "image/webp") {
                attachedFiles.push({
                    ...file,
                    type: "IMAGE",
                    id: shortFileId,
                    status: false,
                    src: URL.createObjectURL(file),
                    bodyFormData: bodyFormData,
                    name: file.name ? file.name : file.path,
                });
            } else if (file.type === "video/mp4") {
                attachedFiles.push({
                    ...file,
                    type: "VIDEO",
                    id: shortFileId,
                    status: false,
                    src: URL.createObjectURL(file),
                    bodyFormData: bodyFormData,
                    name: file.name ? file.name : file.path,
                });
            } else {
                attachedFiles.push({
                    ...file,
                    type: "DOC",
                    id: shortFileId,
                    status: false,
                    src: "#",
                    bodyFormData: bodyFormData,
                    name: file.name ? file.name : file.path,
                });
            }
        });
        handleHideDropzone()

        let modal = {
            type: "file_upload",
            droppedFiles: attachedFiles,
            mode: "chat"
        }

        dispatch(addToModals(modal));
    };

    return (
        <Wrapper className={`chat-content ${className}`}>
            <DropDocument 
                hide={true} 
                ref={dropzoneRef}
                onDragLeave={handleHideDropzone}
                onDrop={({acceptedFiles}) => {
                    dropAction(acceptedFiles);
                }}
                onCancel={handleHideDropzone}
            />
            <ChatHeaderPanel/>
            {selectedChannel !== null && <ChatMessages/>}
            {/* <ChatMessagesPanel/> */}
            <ChatFooterPanel onShowFileDialog={handleOpenFileDialog}/>
        </Wrapper>
    );
};

export default React.memo(ChatContentPanel);