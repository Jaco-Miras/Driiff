import React, {forwardRef, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Input, InputGroup, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import {CheckBox, FolderSelect, PeopleSelect, DescriptionInput} from "../forms";
import {createWorkspace} from "../../redux/actions/workspaceActions";
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
`;

const SelectFolder = styled(FolderSelect)`
    flex: 1 0 0;
    width: 1%;
`;

const SelectPeople = styled(PeopleSelect)`
    flex: 1 0 0;
    width: 1%;
`;

const StyledModalHeader = styled(ModalHeader)`
    color: #505050;  
    font-size: 17px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 26px;
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

    //const reactQuillRef = useRef();
    const dropzoneRef = useRef();
    const dispatch = useDispatch();
    const [modal, setModal] = useState(true);
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

    const toggle = () => {
        setModal(!modal);
        dispatch(
            clearModal({type: type}),
        );
    };

    const toggleCheck = (e) => {
        const name = e.target.dataset.name;
        setForm({
            ...form,
            [name]: !form[name],
            selectedFolder: name === "has_folder" && form.has_folder ? null : form.selectedFolder,
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
        } else {
            setForm({
                ...form,
                selectedUsers: e,
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
        setForm({
            ...form,
            name: e.target.value.trim(),
        });
    };

    const handleConfirm = () => {
        let payload = {
            name: form.name,
            description: form.description,
            is_external: activeTab === "extern" ? 1 : 0,
            member_ids: form.selectedUsers.map(u => u.id),
            is_lock: form.is_private ? 1 : 0,   
            //files: attachedFiles
        }
        if (form.selectedFolder) {
            payload = {
                ...payload,
                workspace_id: form.selectedFolder.value,
            };
        }
        console.log(payload)

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
        setAttachedFiles(attachedFiles)
        handleHideDropzone();
    };

    useEffect(() => {
        setForm({
            ...form,
            has_folder: true,
            selectedFolder: {
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

    return (
        <Modal isOpen={modal} toggle={toggle} centered size={"md"}>
            <StyledModalHeader toggle={toggle} className={"workspace-modal-header"}>
                {mode === "edit" ? "Edit workspace" : "Create new workspace"}
                <ActiveTabName className="intern-extern">{activeTabName}</ActiveTabName>
            </StyledModalHeader>
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
                        style={{borderRadius: "5px"}}
                        defaultValue={mode === "edit" ? "" : ""}
                        onChange={handleNameChange}
                        autoFocus
                    />
                </WrapperDiv>
                <WrapperDiv>
                    <Label for="has_folder"></Label>
                    <CheckBox type="success" name="has_folder" checked={form.has_folder} onClick={toggleCheck}>Add
                        folder</CheckBox>
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
                        options={userOptions}
                        value={form.selectedUsers}
                        onChange={handleSelectUser}
                    />
                </WrapperDiv>
                <DescriptionInput
                    onChange={handleQuillChange}
                />
                <WrapperDiv style={{marginTop: "40px"}}>
                    <Label></Label>
                    <CheckBox name="is_private" checked={form.is_private} onClick={toggleCheck}>Lock
                        workspace</CheckBox>
                    <button
                        className="btn btn-primary"
                        disabled={form.selectedUsers.length === 0 || form.name === ""}
                        onClick={handleConfirm}>
                        {mode === "edit" ? "Update workspace" : "Create workspace"}
                    </button>
                </WrapperDiv>
            </ModalBody>
        </Modal>
    );
});

export default CreateEditWorkspaceModal;