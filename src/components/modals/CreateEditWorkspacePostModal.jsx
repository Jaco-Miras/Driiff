import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Input, InputGroup, Label, Modal, ModalBody} from "reactstrap";
import styled from "styled-components";
import moment from "moment";
import {clearModal, deleteDraft, saveDraft, updateDraft} from "../../redux/actions/globalActions";
import {postCreate} from "../../redux/actions/postActions";
import {SvgIconFeather, DatePicker, FileAttachments} from "../common";
import {CheckBox, DescriptionInput, FolderSelect, PeopleSelect} from "../forms";
import QuillEditor from "../forms/QuillEditor";
import {useQuillModules, useGetWorkspaceAndUserOptions} from "../hooks";
import {ModalHeaderSection} from "./index";
import {DropDocument} from "../dropzone/DropDocument";

const WrapperDiv = styled(InputGroup)`
    display: flex;
    align-items: center;
    margin: 20px 0;
    label {
        white-space: nowrap;
        margin: 0 20px 0 0;
        min-width: 109px;
    }
    button {
        margin-left: auto;
    }
    .react-select-container {
        width: 100%;
    }
    .react-select__multi-value__label {
        align-self: center;
    }
    
    &.more-option {
        margin-left: 130px;
        width: 100%;
        margin-right: -130px;
    }
    &.file-attachment-wrapper {
        margin-top: 30px;
        margin-bottom: 20px;
    }
    .file-attachments {
        position: relative;
        max-width: 100%;
        margin-left: 128px;
        
        ul {
            margin-right: 128px;
            margin-bottom: 0;
            
            li {                
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
`;

const SelectWorkspace = styled(FolderSelect)`
    flex: 1 0 0;
    width: 1%;
`;

const SelectPeople = styled(PeopleSelect)`
    flex: 1 0 0;
    width: 1%;
`;

const StyledQuillEditor = styled(QuillEditor)`
    flex: 1 0 0;
    width: 1%;
    height: 80px;
    
    &.group-chat-input {
        border: 1px solid #afb8bd;
        border-radius: 5px;
        max-height: 130px;
        overflow: auto;
        overflow-x: hidden;
        position: static;
        width: 100%;
    }
    .ql-toolbar {
        display: none;
    }
    .ql-container {
        border: none;
    }
    .ql-editor {
        padding: 5px;
    }
`;

const CheckBoxGroup = styled.div`
    display: flex;    
    overflow: hidden;    
    transition: all .3s ease;
    width: 100%;
    
    &.enter-active {
        max-height: ${props => props.maxHeight}px;        
    }

    &.leave-active {
        max-height: 0px;
    }
    
    label {
        min-width: auto;
        font-size: 12.6px;
    
        &:hover {
            color: #972c86;
        }
    }
`;

const MoreOption = styled.div`
    cursor: pointer;
    cursor: hand;
    margin-bottom: 5px;
    
    &:hover {
        color: #972c86;
    }
    
    svg {
        transition: all 0.3s;
        width: 15px;
        margin-left: 5px;
        
        &.ti-plus {
            transform: rotate(-540deg);
        }
        &.rotate-in {            
            transform: rotate(0deg);        
        }
    }
`;

const StyledDatePicker = styled(DatePicker)`
`;

