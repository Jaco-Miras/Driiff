import React, {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {addToModals} from "../../../redux/actions/globalActions";
import {DropDocument} from "../../dropzone/DropDocument";
import ChatMessages from "../../list/chat/ChatMessages";
import {ChatFooterPanel, ChatHeaderPanel} from "./index";
import ChatUnreadFloatBar from "../../list/chat/ChatUnreadFloatBar";
import { useCountUnreadReplies } from "../../hooks";


const Wrapper = styled.div`
`;

const ChatMessagesPlaceholder = styled.div`
    flex: 1;
`;

const ChatContentPanel = (props) => {

    const dispatch = useDispatch();
    const dropzoneRef = useRef();
    const {className = ""} = props;
    const selectedChannel = useSelector(state => state.chat.selectedChannel);
    const [showDropzone, setShowDropzone] = useState(false);
    const unreadCount = useCountUnreadReplies();

    const handleOpenFileDialog = () => {
        if (dropzoneRef.current) {
            dropzoneRef.current.open();
        }
    };

    const handleHideDropzone = () => {
        setShowDropzone(false);
    };

    const handleShowDropzone = () => {
        setShowDropzone(true);
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
        handleHideDropzone();

        let modal = {
            type: "file_upload",
            droppedFiles: attachedFiles,
            mode: "chat",
        };

        dispatch(addToModals(modal));
    };

    return (
        <Wrapper className={`chat-content ${className}`} onDragOver={handleShowDropzone}>
            <DropDocument
                hide={!showDropzone}
                ref={dropzoneRef}
                onDragLeave={handleHideDropzone}
                onDrop={({acceptedFiles}) => {
                    dropAction(acceptedFiles);
                }}
                onCancel={handleHideDropzone}
            />
            <ChatHeaderPanel/>
            {selectedChannel !== null && unreadCount > 0 && <ChatUnreadFloatBar/>}
            {selectedChannel !== null ? <ChatMessages/> : <ChatMessagesPlaceholder/>}
            {/* <ChatMessagesPanel/> */}
            <ChatFooterPanel onShowFileDialog={handleOpenFileDialog} dropAction={dropAction}/>
        </Wrapper>
    );
};

export default React.memo(ChatContentPanel);