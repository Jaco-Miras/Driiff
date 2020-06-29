import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {Input, InputGroup, Label, Modal, ModalBody} from "reactstrap";
import styled from "styled-components";
import {replaceChar} from "../../helpers/stringFormatter";
import {setPendingUploadFilesToWorkspace} from "../../redux/actions/fileActions";
import {clearModal} from "../../redux/actions/globalActions";
import {fetchTimeline, updateWorkspace, createWorkspace} from "../../redux/actions/workspaceActions";
import {FileAttachments} from "../common";
import {DropDocument} from "../dropzone/DropDocument";
import {CheckBox, DescriptionInput, FolderSelect, InputFeedback, PeopleSelect} from "../forms";
import {ModalHeaderSection} from "./index";
import {useToaster} from "../hooks";

const WrapperDiv = styled(InputGroup)`
    display: flex;
    align-items: baseline;
    margin-bottom: 20px;

    > .form-control:not(:first-child) {
        border-radius: 5px;
    }

    .input-feedback {
        margin-left: 130px;
    }

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
    .files {
        width: 320px;
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
    &.file-attachment-wrapper {
        margin-top: 30px;
        margin-bottom: -20px;
        
    }
    &.action-wrapper {
        margin-top: 40px;
    }
`;

const SelectFolder = styled(FolderSelect)`
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

const CreateEditWorkspaceModal = (props) => {

    const {type, mode, item = null} = props.data;

    const history = useHistory();
    const dispatch = useDispatch();
    const toaster = useToaster();
    const [modal, setModal] = useState(true);
    const user = useSelector(state => state.session.user);
    const users = useSelector(state => state.users.mentions);
    const workspaces = useSelector(state => state.workspaces.workspaces);
    const activeTab = useSelector(state => state.workspaces.activeTab);
    const [activeTabName, setActiveTabName] = useState("Internal");
    const [form, setForm] = useState({
        is_private: false,
        has_folder: item !== null,
        name: "",
        selectedUsers: [],
        selectedFolder: item === null ? null : {
            value: item.id,
            label: item.name,
        },
        description: "",
        textOnly: "",
    });
    const [showDropzone, setShowDropzone] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [valid, setValid] = useState({
        name: null,
        description: null,
        has_folder: null,
        team: null,
    });
    const [feedback, setFeedback] = useState({
        name: "",
        description: "",
        folder: "",
        team: "",
    });
    const formRef = {
        dropzoneRef: useRef(),
    };

    const _validateName = useCallback(() => {
        if (form.name === "") {
            setFeedback(prevState => ({
                ...prevState, name: "Workspace name is required.",
            }));
            setValid(prevState => ({
                ...prevState, name: false,
            }));
            return false;
        }

        if ((form.has_folder &&
            form.selectedFolder !== null &&
            Object.values(workspaces[form.selectedFolder.value].topics).some(t => {
                if (mode === "edit") {
                    return t.id === item.id ? false : t.name.toLowerCase() === form.name.toLowerCase();
                } else {
                    return t.name.toLowerCase() === form.name.toLowerCase();
                }
            }))
            ||
            Object.values(workspaces).some(w => {
                if (mode === "edit") {
                    return w.id === item.id ? false : w.name.toLowerCase() === form.name.toLowerCase();
                } else {
                    return w.name.toLowerCase() === form.name.toLowerCase();
                }
            })) {
            setFeedback(prevState => {
                return {...prevState, name: "Workspace name already exists."};
            });
            setValid(prevState => {
                return {...prevState, name: true};
            });
            return true;
        }

        setFeedback(prevState => {
            return {...prevState, name: ""};
        });

        setValid(prevState => {
            return {...prevState, name: true};
        });
    }, [form.name, form.has_folder, form.selectedFolder, workspaces, setValid, setFeedback]);

    const toggle = () => {
        setModal(!modal);
        dispatch(
            clearModal({type: type}),
        );
    };

    const toggleCheck = (e) => {
        const name = e.target.dataset.name;
        const checked = !form[name];

        setForm(prevState => {
            return {...prevState, [name]: checked};
        });
    };

    const userOptions = Object.values(users).map(u => {
        return {
            ...u,
            value: u.id,
            label: u.name,
        };
    });

    const folderOptions = Object.values(workspaces).filter(ws => ws.type === "FOLDER")
        .filter(ws => {
            if (activeTab === "extern") return ws.is_external === 1;
            else return ws.is_external === 0;
        }).map(ws => {
            return {
                value: ws.id,
                label: ws.name,
            };
        });

    const handleSelectUser = e => {
        if (e === null) {
            setForm(prevState => ({
                ...prevState,
                selectedUsers: [],
            }));
            setValid(prevState => ({
                ...prevState,
                team: false,
            }));
        } else {
            setForm(prevState => ({
                ...prevState,
                selectedUsers: e,
            }));
            setValid(prevState => ({
                ...prevState,
                team: true,
            }));
        }
    };

    const handleSelectFolder = e => {
        setForm(prevState => ({
            ...prevState,
            selectedFolder: e,
        }));
    };

    const handleNameChange = e => {
        e.persist();
        setForm(prevState => ({
            ...prevState, name: e.target.value.trim(),
        }));
    };

    const handleNameFocus = () => {
        setFeedback(prevState => ({
            ...prevState, name: "",
        }));
        setValid(prevState => ({
            ...prevState, name: null,
        }));
    };

    const handleNameBlur = () => {
        _validateName();
    };

    const handleConfirm = () => {
        if (Object.values(valid).filter(v => !v).length)
            return;

        setLoading(true);
        let payload = {
            name: form.name,
            description: form.description,
            is_external: activeTab === "extern" ? 1 : 0,
            member_ids: form.selectedUsers.map(u => u.id),
            is_lock: form.is_private ? 1 : 0,
        };
        if (form.selectedFolder) {
            payload = {
                ...payload,
                workspace_id: form.selectedFolder.value,
            };
        }

        if (mode === "edit") {
            const removed_members = item.members.filter(m => {
                for (const i in form.selectedUsers) {
                    if (form.selectedUsers.hasOwnProperty(i)) {
                        if (form.selectedUsers[i].id === m.id) {
                            return false;
                        }
                    }
                }
                return true;
            }).map(m => m.id);

            const added_members = form.selectedUsers.filter(u => {
                for (const i in item.members) {
                    if (item.members.hasOwnProperty(i)) {
                        if (item.members[i].id === u.id) {
                            return false;
                        }
                    }
                }
                return true;
            }).map(m => m.id);

            payload = {
                ...payload,
                workspace_id: form.selectedFolder ? form.selectedFolder.value : 0,
                topic_id: item.id,
                remove_member_ids: removed_members,
                new_member_ids: added_members,
                system_message: `CHANNEL_UPDATE::${
                    JSON.stringify({
                        author: {
                            id: user.id,
                            name: user.name,
                            partial_name: user.partial_name,
                            profile_image_link: user.profile_image_link,
                        },
                        title: form.name === item.title ? "" : form.name,
                        added_members: added_members,
                        removed_members: removed_members,
                    })}`,
            };
            const cb = (err, res) => {
                if (err) return;
                if (attachedFiles.length) {
                    let formData = new FormData();
                    for (const i in attachedFiles) {
                        formData.append("files[" + i + "]", attachedFiles[i].rawFile);
                    }

                    dispatch(
                        setPendingUploadFilesToWorkspace({
                            is_primary: 1,
                            topic_id: res.data.id,
                            files: formData,
                        }),
                    );
                }
                if (form.selectedFolder) {
                    history.push(`/workspace/dashboard/${form.selectedFolder.value}/${replaceChar(form.selectedFolder.label)}/${res.data.id}/${replaceChar(form.name)}`);
                } else {
                    history.push(`/workspace/dashboard/${res.data.id}/${replaceChar(form.name)}`);
                }
                dispatch(
                    fetchTimeline({topic_id: item.id}),
                );
            };
            dispatch(updateWorkspace(payload, cb));
        } else {
            dispatch(
             createWorkspace(payload, (err, res) => {
                if (err) {
                    console.log(err);
                    setLoading(false);
                    toaster.warning(
                        <span>Workspace creation failed.<br/>Please try again.</span>,
                    {position: "bottom-left"});
                }

                if (res) {
                    if (attachedFiles.length) {
                        let formData = new FormData();
                        for (const i in attachedFiles) {
                            formData.append("files[" + i + "]", attachedFiles[i].rawFile);
                        }

                        dispatch(
                            setPendingUploadFilesToWorkspace({
                                is_primary: 1,
                                topic_id: res.data.id,
                                files: formData,
                            }),
                        );
                    }
                    //redirect url
                    if (form.selectedFolder) {
                        history.push(`/workspace/dashboard/${form.selectedFolder.value}/${replaceChar(form.selectedFolder.label)}/${res.data.id}/${replaceChar(form.name)}`);
                    } else {
                        history.push(`/workspace/dashboard/${res.data.id}/${replaceChar(form.name)}`);
                    }

                    toaster.success(
                        <span><b>{form.name}</b> workspace is created
                        {
                            form.selectedFolder !== null &&
                            <> <b>{form.selectedFolder.label}</b> under directory</>
                        }.
                        </span>,
                    {position: "bottom-left"});
                }
            })
            );
        }
        toggle();
    };

    const handleQuillChange = useCallback((content, delta, source, editor) => {
        const textOnly = editor.getText(content);
        setForm(prevState => ({
            ...prevState,
            description: content,
            textOnly: textOnly,
        }));

        if (textOnly.trim() === "") {
            setFeedback(prevState => ({
                ...prevState, description: "Description is required.",
            }));
            setValid(prevState => ({
                ...prevState, description: false,
            }));
        } else {
            setValid(prevState => ({
                ...prevState, description: true,
            }));
        }
    }, [setForm, setFeedback, setValid]);

    const handleOpenFileDialog = () => {
        if (formRef.dropzoneRef.current) {
            formRef.dropzoneRef.current.open();
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

    useEffect(() => {
        let currentUser = null;
        if (Object.values(users).length) {
            currentUser = {
                ...users[user.id],
                value: user.id,
                label: user.name,
            };
        }
        if (mode === "edit") {
            let members = [];
            let is_private = item.type !== undefined && item.type === "WORKSPACE" ? item.is_lock === 1 : item.private === 1;
            if (item.members.length) {
                members = item.members.map(m => {
                    return {
                        value: m.id,
                        label: m.name,
                        name: m.name,
                        id: m.id,
                        first_name: m.first_name,
                        profile_image_link: m.profile_image_link,
                    };
                });
            }
            setForm({
                ...form,
                has_folder: item.workspace_id !== undefined,
                selectedUsers: members,
                selectedFolder: item.workspace_id !== undefined ? {
                        value: item.workspace_id,
                        label: item.workspace_name,
                    }
                                                                : null,
                description: item.description,
                textOnly: item.description,
                name: item.name,
                is_private: is_private,
            });
            setValid({
                name: true,
                folder: true,
                team: true,
            });
            if (item.hasOwnProperty("primary_files")) {
                setUploadedFiles(item.primary_files);
            }
        } else {
            setForm(prevState => ({
                ...prevState,
                selectedUsers: currentUser ? [currentUser] : [],
            }));

            setValid(prevState => ({
                ...prevState,
                team: currentUser ? true : null,
                name: null,
            }));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (activeTab !== "extern") {
            setActiveTabName("internal");
        } else {
            setActiveTabName("external");
        }
    }, [activeTab]);

    useEffect(() => {
        let folderValid = true;
        if (form.has_folder && form.selectedFolder === null) {
            folderValid = false;
        }
        setValid(prevState => ({
            ...prevState,
            has_folder: folderValid,
        }));

        _validateName();
    }, [form.has_folder, form.selectedFolder]);

    return (
        <Modal isOpen={modal} toggle={toggle} centered size={"md"} autoFocus={false}>
            <ModalHeaderSection toggle={toggle}>
                {mode === "edit" ? "Edit " + activeTabName + " workspace" : "Create new " + activeTabName + " workspace"}
            </ModalHeaderSection>
            <ModalBody onDragOver={handleShowDropzone}>
                <DropDocument
                    hide={!showDropzone}
                    ref={formRef.dropzoneRef}
                    onDragLeave={handleHideDropzone}
                    onDrop={({acceptedFiles}) => {
                        dropAction(acceptedFiles);
                    }}
                    onCancel={handleHideDropzone}
                    attachedFiles={attachedFiles}
                />
                <WrapperDiv>
                    <Label for="chat">
                        Worskpace name</Label>
                    <Input
                        name="name"
                        defaultValue={mode === "edit" ? item.name : ""}
                        onFocus={handleNameFocus}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        valid={valid.name}
                        invalid={valid.name !== null && !valid.name}
                        autoFocus
                    />
                    <InputFeedback valid={valid.name}>{feedback.name}</InputFeedback>
                </WrapperDiv>
                <WrapperDiv>
                    <Label for="has_folder"/>
                    <CheckBox
                        type="success" name="has_folder"
                        checked={form.has_folder} onClick={toggleCheck}>Add to folder</CheckBox>
                </WrapperDiv>
                {
                    form.has_folder === true &&
                    <WrapperDiv>
                        <Label for="people">Folder</Label>
                        <SelectFolder
                            options={folderOptions}
                            value={form.selectedFolder}
                            onChange={handleSelectFolder}
                            isMulti={false}
                            isClearable={true}
                        />
                        <InputFeedback valid={valid.has_folder}>{feedback.has_folder}</InputFeedback>
                    </WrapperDiv>
                }
                <WrapperDiv>
                    <Label for="people">Team</Label>
                    <SelectPeople
                        valid={valid.team}
                        options={userOptions}
                        value={form.selectedUsers}
                        onChange={handleSelectUser}
                    />
                    <InputFeedback valid={valid.user}>{feedback.user}</InputFeedback>
                </WrapperDiv>
                <DescriptionInput
                    required
                    showFileButton={true}
                    onChange={handleQuillChange}
                    onOpenFileDialog={handleOpenFileDialog}
                    defaultValue={mode === "edit" && item ? item.description : ""}
                    mode={mode}
                    valid={valid.description}
                    feedback={feedback.description}
                />
                {
                    (attachedFiles.length > 0 || uploadedFiles.length > 0) &&
                    <WrapperDiv className="file-attachment-wrapper">
                        <FileAttachments attachedFiles={[...attachedFiles, ...uploadedFiles]}
                                         handleRemoveFile={handleRemoveFile}/>
                    </WrapperDiv>
                }
                <WrapperDiv className="action-wrapper">
                    <Label/>
                    <CheckBox
                        name="is_private"
                        checked={form.is_private} onClick={toggleCheck}>Lock workspace</CheckBox>
                    <button
                        className="btn btn-primary"
                        onClick={handleConfirm}>
                        {
                            loading &&
                            <span className="spinner-border spinner-border-sm mr-2" role="status"
                                  aria-hidden="true"/>
                        }
                        {mode === "edit" ? "Update workspace" : "Create workspace"}
                    </button>
                </WrapperDiv>
            </ModalBody>
        </Modal>
    );
};

export default React.memo(CreateEditWorkspaceModal);