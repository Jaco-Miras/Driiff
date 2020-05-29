import React, {forwardRef, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Input, InputGroup, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import {createWorkspace} from "../../redux/actions/workspaceActions";
import {uploadDocument} from "../../redux/services/global";
import {FileAttachments} from "../common";
import {DropDocument} from "../dropzone/DropDocument";
import {CheckBox, DescriptionInput, FolderSelect, PeopleSelect} from "../forms";
import {ModalHeaderSection} from "./index";

const WrapperDiv = styled(InputGroup)`
    display: flex;
    align-items: center;
    margin: ${props => props.margin ? props.margin : "20px 0"};

    > .form-control:not(:first-child) {
        border-radius: 5px;
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

    const dropzoneRef = useRef();
    const dispatch = useDispatch();
    const [modal, setModal] = useState(true);
    const user = useSelector(state => state.session.user);
    const users = useSelector(state => state.users.mentions);
    const workspaces = useSelector(state => state.workspaces.workspaces);
    const activeTab = useSelector(state => state.workspaces.activeTab);
    const [activeTabName, setActiveTabName] = useState("Internal");
    const [form, setForm] = useState({
        is_private: false,
        has_folder: false,
        name: "",
        selectedUsers: [],
        selectedFolder: null,
        description: "",
        textOnly: "",
    });
    const [showDropzone, setShowDropzone] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [valid, setValid] = useState({
        name: false,
        folder: false,
        team: false,
    });

    const _validateName = () => {
        if (form.name === ""
            || (form.has_folder && (form.selectedFolder === null || Object.values(workspaces[form.selectedFolder.value].topics)
                .filter(t => t.name.toLowerCase() === form.name.toLowerCase()).length !== 0))
            || Object.values(workspaces)
                .filter(w => w.name.toLowerCase() === form.name.toLowerCase()).length !== 0) {
            return false;
        } else {
            return true;
        }
    };

    const toggle = () => {
        setModal(!modal);
        dispatch(
            clearModal({type: type}),
        );
    };

    const toggleCheck = (e) => {
        const name = e.target.dataset.name;
        const checked = !form[name];
        setForm({
            ...form,
            [name]: checked,
            selectedFolder: name === "has_folder" && !checked ? null : form.selectedFolder,
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
            setForm({
                ...form,
                selectedUsers: [],
            });
            setValid({
                ...valid,
                team: false,
            });
        } else {
            setForm({
                ...form,
                selectedUsers: e,
            });
            setValid({
                ...valid,
                team: true,
            });
        }
    };

    const handleSelectFolder = e => {
        setForm({
            ...form,
            selectedFolder: e,
        });
    };

    const handleNameChange = e => {
        setValid({
            ...valid,
            name: false,
        });
        setForm({
            ...form,
            name: e.target.value.trim(),
        });
    };

    const handleNameBlur = (e) => {
        setValid({
            ...valid,
            name: _validateName(),
        });
    };

    const handleConfirm = () => {
        let payload = {
            name: form.name,
            description: form.description,
            is_external: activeTab === "extern" ? 1 : 0,
            member_ids: form.selectedUsers.map(u => u.id),
            is_lock: form.is_private ? 1 : 0,
            files_ids: uploadedFiles.map(f => f.id),
        };
        if (form.selectedFolder) {
            payload = {
                ...payload,
                workspace_id: form.selectedFolder.value,
            };
        }

        dispatch(createWorkspace(payload));
        toggle();
    };

    const handleQuillChange = (content, delta, source, editor) => {
        const textOnly = editor.getText(content);
        setForm({
            ...form,
            description: content,
            textOnly: textOnly,
        });
    };

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
        setAttachedFiles(attachedFiles);
        uploadFiles(attachedFiles);
        handleHideDropzone();
    };

    async function uploadFiles(files) {
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

    useEffect(() => {
        let currentUser = null;
        if (Object.values(users).length) {
            currentUser = {
                ...users[user.id],
                value: user.id,
                label: user.name,
            };
        }
        setForm({
            ...form,
            has_folder: true,
            selectedUsers: currentUser ? [currentUser] : [],
            selectedFolder: Object.keys(item).length === 0 ? null : {
                value: item.id,
                label: item.name,
            },
        });
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

        setValid({
            ...valid,
            folder: folderValid,
            name: _validateName(),
        });
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
                    ref={dropzoneRef}
                    onDragLeave={handleHideDropzone}
                    onDrop={({acceptedFiles}) => {
                        dropAction(acceptedFiles);
                    }}
                    onCancel={handleHideDropzone}
                />
                <WrapperDiv>
                    <Label for="chat">
                        Worskpace name</Label>
                    <Input
                        name="name"
                        defaultValue={mode === "edit" ? "" : ""}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        valid={valid.name}
                        autoFocus
                    />
                </WrapperDiv>
                <WrapperDiv>
                    <Label for="has_folder"></Label>
                    <CheckBox
                        valid={valid.folder}
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
                </WrapperDiv>
                <DescriptionInput
                    showFileButton={true}
                    onChange={handleQuillChange}
                    onOpenFileDialog={handleOpenFileDialog}
                />
                {
                    attachedFiles.length > 0 &&
                    <WrapperDiv margin={"40px 0 20px"}>
                        <Label></Label>
                        <FileAttachments attachedFiles={attachedFiles}/>
                    </WrapperDiv>
                }
                <WrapperDiv margin={attachedFiles.length ? "20px 0" : "40px 0 20px"}>
                    <Label></Label>
                    <CheckBox
                        name="is_private"
                        checked={form.is_private} onClick={toggleCheck}>Lock workspace</CheckBox>
                    <button
                        className="btn btn-primary"
                        disabled={Object.values(valid).filter(v => !v).length}
                        onClick={handleConfirm}>
                        {mode === "edit" ? "Update workspace" : "Create workspace"}
                    </button>
                </WrapperDiv>
            </ModalBody>
        </Modal>
    );
});

export default CreateEditWorkspaceModal;