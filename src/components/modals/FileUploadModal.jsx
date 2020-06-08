import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Modal, ModalBody, ModalFooter} from "reactstrap";
import styled from "styled-components";
import {SvgIcon} from "../common";
import {postChatMessage} from "../../redux/actions/chatActions";
import {clearModal, saveInputData} from "../../redux/actions/globalActions";
import {uploadDocument} from "../../redux/services/global";
import QuillEditor from "../forms/QuillEditor";
import {useQuillModules} from "../hooks";
import {ModalHeaderSection} from "./index";

const StyledQuillEditor = styled(QuillEditor)`
    .ql-mention-list-container-top, .ql-mention-list-container {
        width: 300px !important;
        max-height: 170px;
        background: rgb(255, 255, 255);
        border-radius: 8px;
        box-shadow: rgba(26, 26, 26, 0.4) 0px 2px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
        overflow-x: hidden;
        overflow-y: auto;
        z-index: 2;

        .ql-mention-list {
            padding: 0;

            .ql-mention-list-item {
            display: flex;
            align-items: center;
            padding-top: 1rem;
            padding-bottom: 1rem;
            padding-left: 1rem;

            &.selected {
                background: #7A1B8B;
                color: #fff;
            }
            }
        }
    }
`;

const FilesPreviewContainer = styled.div`
    width:  100%;
    margin-top: 15px;
    ul{
        margin: 0;
        padding: 0;
        border: 1px solid #ddd;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: ${props => props.hasOneFile ? "center" : "flex-start"};
        overflow-x: auto;
    }
    li{
        list-style: none;
        margin: 0 10px;
        height: 160px;
        width: 200px;
        border: 1px solid #ddd;
        border-radius: 8px;
        position: relative;
        img{
            height: 100%;
            width: 100%;
            object-fit: cover;
            border-radius: inherit;
        }
        span{
            position: absolute;
            top: -10px;
            right: -6px;
            display: none;
            color: black;
        }
        span:hover{
            color: #7a1b8b;
            cursor: pointer;
        }
        .app-file-list {
            min-height: 158px;
            border: 0;
        }
    }
    li:hover span{
        display: ${props => props.hasOneFile ? "none" : "block"};
    }
`;

const DocDiv = styled.div`
    ${'' /* height: 100%;
    width: 100%;
    display: flex;
    padding: 10px;
    align-items: flex-start; */}

`;

