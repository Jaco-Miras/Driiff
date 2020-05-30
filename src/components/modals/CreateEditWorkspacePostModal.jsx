import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Input, InputGroup, Label, Modal, ModalBody} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import {createWorkspacePost} from "../../redux/actions/workspaceActions";
import {FolderSelect, PeopleSelect} from "../forms";
import QuillEditor from "../forms/QuillEditor";
import {useQuillModules} from "../hooks";
import {ModalHeaderSection} from "./index";

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

const CreateEditWorkspacePostModal = props => {

    const {type, mode, item = {}} = props.data;

    const reactQuillRef = useRef();
    const dispatch = useDispatch();
    const [modal, setModal] = useState(true);
    const user = useSelector(state => state.session.user);
    const workspaces = useSelector(state => state.workspaces.workspaces);
    const activeTab = useSelector(state => state.workspaces.activeTab);
    const [workspaceOptions, setWorkspaceOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [form, setForm] = useState({
        is_private: false,
        has_folder: false,
        name: "",
        selectedUsers: [],
        selectedWorkspaces: [],
        description: "",
        textOnly: "",
    });

    const toggle = () => {
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
            name: e.target.value.trim(),
        });
    };

    const handleConfirm = () => {
        let payload = {
            title: form.name,
            body: form.description,
            responsible_ids: form.selectedUsers.map(u => u.id),
            type: "post",
            personal: 0,
            workspace_ids: form.selectedWorkspaces.map(ws => ws.value),
        };
        dispatch(createWorkspacePost(payload));
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

    const [modules] = useQuillModules("workspace");

    useEffect(() => {
        if (item.workspace !== null) {
            let members = [];
            if (item.workspace.members && item.workspace.members.length) {
                members = item.workspace.members.map(m => {
                    return {
                        ...m,
                        value: m.id,
                        label: m.name
                    }
                })
                setUserOptions(members);
            }
            setForm({
                ...form,
                selectedWorkspaces: [{
                    value: item.workspace.id,
                    label: item.workspace.name,
                }],
                selectedUsers: [{
                    value: user.id,
                    label: user.name,
                    name: user.name,
                    first_name: user.first_name,
                    profile_image_link: user.profile_image_link,
                }]
            });
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (Object.values(workspaces).length) {
            const wsTopics = Object.values(workspaces).map(ws => {
                if (ws.type === "FOLDER") {
                    if (Object.keys(ws.topics).length) {
                        return Object.values(ws.topics)
                    } return null
                } else {
                    return ws
                }
            }).flat().filter(ws => ws !== null);
        
            const workspaceOptions = wsTopics.map(ws => {
                return {
                    ...ws,
                    value: ws.id,
                    label: ws.name,
                };
            });
            setWorkspaceOptions(workspaceOptions);
        }
    }, [Object.values(workspaces).length]);

    const unique = useCallback((a, i, c) => {
        return c.findIndex(u => u.id === a.id) === i
    }, []);

    useEffect(() => {
        if (form.selectedWorkspaces.length) {
            let wsMembers = form.selectedWorkspaces.map(ws => {
                if (ws.members !== undefined && ws.members.length) {
                    return ws.members
                } else return []
            })

            let uniqueMembers = [...wsMembers.flat()];
            //const unique = (a, i, c) => c.findIndex(u => u.id === a.id) === i
            uniqueMembers = uniqueMembers.filter(unique)

            if (uniqueMembers.length) {
                uniqueMembers = uniqueMembers.map(u => {
                    return {
                        ...u,
                        value: u.id,
                        label: u.name,
                    };
                });
                setUserOptions(uniqueMembers)
            }
        }
    }, [form.selectedWorkspaces.length])

    return (

        <Modal isOpen={modal} toggle={toggle} centered size={"md"} autoFocus={false}>
            <ModalHeaderSection toggle={toggle}>
                {mode === "edit" ? "Edit post" : "Create new post"}
            </ModalHeaderSection>
            <ModalBody>
                <WrapperDiv>
                    <Label for="post-title">Post title</Label>
                    <Input style={{borderRadius: "5px"}}
                           defaultValue={mode === "edit" ? "" : ""}
                           onChange={handleNameChange}
                           autoFocus
                    />
                </WrapperDiv>
                <WrapperDiv>
                    <Label for="workspace">Workspace</Label>
                    <SelectWorkspace
                        options={workspaceOptions}
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
                    <StyledQuillEditor
                        className="group-chat-input"
                        modules={modules}
                        ref={reactQuillRef}
                        onChange={handleQuillChange}
                    />
                </WrapperDiv>
                <WrapperDiv>
                    <Label></Label>
                    <span>More options ^</span>
                    <button
                        className="btn btn-primary"
                        disabled={form.selectedUsers.length === 0 || form.name === "" || form.selectedWorkspaces.length === 0}
                        onClick={handleConfirm}>
                        {mode === "edit" ? "Update workspace" : "Create workspace"}
                    </button>
                </WrapperDiv>
            </ModalBody>
        </Modal>
    );
};

export default CreateEditWorkspacePostModal;