const CreateEditWorkspacePostModal = props => {

    const {type, mode, item = {}} = props.data;

    const dispatch = useDispatch();
    const [modal, setModal] = useState(true);
    const user = useSelector(state => state.session.user);
    const activeTopic = useSelector(state => state.workspaces.activeTopic);
    const [showMoreOptions, setShowMoreOptions] = useState(null);
    const [maxHeight, setMaxHeight] = useState(null);
    const [draftId, setDraftId] = useState(null);
    const [showDropzone, setShowDropzone] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [form, setForm] = useState({
        must_read: false,
        reply_required: false,
        no_reply: false,
        is_private: false,
        has_folder: false,
        title: "",
        selectedUsers: [],
        selectedWorkspaces: [],
        body: "",
        textOnly: "",
        show_at: null,
        end_at: null,
    });
    const formRef = {
        reactQuillRef: useRef(null),
        more_options: useRef(null),
        dropzone: useRef(null),
        arrow: useRef(null),
    };
    const toggle = (saveDraft = true) => {
        if (saveDraft && mode !== "edit") {
            handleSaveDraft();
        }
        setModal(!modal);
        dispatch(
            clearModal({type: type}),
        );
    };

    const handleSelectUser = e => {
        if (e === null) {
            setForm({
                ...form,
                selectedUsers: [],
            });
        } else {
            setForm({
                ...form,
                selectedUsers: e,
            });
        }
    };

    const handleSelectWorkspace = e => {
        if (e === null) {
            setForm({
                ...form,
                selectedWorkspaces: [],
            });
        } else {
            setForm({
                ...form,
                selectedWorkspaces: e,
            });
        }
    };

    const handleNameChange = e => {
        setForm({
            ...form,
            title: e.target.value,
        });
    };

    const handleSaveDraft = () => {
        if (form.title == "" && form.body === "" && !form.selectedUsers.length) return;
        else {
            let timestamp = Math.floor(Date.now() / 1000);
            let payload = {
                type: "draft_post",
                form: {
                    ...form,
                    must_read: form.must_read ? 1 : 0,
                    must_reply: form.must_reply ? 1 : 0,
                    read_only: form.no_reply ? 1 : 0,
                    users_responsible: form.selectedUsers,
                },
                timestamp: timestamp,
                topic_id: activeTopic.id,
                id: timestamp,
                is_must_read: form.must_read ? 1 : 0,
                is_must_reply: form.must_reply ? 1 : 0,
                is_read_only: form.no_reply ? 1 : 0,
            };
            if (draftId) {
                payload = {
                    ...payload,
                    draft_id: draftId
                }
                dispatch(updateDraft(payload));
            } else {
                dispatch(saveDraft(payload));
            }
        }
    };

    const handleConfirm = () => {
        let payload = {
            title: form.title,
            body: form.body,
            responsible_ids: form.selectedUsers.map(u => u.value),
            type: "post",
            personal: 0,
            recipient_ids: form.selectedWorkspaces.filter(ws => ws.type !== "FOLDER").map(ws => ws.value),
            must_read: form.must_read ? 1 : 0,
            must_reply: form.must_reply ? 1 : 0,
            read_only: form.no_reply ? 1 : 0,
            workspace_ids: form.selectedWorkspaces.filter(ws => ws.type === "FOLDER").map(ws => ws.value),
            show_at: form.show_at ? moment(form.show_at, "YYYY-MM-DD").format("YYYY-MM-DD") : null,
            end_at: form.end_at ? moment(form.end_at, "YYYY-MM-DD").format("YYYY-MM-DD") : null
        };
        if (draftId) {
            dispatch(
                deleteDraft({
                    type: "draft_post",
                    draft_id: draftId
                })
            )
        }
        dispatch(postCreate(payload));
        toggle(false);
    };

    const handleQuillChange = (content, delta, source, editor) => {
        const textOnly = editor.getText(content);
        setForm({
            ...form,
            body: content,
            textOnly: textOnly,
        });
    };

    const toggleCheck = useCallback((e) => {
        const name = e.target.dataset.name;
        switch (name) {
            case "no_reply": {
                setForm(prevState => ({
                    ...prevState,
                    [name]: !prevState[name],
                    reply_required: !prevState[name] === true ? false : prevState["reply_required"],
                }));
                break;
            }
            case "reply_required": {
                setForm(prevState => ({
                    ...prevState,
                    [name]: !prevState[name],
                    no_reply: !prevState[name] === true ? false : prevState["no_reply"],
                }));
                break;
            }
            default: {
                setForm(prevState => ({
                    ...prevState,
                    [name]: !prevState[name],
                }));
            }
        }
    }, [setForm]);

    const toggleMoreOptions = () => {
        setShowMoreOptions(!showMoreOptions);
    };

    const [modules] = useQuillModules("workspace");

    useEffect(() => {
        if (item.workspace !== null && item.hasOwnProperty("draft")) {
            setForm(item.draft.form);
            setDraftId(item.draft.draft_id);
        } else if (item.workspace !== null) {
            setForm({
                ...form,
                selectedWorkspaces: [{
                    ...item.workspace,
                    value: item.workspace.id,
                    label: item.workspace.name,
                }],
                selectedUsers: [{
                    id: user.id,
                    value: user.id,
                    label: user.name,
                    name: user.name,
                    first_name: user.first_name,
                    profile_image_link: user.profile_image_link,
                }],
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(formRef.more_options);
    }, []);


    useEffect(() => {
        if (formRef.more_options.current !== null && maxHeight === null) {
            setMaxHeight(formRef.more_options.current.offsetHeight);
            setShowMoreOptions(false);
        }
    }, [formRef, setMaxHeight]);

    const handleSelectStartDate = useCallback(value => {
        setForm(f => ({
            ...f,
            show_at: value
        }))
    }, [setForm]);

    const handleSelectEndDate = useCallback(value => {
        setForm(f => ({
            ...f,
            end_at: value
        }))
    }, [setForm]);

    const handleOpenFileDialog = () => {
        if (formRef.dropzone.current) {
            formRef.dropzone.current.open();
        }
    };

    const handleHideDropzone = () => {
        setShowDropzone(false);
    };

    const handleShowDropzone = () => {
        setShowDropzone(true);
    };

    const dropAction = (acceptedFiles) => {

        let selectedFiles = [];
        acceptedFiles.forEach(file => {
            let shortFileId = require("shortid").generate();
            if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif" || file.type === "image/webp") {
                selectedFiles.push({
                    rawFile: file,
                    type: "IMAGE",
                    id: shortFileId,
                    status: false,
                    src: URL.createObjectURL(file),
                    name: file.name ? file.name : file.path,
                });
            } else if (file.type === "video/mp4") {
                selectedFiles.push({
                    rawFile: file,
                    type: "VIDEO",
                    id: shortFileId,
                    status: false,
                    src: URL.createObjectURL(file),
                    name: file.name ? file.name : file.path,
                });
            } else {
                selectedFiles.push({
                    rawFile: file,
                    type: "DOC",
                    id: shortFileId,
                    status: false,
                    src: URL.createObjectURL(file),
                    name: file.name ? file.name : file.path,
                });
            }
        });
        setAttachedFiles(prevState => [...prevState, ...selectedFiles]);
        handleHideDropzone();
    };

    const handleRemoveFile = useCallback((fileId) => {
        setAttachedFiles(prevState => prevState.filter(f => f.id !== fileId));
    }, [setAttachedFiles]);

    const [wsOptions, userOptions] = useGetWorkspaceAndUserOptions(form.selectedWorkspaces, item);

    return (

        <Modal isOpen={modal} toggle={toggle} centered size={"md"} autoFocus={false}>
            <ModalHeaderSection toggle={toggle}>
                {mode === "edit" ? "Edit post" : "Create new post"}
            </ModalHeaderSection>
            <ModalBody>
                <DropDocument
                    hide={!showDropzone}
                    ref={formRef.dropzone}
                    onDragLeave={handleHideDropzone}
                    onDrop={({acceptedFiles}) => {
                        dropAction(acceptedFiles);
                    }}
                    onCancel={handleHideDropzone}
                    attachedFiles={attachedFiles}
                />
                <WrapperDiv>
                    <Label for="post-title">Post title</Label>
                    <Input style={{borderRadius: "5px"}}
                           defaultValue={mode === "edit" ? "" : ""}
                           value={form.title}
                           onChange={handleNameChange}
                           autoFocus
                    />
                </WrapperDiv>
                <WrapperDiv>
                    <Label for="workspace">Workspace</Label>
                    <SelectWorkspace
                        options={wsOptions}
                        value={form.selectedWorkspaces}
                        onChange={handleSelectWorkspace}
                        isMulti={true}
                        isClearable={true}
                    />
                </WrapperDiv>
                <WrapperDiv>
                    <Label for="responsible">Responsible</Label>
                    <SelectPeople
                        options={userOptions}
                        value={form.selectedUsers}
                        onChange={handleSelectUser}
                    />
                </WrapperDiv>
                <WrapperDiv>
                    <Label for="firstMessage">Description</Label>
                    <DescriptionInput
                        showFileButton={true}
                        onChange={handleQuillChange}
                        onOpenFileDialog={handleOpenFileDialog}
                        defaultValue={mode === "edit" && item ? item.description : ""}
                        mode={mode}
                    />
                    {/* <StyledQuillEditor
                        className="group-chat-input"
                        modules={modules}
                        ref={formRef.reactQuillRef}
                        onChange={handleQuillChange}
                    /> */}
                </WrapperDiv>
                {
                    attachedFiles.length > 0 &&
                    <WrapperDiv className="file-attachment-wrapper">
                        <FileAttachments attachedFiles={attachedFiles} handleRemoveFile={handleRemoveFile}/>
                    </WrapperDiv>
                }
                <WrapperDiv className="more-option">
                    <MoreOption
                        onClick={toggleMoreOptions}>More options
                        <SvgIconFeather icon="chevron-down"
                                        className={`sub-menu-arrow ti-angle-up ${showMoreOptions ? "ti-minus rotate-in" : " ti-plus"}`}/></MoreOption>

                    <CheckBoxGroup ref={formRef.more_options} maxHeight={maxHeight}
                                   className={showMoreOptions === null ? "" : showMoreOptions ? "enter-active" : "leave-active"}>
                        <CheckBox name="must_read" checked={form.must_read} onClick={toggleCheck} type="success">Must
                            read</CheckBox>
                        <CheckBox name="reply_required" checked={form.reply_required} onClick={toggleCheck}
                                  type="danger">Reply required</CheckBox>
                        <CheckBox name="no_reply" checked={form.no_reply} onClick={toggleCheck} type="dark">No
                            replies</CheckBox>
                    </CheckBoxGroup>
                </WrapperDiv>
                <WrapperDiv>
                    <StyledDatePicker className={"start-date"} 
                        onChange={handleSelectStartDate}
                        value={form.show_at}
                    />
                    <StyledDatePicker className={"end-date"} 
                        onChange={handleSelectEndDate}
                        value={form.end_at}
                    />
                </WrapperDiv>
                <WrapperDiv>
                    <button
                        className="btn btn-primary"
                        disabled={form.selectedUsers.length === 0 || form.title === "" || form.selectedWorkspaces.length === 0}
                        onClick={handleConfirm}>
                        {mode === "edit" ? "Update workspace" : "Create post"}
                    </button>
                </WrapperDiv>
            </ModalBody>
        </Modal>
    );
};

export default CreateEditWorkspacePostModal;