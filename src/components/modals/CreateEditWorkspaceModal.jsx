import React, {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Input, InputGroup, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import {FolderSelect, PeopleSelect, DescriptionInput} from "../forms";
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
    .intern-extern {
        margin-left: 10px;
        font-size: .7rem;
    }
`;

const CreateEditWorkspaceModal = props => {

    const {type, mode} = props.data;

    //const reactQuillRef = useRef();
    const dropzoneRef = useRef();
    const dispatch = useDispatch();
    const [modal, setModal] = useState(true);
    const users = useSelector(state => state.users.mentions);
    const workspaces = useSelector(state => state.workspaces.workspaces);
    const activeTab = useSelector(state => state.workspaces.activeTab);
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
            selectedFolder: name === "has_folder" && form.has_folder ? null : form.selectedFolder
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
                selectedUsers: []
            })
        } else {
            setForm({
                ...form,
                selectedUsers: e
            })
        }
    };

    const handleSelectFolder = e => {
        setForm({
            ...form,
            selectedFolder: e
        })
    }

    const handleNameChange = e => {
        setForm({
            ...form,
            name: e.target.value.trim()
        })
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
                workspace_id: form.selectedFolder.value
            }
        }
        console.log(payload)

        dispatch(createWorkspace(payload));
        toggle();
    }

    const handleQuillChange = (content, delta, source, editor) => {
        const textOnly = editor.getText(content);
        setForm({
            ...form,
            description: content,
            textOnly: textOnly
        })
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

    return (

        <Modal isOpen={modal} toggle={toggle} centered size={"md"}>
            <StyledModalHeader toggle={toggle} className={"workspace-modal-header"}>
                {mode === "edit" ? "Edit workspace" : "Create new workspace"}
                <span className="intern-extern">{activeTab}</span>
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
                    <Input style={{borderRadius: "5px"}}
                           defaultValue={mode === "edit" ? "" : ""}
                           onChange={handleNameChange}
                    />
                </WrapperDiv>
                <WrapperDiv>
                    <Label for="has_folder"></Label>
                    <div className="custom-control custom-checkbox">
                        <input name="has_folder" type="checkbox" className="custom-control-input"
                               checked={form.has_folder}/>
                        <label className="custom-control-label" data-name="has_folder" onClick={toggleCheck}>Add
                            folder</label>
                    </div>
                </WrapperDiv>
                {
                    form.has_folder === true &&
                    <WrapperDiv>
                        <Label for="people">Folder</Label>
                        <SelectFolder
                            options={folderOptions}
                            value={form.selectedFolders}
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
                    <div className="custom-control custom-checkbox">
                        <input name="is_private" type="checkbox" className="custom-control-input"
                               checked={form.is_private}/>
                        <label className="custom-control-label" data-name="is_private" onClick={toggleCheck}>Lock
                            workspace</label>
                    </div>
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
};

export default CreateEditWorkspaceModal;