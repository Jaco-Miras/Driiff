import React, {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Input, InputGroup, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import {FolderSelect, PeopleSelect} from "../forms";
import QuillEditor from "../forms/QuillEditor";
import {useQuillModules} from "../hooks";
import {createWorkspace} from "../../redux/actions/workspaceActions";

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

const StyledModalHeader = styled(ModalHeader)`
    .intern-extern {
        margin-left: 10px;
        font-size: .7rem;
    }
`;

const CreateEditWorkspacePostModal = props => {

    const {type, mode} = props.data;

    const reactQuillRef = useRef();
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
        }
        if (form.selectedFolder) {
            payload = {
                ...payload,
                workspace_id: form.selectedFolder.value
            }
        }
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

    const [modules] = useQuillModules("workspace");

    return (

        <Modal isOpen={modal} toggle={toggle} centered size={"md"}>
            <StyledModalHeader toggle={toggle} className={"workspace-modal-header"}>
                {mode === "edit" ? "Edit post" : "Create new post"}
            </StyledModalHeader>
            <ModalBody>
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
                <WrapperDiv>
                    <Label for="firstMessage">Description</Label>
                    <StyledQuillEditor
                        className="group-chat-input"
                        modules={modules}
                        ref={reactQuillRef}
                        onChange={handleQuillChange}
                    />
                </WrapperDiv>
                <WrapperDiv>
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

export default CreateEditWorkspacePostModal;