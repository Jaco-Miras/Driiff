import React, {forwardRef, useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Input, InputGroup, Label, Modal, ModalBody} from "reactstrap";
import styled from "styled-components";
import toaster from "toasted-notes";
import {setPendingUploadFilesToWorkspace} from "../../redux/actions/fileActions";
import {clearModal} from "../../redux/actions/globalActions";
import {createWorkspace, updateWorkspace} from "../../redux/actions/workspaceActions";
import {FileAttachments} from "../common";
import {DropDocument} from "../dropzone/DropDocument";
import {CheckBox, DescriptionInput, FolderSelect, InputFeedback, PeopleSelect} from "../forms";
import {ModalHeaderSection} from "./index";

const WrapperDiv = styled(InputGroup)`
    display: flex;
    align-items: center;
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
`;

const ActiveTabName = styled.span`
    color: #505050;
    font-size: 10px;
    font-weight: 400;    
    margin-left: 13px;
    
    &::before{
        content: '';
        display: inline-block;
        width: 4px;
        height: 4px;
        -moz-border-radius: 7.5px;
        -webkit-border-radius: 7.5px;
        border-radius: 7.5px;
        background-color: #B8B8B8;
        margin-right: 9px;
    }
`;

const CreateEditWorkspaceModal = forwardRef((props, ref) => {

    const {type, mode, item = {}} = props.data;

    const dispatch = useDispatch();
    const [modal, setModal] = useState(true);
    const user = useSelector(state => state.session.user);
    const users = useSelector(state => state.users.mentions);
    const workspaces = useSelector(state => state.workspaces.workspaces);
    const activeTab = useSelector(state => state.workspaces.activeTab);
    const [activeTabName, setActiveTabName] = useState("Internal");
    const [form, setForm] = useState({
        is_private: false,
        has_folder: Object.keys(item).length === 0 ? false : true,
        name: "",
        selectedUsers: [],
        selectedFolder: Object.keys(item).length === 0 ? null : {
            value: item.id,
            label: item.name,
        },
        description: "",
        textOnly: "",
    });
    const [showDropzone, setShowDropzone] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [valid, setValid] = useState({
        name: null,
        has_folder: null,
        team: null,
    });
    const [feedback, setFeedback] = useState({
        name: "",
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

        if ((form.has_folder && (form.selectedFolder === null || Object.values(workspaces[form.selectedFolder.value].topics)
                .filter(t => t.name.toLowerCase() === form.name.toLowerCase()).length !== 0))
            || Object.values(workspaces)
                .filter(w => w.name.toLowerCase() === form.name.toLowerCase()).length !== 0) {
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

    const folderOptions = Object.values(workspaces).filter(ws => ws.type === "FOLDER").map(ws => {
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

    const handleNameFocus = (e) => {
        setFeedback(prevState => ({
            ...prevState, name: "",
        }));
        setValid(prevState => ({
            ...prevState, name: null,
        }));
    };

    const handleNameBlur = (e) => {
        _validateName();
    };

    const handleConfirm = () => {
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
                let userFound = false;
                form.selectedUsers.forEach(u => {
                    if (u.id === m.id) {
                        userFound = true;
                        return;
                    }
                });
                return !userFound;
            }).map(m => m.id);

            const added_members = form.selectedUsers.filter(u => {
                let userFound = false;
                item.members.forEach(m => {
                    if (m.id === u.id) {
                        userFound = true;
                        return;
                    }
                });
                return !userFound;
            }).map(m => m.id);

            payload = {
                ...payload,
                workspace_id: form.selectedFolder ? form.selectedFolder.value : 0,
                topic_id: item.id,
                removed_member_ids: removed_members,
                new_member_ids: added_members,
            }
            dispatch(updateWorkspace(payload))
        } else {
            dispatch(
                createWorkspace(payload, (err, res) => {
                    if (err) {
                        console.log(err);
                        setLoading(false);
                        toaster.notify(
                            <span>Workspace creation failed.<br/>Please try again.</span>,
                            {position: "bottom-left"});
                    }
    
                    if (res) {
                        let formData = new FormData();
                        for (const i in attachedFiles) {
                            formData.append("files[" + i + "]", attachedFiles[i].rawFile);
                        }
    
                        dispatch(
                            setPendingUploadFilesToWorkspace({
                                is_primary: 1,
                                topic_id: 199,
                                files: formData,
                            }),
                        );
    
                        toaster.notify(
                            <span><b>{form.name}</b> workspace is created
                                {
                                    form.selectedFolder !== null &&
                                    <> <b>{form.selectedFolder.label}</b> under directory</>
                                }.
                            </span>,
                            {position: "bottom-left"});
                        toggle();
                    }
                }));
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
    }, [setForm]);

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

    const handleRemoveFile = (e) => {
        setAttachedFiles(prevState => attachedFiles.filter(f => f.id !== e.currentTarget.dataset.fileId));
    };

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
            let is_private = false;
            if (item.members.length) {
                members = item.members.map(m => {
                    return {
                        ...m,
                        value: m.id,
                        label: m.name
                    }
                })
            }
            if (item.type !== undefined && item.type === "WORKSPACE") {
                is_private = item.is_lock === 1 ? true : false
            } else {
                is_private = item.private === 1 ? true : false
            }
            setForm({
                ...form,
                has_folder: item.workspace_id !== undefined ? true : false,
                selectedUsers: members,
                selectedFolder: item.workspace_id !== undefined ? {
                    value: item.workspace_id,
                    label: item.workspace_name
                }
                : null,
                description: item.description,
                textOnly: item.description,
                name: item.name,
                is_private: is_private
            });
            setValid({
                name: true,
                folder: true,
                team: true,
            });
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
            setActiveTabName("Internal");
        } else {
            setActiveTabName("External");
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
                {mode === "edit" ? "Edit workspace" : "Create new workspace"}
                <ActiveTabName className="intern-extern">{activeTabName}</ActiveTabName>
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
                    <Label for="has_folder"></Label>
                    <CheckBox
                        type="success" name="has_folder"
                        checked={form.has_folder} onClick={toggleCheck}>Add folder</CheckBox>
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
                    showFileButton={true}
                    onChange={handleQuillChange}
                    onOpenFileDialog={handleOpenFileDialog}
                    defaultValue={mode === "edit" && item ? item.description : ""}
                    mode={mode}
                />
                {
                    attachedFiles.length > 0 &&
                    <WrapperDiv className="file-attachment-wrapper">
                        <FileAttachments attachedFiles={attachedFiles} handleRemoveFile={handleRemoveFile}/>
                    </WrapperDiv>
                }
                <WrapperDiv className="action-wrapper">
                    <Label/>
                    <CheckBox
                        name="is_private"
                        checked={form.is_private} onClick={toggleCheck}>Lock workspace</CheckBox>
                    <button
                        className="btn btn-primary"
                        disabled={Object.values(valid).filter(v => !v).length}
                        onClick={handleConfirm}>
                        {
                            loading &&
                            <span className="spinner-border spinner-border-sm mr-2" role="status"
                                  aria-hidden="true"></span>
                        }
                        {mode === "edit" ? "Update workspace" : "Create workspace"}
                    </button>
                </WrapperDiv>
            </ModalBody>
        </Modal>
    );
});

export default CreateEditWorkspaceModal;