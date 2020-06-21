import React, {useRef, useState} from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import {addToModals} from "../../../redux/actions/globalActions";
import {DropDocument} from "../../dropzone/DropDocument";
import {useCountUnreadReplies, useFocusInput} from "../../hooks";
import useChatMessageActions from "../../hooks/useChatMessageActions";
import ChatMessages from "../../list/chat/ChatMessages";
import ChatUnreadFloatBar from "../../list/chat/ChatUnreadFloatBar";
import {ChatFooterPanel, ChatHeaderPanel} from "./index";


const Wrapper = styled.div`
    width: 100%;
`;

const ChatMessagesPlaceholder = styled.div`
    flex: 1;
`;

const ChatContentPanel = (props) => {

    const {className = "", selectedChannel} = props;

    const dispatch = useDispatch();
    const chatMessageActions = useChatMessageActions();

    const [showDropZone, setshowDropZone] = useState(false);
    const unreadCount = useCountUnreadReplies();

    const refs = {
        dropZoneRef: useRef(),
    };

    const handleOpenFileDialog = () => {
        if (refs.dropZoneRef.current) {
            refs.dropZoneRef.current.open();
        }
    };

    const handleHideDropzone = () => {
        setshowDropZone(false);
    };

    const handleshowDropZone = () => {
        setshowDropZone(true);
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

    useFocusInput(document.querySelector(".chat-footer .ql-editor"));

    return (
        <Wrapper className={`chat-content ${className}`} onDragOver={handleshowDropZone}>
            <DropDocument
                hide={!showDropZone}
                ref={refs.dropZoneRef}
                onDragLeave={handleHideDropzone}
                onDrop={({acceptedFiles}) => {
                    dropAction(acceptedFiles);
                }}
                onCancel={handleHideDropzone}
            />
            <ChatHeaderPanel channel={selectedChannel}/>
            {selectedChannel !== null && unreadCount > 0 && <ChatUnreadFloatBar/>}
            {selectedChannel !== null ? <ChatMessages selectedChannel={selectedChannel} chatMessageActions={chatMessageActions} /> :
             <ChatMessagesPlaceholder/>}
            {/* <ChatMessagesPanel/> */}
            <ChatFooterPanel onShowFileDialog={handleOpenFileDialog} dropAction={dropAction}/>
        </Wrapper>
    );
};

export default React.memo(ChatContentPanel);