import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Input, InputGroup, Label, Modal, ModalBody} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import {createWorkspacePost} from "../../redux/actions/workspaceActions";
import {SvgIconFeather} from "../common";
import {CheckBox, FolderSelect, PeopleSelect} from "../forms";
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
    
    &.more-option {
        margin-left: 130px;
        width: 100%;
        margin-right: -130px;
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

const CreateEditWorkspacePostModal = props => {

    const {type, mode, item = {}} = props.data;

    const dispatch = useDispatch();
    const [modal, setModal] = useState(true);
    const user = useSelector(state => state.session.user);
    const workspaces = useSelector(state => state.workspaces.workspaces);
    const activeTab = useSelector(state => state.workspaces.activeTab);
    const [workspaceOptions, setWorkspaceOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [showMoreOptions, setShowMoreOptions] = useState(null);
    const [maxHeight, setMaxHeight] = useState(null);
    const [form, setForm] = useState({
        must_read: false,
        reply_required: false,
        no_reply: false,
        is_private: false,
        has_folder: false,
        name: "",
        selectedUsers: [],
        selectedWorkspaces: [],
        description: "",
        textOnly: "",
    });
    const formRef = {
        reactQuillRef: useRef(null),
        more_options: useRef(null),
        dropZone: useRef(null),
        arrow: useRef(null),
    };
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
            responsible_ids: form.selectedUsers.map(u => u.value),
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
        if (item.workspace !== null) {
            let members = [];
            if (item.workspace.members && item.workspace.members.length) {
                members = item.workspace.members.map(m => {
                    return {
                        ...m,
                        value: m.id,
                        label: m.name,
                    };
                });
                setUserOptions(members);
            }
            setForm({
                ...form,
                selectedWorkspaces: [{
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
        if (Object.values(workspaces).length) {
            const wsTopics = Object.values(workspaces).map(ws => {
                if (ws.type === "FOLDER") {
                    if (Object.keys(ws.topics).length) {
                        return Object.values(ws.topics);
                    }
                    return null;
                } else {
                    return ws;
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
        return c.findIndex(u => u.id === a.id) === i;
    }, []);

    useEffect(() => {
        if (form.selectedWorkspaces.length) {
            let wsMembers = form.selectedWorkspaces.map(ws => {
                if (ws.members !== undefined && ws.members.length) {
                    return ws.members;
                } else return [];
            });

            let uniqueMembers = [...wsMembers.flat()];
            //const unique = (a, i, c) => c.findIndex(u => u.id === a.id) === i
            uniqueMembers = uniqueMembers.filter(unique);

            if (uniqueMembers.length) {
                uniqueMembers = uniqueMembers.map(u => {
                    return {
                        ...u,
                        value: u.id,
                        label: u.name,
                    };
                });
                setUserOptions(uniqueMembers);
            }
        }
    }, [form.selectedWorkspaces.length]);

    useEffect(() => {
        console.log(formRef.more_options);
    }, []);


    useEffect(() => {
        if (formRef.more_options.current !== null && maxHeight === null) {
            setMaxHeight(formRef.more_options.current.offsetHeight);
            setShowMoreOptions(false);
        }
    }, [formRef, setMaxHeight]);

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
                        ref={formRef.reactQuillRef}
                        onChange={handleQuillChange}
                    />
                </WrapperDiv>
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
                    <button
                        className="btn btn-primary"
                        disabled={form.selectedUsers.length === 0 || form.name === "" || form.selectedWorkspaces.length === 0}
                        onClick={handleConfirm}>
                        {mode === "edit" ? "Update workspace" : "Create post"}
                    </button>
                </WrapperDiv>
            </ModalBody>
        </Modal>
    );
};

export default CreateEditWorkspacePostModal;