const FileUploadModal = props => {

    const {type, mode, droppedFiles} = props.data;

    const dispatch = useDispatch();
    const reactQuillRef = useRef();
    const selectedChannel = useSelector(state => state.chat.selectedChannel);
    const user = useSelector(state => state.session.user);
    const savedInput = useSelector(state => state.global.dataFromInput);

    const [modal, setModal] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState(droppedFiles);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [sending, setSending] = useState(false);
    const [comment, setComment] = useState("");
    const [textOnly, setTextOnly] = useState("");
    const [quillContents, setQuillContents] = useState([]);

    useEffect(() => {
        if (savedInput !== null) {
            reactQuillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, savedInput.text);
            setComment(savedInput.text);
            setTextOnly(savedInput.textOnly);
            setQuillContents(savedInput.quillContents);
        }
    }, [savedInput]);

    const toggle = () => {
        setModal(!modal);
        dispatch(
            clearModal({type: type}),
        );
        dispatch(saveInputData({sent: false}));
    };

    const handleRemoveFile = (file) => {
        setFiles(files.filter(f => f.id !== file.id));
    };

    async function uploadFiles() {
        await Promise.all(
            files.map(file => uploadDocument({
                    user_id: user.id,
                    file: file.bodyFormData,
                    file_type: "private",
                    folder_id: null,
                }),
            ),
        ).then(result => {
            setUploadedFiles(result.map(res => res.data));
        });
    }

    const handleUpload = () => {
        if (!uploading && !sending) {
            setUploading(true);
            uploadFiles();
        }
    };

    const handleSendChat = (body, mention_ids) => {
        uploadedFiles.forEach((file, k) => {
            let payload = {};
            if (k === uploadedFiles.length - 1) {
                payload = {
                    channel_id: selectedChannel.id,
                    body: body,
                    mention_ids: mention_ids,
                    file_ids: [file.id],
                    quote: null,
                    reference_id: require("shortid").generate(),
                    reference_title: selectedChannel.title,
                };
                setTimeout(() => {
                    dispatch(postChatMessage(payload));
                }, 300);
                setUploadedFiles([]);
                dispatch(saveInputData({sent: true}));
                dispatch(clearModal({type: type}));
                //toggle();
            } else {
                payload = {
                    channel_id: selectedChannel.id,
                    body: "",
                    mention_ids: [],
                    file_ids: [file.id],
                    quote: null,
                    reference_id: require("shortid").generate(),
                    reference_title: selectedChannel.title,
                };
                dispatch(postChatMessage(payload));
            }
        });
    };

    useEffect(() => {
        if (uploadedFiles.length) {
            if (uploadedFiles.length === files.length) {
                let mention_ids = [];
                let body = comment;
                let haveGif = false;
                if (quillContents.ops && quillContents.ops.length > 0) {
                    let mentionIds = quillContents.ops.filter(id => {
                        return id.insert.mention ? id : null;
                    }).map(mid => Number(mid.insert.mention.id));
                    mention_ids = [...new Set(mentionIds)];
                    if (mention_ids.includes(NaN)) {
                        mention_ids = [...new Set([...mention_ids.filter(id => !isNaN(id)), ...selectedChannel.members.map(m => m.id)])];
                    } else {
                        //remove the nan in mention ids
                        mention_ids = mention_ids.filter(id => !isNaN(id));
                    }

                    quillContents.ops.forEach(op => {
                        if (op.insert.image) {
                            haveGif = true;

                        }
                    });
                }

                if (textOnly.trim() === "" && mention_ids.length === 0 && !haveGif) {
                    body = "<span></span>";
                }

                if (uploadedFiles.filter(f => isNaN(f.id)).length) {

                } else {
                    if (mode === "chat") {
                        if (!sending) {
                            handleSendChat(body, mention_ids);
                            setSending(true);
                        }
                    }
                    // if (modalData.quote) {
                    //     modalData.onClearQuote();
                    // }
                    // modalData.onClearContent();
                }
            }
        }
    });

    const handleQuillChange = (content, delta, source, editor) => {
        setComment(content);
        setQuillContents(editor.getContents());
        setTextOnly(editor.getText(content));
    };

    const [modules] = useQuillModules("chat_upload");

    return (
        <Modal isOpen={modal} toggle={toggle} centered>
            <ModalHeaderSection toggle={toggle}>File upload</ModalHeaderSection>
            <ModalBody>
                <StyledQuillEditor
                    className={"chat-input"}
                    modules={modules}
                    ref={reactQuillRef}
                    placeholder={`Add message. Type @ to mention someone.`}
                    readOnly={uploading}
                    onChange={handleQuillChange}
                />
                <FilesPreview
                    files={files}
                    onRemoveFile={handleRemoveFile}
                />
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleUpload}>
                    {
                        uploading &&
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    }
                    Upload</Button>{" "}
                <Button outline color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};

const FilesPreview = props => {
    const {files, onRemoveFile} = props;

    const handleRemoveFile = file => {
        onRemoveFile(file);
    };

    return (
        <FilesPreviewContainer hasOneFile={files.length === 1}>
            <ul>
                {
                    files.map((file, i) => {
                        return (
                            <li key={i}>
                                <button className="close" aria-label="close"
                                        onClick={e => handleRemoveFile(file)}>
                                    <span aria-hidden="true">x</span>
                                </button>
                                {
                                    file.type === "IMAGE" && <img alt="file" src={file.src}/>
                                }
                                {
                                    file.type !== "IMAGE" && <DocDiv className="card app-file-list">
                                        <div class="app-file-icon">
                                            <SvgIcon icon={`document`} width="28" height="32"/>
                                        </div>
                                        <div class="p-2 small">
                                            {file.name}
                                        </div>
                                    </DocDiv>
                                }
                            </li>
                        );
                    })
                }
            </ul>
        </FilesPreviewContainer>
    );
};

export default React.memo(FileUploadModal);