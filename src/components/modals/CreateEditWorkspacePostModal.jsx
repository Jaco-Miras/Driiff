import moment from "moment";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import styled from "styled-components";
import {clearModal, deleteDraft, saveDraft, updateDraft} from "../../redux/actions/globalActions";
import {postCreate, putPost} from "../../redux/actions/postActions";
import {uploadDocument} from "../../redux/services/global";
import {DatePicker, FileAttachments, SvgIconFeather} from "../common";
import {DropDocument} from "../dropzone/DropDocument";
import {CheckBox, DescriptionInput, FolderSelect, PeopleSelect} from "../forms";
import {useGetWorkspaceAndUserOptions} from "../hooks";
import {ModalHeaderSection} from "./index";

const WrapperDiv = styled(InputGroup)`
    display: flex;
    align-items: baseline;
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
    &.schedule-post {
        ${"" /* margin-left: 130px; */}
        width: 100%;
        ${"" /* margin-right: -130px; */}
        label {
            margin: 0 20px 0 0;
        }
        .feather {
            color: #c7ced6;
        }
        .react-date-picker__wrapper {
            border: thin solid #c8ced5;
            border-radius: 4px;
            color: #c7ced6;
            .react-date-picker__inputGroup {
                padding: 0 6px;
            }
        }
        #placeholder {
            color: #c7ced6;
        }
        input {
            color: #505050;
            &::-webkit-input-placeholder {
                color: #c7ced6;
            }

        }
    }
    &.file-attachment-wrapper {
        margin-top: 0;
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
    .react-select__control--menu-is-open {
        border-color: #7a1b8b !important;
        box-shadow: none;
    }
    .react-select__option {
        background-color: #ffffff;
    }
    .react-select__menu-list--is-multi > div {
        &:hover {
            background: #8C3B9B;
            color: #ffffff;
            cursor: pointer;
            .react-select__option {
                background: #8C3B9B;
                cursor: pointer;
            }
        }
    }
    .react-select__control--is-focused {
        border-color: #7a1b8b !important;
        box-shadow: none;
    }
`;

const CheckBoxGroup = styled.div`
    ${"" /* display: flex; */}
    overflow: hidden;
    transition: all .3s ease;
    width: 100%;

    &.enter-active {
        max-height: ${props => props.maxHeight}px;
        overflow: visible;
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
    const [uploadedFiles, setUploadedFiles] = useState([]);
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

    const [nestedModal, setNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(false);

    const toggleNested = () => {
        setNestedModal(!nestedModal);
        setCloseAll(false);
    };

    const toggleAll = (saveDraft = false) => {
        setNestedModal(!nestedModal);
        setCloseAll(true);
        if (saveDraft && mode !== "edit") {
            handleSaveDraft();
        }
        setModal(!modal);
        dispatch(
            clearModal({type: type}),
        );
    };

    const toggle = () => {
        toggleNested();
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
        if (!(form.title === "" && form.body === "" && !form.selectedUsers.length)) {
            let timestamp = Math.floor(Date.now() / 1000);
            let payload = {
                type: "draft_post",
                form: {
                    ...form,
                    must_read: form.must_read ? 1 : 0,
                    must_reply: form.reply_required ? 1 : 0,
                    read_only: form.no_reply ? 1 : 0,
                    users_responsible: form.selectedUsers,
                },
                timestamp: timestamp,
                topic_id: activeTopic.id,
                id: timestamp,
                is_must_read: form.must_read ? 1 : 0,
                is_must_reply: form.must_reply ? 1 : 0,
                is_read_only: form.no_reply ? 1 : 0,
                created_at: {timestamp: timestamp},
            };
            if (draftId) {
                payload = {
                    ...payload,
                    draft_id: draftId,
                };
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
            must_reply: form.reply_required ? 1 : 0,
            read_only: form.no_reply ? 1 : 0,
            workspace_ids: form.selectedWorkspaces.filter(ws => ws.type === "FOLDER").map(ws => ws.value),
            show_at: form.show_at ? moment(form.show_at, "YYYY-MM-DD").format("YYYY-MM-DD") : form.end_at ? moment(new Date()).add(1, "day").format("YYYY-MM-DD") : null,
            end_at: form.end_at ? moment(form.end_at, "YYYY-MM-DD").format("YYYY-MM-DD") : null,
            tag_ids: [],
            file_ids: [],
        };
        if (draftId) {
            dispatch(
                deleteDraft({
                    type: "draft_post",
                    draft_id: draftId,
                }),
            );
        }
        if (mode === "edit") {
            payload = {
                ...payload,
                id: item.post.id,
                file_ids: uploadedFiles.map(f => f.id),
            };
            if (attachedFiles.length) {
                uploadFiles(payload, "edit");
            } else {
                dispatch(putPost(payload));
            }
        } else {
            if (attachedFiles.length) {
                uploadFiles(payload, "create");
            } else {
                dispatch(postCreate(payload));
            }
        }
        toggleAll(false);
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

    useEffect(() => {
        if (activeTopic !== null && item.hasOwnProperty("draft")) {
            setForm(item.draft.form);
            setDraftId(item.draft.draft_id);
        } else if (activeTopic !== null && mode !== "edit") {
            setForm({
                ...form,
                selectedWorkspaces: [{
                    ...activeTopic,
                    value: activeTopic.id,
                    label: activeTopic.name,
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
        } else if (mode === "edit" && item.hasOwnProperty("post")) {
            setForm({
                ...form,
                body: item.post.body,
                textOnly: item.post.body,
                title: item.post.title,
                hast_folder: activeTopic.hasOwnProperty("workspace_id"),
                no_reply: item.post.is_read_only,
                must_read: item.post.is_must_read,
                reply_required: item.post.is_must_reply,
                selectedWorkspaces: [{
                    ...activeTopic,
                    value: activeTopic.id,
                    label: activeTopic.name,
                }],
                selectedUsers: item.post.users_responsible.map(u => {
                    return {
                        ...u,
                        value: u.id,
                        label: u.name,
                    };
                }),
                file_ids: item.post.files.map(f => f.id),
            });
            setUploadedFiles(item.post.files.map(f => {
                return {
                    ...f,
                    rawFile: f,
                };
            }));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(formRef.more_options);
    }, []);


    useEffect(() => {
        if (formRef.more_options.current !== null && maxHeight === null && draftId === null) {
            setMaxHeight(formRef.more_options.current.offsetHeight);
            setShowMoreOptions(!!(item.post !== null && (item.post.is_read_only || item.post.is_must_read || item.post.is_must_reply)));
        }
    }, [formRef, setMaxHeight]);

    const handleSelectStartDate = useCallback(value => {
        setForm(f => ({
            ...f,
            show_at: value,
        }));
    }, [setForm]);

    const handleSelectEndDate = useCallback(value => {
        setForm(f => ({
            ...f,
            end_at: value,
        }));
    }, [setForm]);

    const handleOpenFileDialog = () => {
        if (formRef.dropzone.current) {
            formRef.dropzone.current.open();
        }
    };

    const handleHideDropzone = () => {
        setShowDropzone(false);
    };

    const dropAction = (acceptedFiles) => {

        let selectedFiles = [];

        acceptedFiles.forEach(file => {
            var bodyFormData = new FormData();
            bodyFormData.append("file", file);
            let shortFileId = require("shortid").generate();
            if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif" || file.type === "image/webp") {
                selectedFiles.push({
                    rawFile: file,
                    bodyFormData: bodyFormData,
                    type: "IMAGE",
                    id: shortFileId,
                    status: false,
                    src: URL.createObjectURL(file),
                    name: file.name ? file.name : file.path,
                });
            } else if (file.type === "video/mp4") {
                selectedFiles.push({
                    rawFile: file,
                    bodyFormData: bodyFormData,
                    type: "VIDEO",
                    id: shortFileId,
                    status: false,
                    src: URL.createObjectURL(file),
                    name: file.name ? file.name : file.path,
                });
            } else {
                selectedFiles.push({
                    rawFile: file,
                    bodyFormData: bodyFormData,
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

    async function uploadFiles(payload, type = "create") {
        await Promise.all(
            attachedFiles.map(file => uploadDocument({
                    user_id: user.id,
                    file: file.bodyFormData,
                    file_type: "private",
                    folder_id: null,
                }),
            ),
        ).then(result => {
            if (type === "edit") {
                payload = {
                    ...payload,
                    file_ids: [...result.map(res => res.data.id), ...payload.file_ids],
                };
                dispatch(putPost(payload));
            } else {
                payload = {
                    ...payload,
                    file_ids: result.map(res => res.data.id),
                };
                dispatch(postCreate(payload));
            }
        });
    }

    const handleRemoveFile = useCallback((fileId) => {
        setAttachedFiles(prevState => prevState.filter(f => f.id !== fileId));
    }, [setAttachedFiles]);

    const [wsOptions, userOptions] = useGetWorkspaceAndUserOptions(form.selectedWorkspaces, activeTopic);

    return (

        <Modal isOpen={modal} toggle={toggle} centered size={"md"} autoFocus={false}>
            <ModalHeaderSection toggle={toggle}>
                {mode === "edit" ? "Edit post" : "Create new post"}
            </ModalHeaderSection>
            <ModalBody>
                <Modal isOpen={nestedModal} toggle={toggleNested} onClosed={closeAll ? toggle : undefined} centered>
                    <ModalHeader>Save as draft</ModalHeader>
                    <ModalBody>Not sure about the content? Save it as a draft.</ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => toggleAll(true)}>Save</Button>
                        <Button color="secondary" onClick={toggleAll}>Discard</Button>
                    </ModalFooter>
                </Modal>
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
                <DescriptionInput
                    required
                    showFileButton={true}
                    onChange={handleQuillChange}
                    onOpenFileDialog={handleOpenFileDialog}
                    defaultValue={mode === "edit" ? item.post.body : ""}
                    mode={mode}
                    /*valid={valid.description}
                     feedback={feedback.description}*/
                />
                {
                    (attachedFiles.length > 0 || uploadedFiles.length > 0) &&
                    <WrapperDiv className="file-attachment-wrapper">
                        <FileAttachments attachedFiles={[...attachedFiles, ...uploadedFiles]}
                                         handleRemoveFile={handleRemoveFile}/>
                    </WrapperDiv>
                }
                <WrapperDiv className="more-option">
                    <MoreOption
                        onClick={toggleMoreOptions}>More options
                        <SvgIconFeather icon="chevron-down"
                                        className={`sub-menu-arrow ti-angle-up ${showMoreOptions ? "ti-minus rotate-in" : " ti-plus"}`}/></MoreOption>

                    <CheckBoxGroup ref={formRef.more_options} maxHeight={maxHeight}
                                   className={showMoreOptions === null ? "" : showMoreOptions ? "enter-active" : "leave-active"}>
                        <div className="d-flex">
                            <CheckBox name="must_read" checked={form.must_read} onClick={toggleCheck} type="danger">Must
                                read</CheckBox>
                            <CheckBox name="reply_required" checked={form.reply_required} onClick={toggleCheck}
                                      type="warning">Reply required</CheckBox>
                            <CheckBox name="no_reply" checked={form.no_reply} onClick={toggleCheck} type="info">No
                                replies</CheckBox>
                        </div>

                        <WrapperDiv className="schedule-post">
                            <Label>Schedule post</Label>
                            <SvgIconFeather className="mr-2" width={18} icon="calendar"/>
                            <StyledDatePicker
                                className="mr-2 start-date"
                                onChange={handleSelectStartDate}
                                value={form.show_at}
                                minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                            />
                            <StyledDatePicker
                                className="end-date"
                                onChange={handleSelectEndDate}
                                value={form.end_at}
                                minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                            />
                        </WrapperDiv>

                    </CheckBoxGroup>


                </WrapperDiv>
                <WrapperDiv>
                    <button
                        className="btn btn-primary"
                        disabled={form.selectedUsers.length === 0 || form.title === "" ||
                        form.textOnly.trim() === "" || form.selectedWorkspaces.length === 0}
                        onClick={handleConfirm}>
                        {mode === "edit" ? "Update post" : "Create post"}
                    </button>
                </WrapperDiv>
            </ModalBody>
        </Modal>
    );
};

export default CreateEditWorkspacePostModal;