import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Input, InputGroup, Label, Modal, ModalBody} from "reactstrap";
import styled from "styled-components";
import toaster from "toasted-notes";
import {clearModal} from "../../redux/actions/globalActions";
import {createWorkspace, updateWorkspace} from "../../redux/actions/workspaceActions";
import {CheckBox, DescriptionInput, InputFeedback} from "../forms";
import {ModalHeaderSection} from "./index";

const WrapperDiv = styled(InputGroup)`
    display: flex;
    align-items: center;
    margin: 20px 0;
    
    > .form-control:not(:first-child) {
        border-radius: 5px;
    }
    
    label {
        white-space: nowrap;
        margin: 0 20px 0 0;
        min-width: 109px;
    }
    
    .input-feedback {
        margin-left: 130px;
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

const CreateWorkspaceFolderModal = props => {

    const {type, mode, item = null} = props.data;

    const dispatch = useDispatch();
    const workspaces = useSelector(state => state.workspaces.workspaces);
    const activeTab = useSelector(state => state.workspaces.activeTab);
    const [modal, setModal] = useState(true);
    const [activeTabName, setActiveTabName] = useState("Internal");
    const [form, setForm] = useState({
        is_private: false,
        name: "",
        description: "",
        textOnly: "",
        workspace_id: null,
    });
    const [valid, setValid] = useState({
        name: null,
    });
    const [feedback, setFeedback] = useState({
        name: "",
    });
    const toggle = () => {
        setModal(!modal);
        dispatch(
            clearModal({type: type}),
        );
    };

    const toggleCheck = useCallback((e) => {
        const name = e.target.dataset.name;
        setForm(prevState => ({
            ...prevState,
            [name]: !prevState[name],
        }));
    }, [setForm]);

    const validateName = useCallback(() => {
        setValid({
            ...valid,
            name: form.name !== "",
        });
        
        if (mode === "edit") {
            if (form.name === "") {
                setFeedback({
                    ...feedback,
                    name: "Please provide a folder name.",
                });
            } else if (Object.values(workspaces).filter(w => w.name.toLowerCase() === form.name.toLowerCase()).length) {
                if (item.workspace_name !== form.name) {
                    setFeedback({
                        ...feedback,
                        name: "Folder name already exists.",
                    });
                }
            } else {
                setFeedback({
                    ...feedback,
                    name: "",
                });
            }
        } else {
    
            if (form.name === "") {
                setFeedback({
                    ...feedback,
                    name: "Please provide a folder name.",
                });
            } else if (Object.values(workspaces).filter(w => w.name.toLowerCase() === form.name.toLowerCase()).length) {
                setFeedback({
                    ...feedback,
                    name: "Folder name already exists.",
                });
            } else {
                setFeedback({
                    ...feedback,
                    name: "",
                });
            }
        }
    }, [form.name, valid, setValid, feedback, setFeedback, workspaces, mode]);

    const handleNameChange = useCallback(e => {
        e.persist();
        if (valid.name !== null) {
            setValid(prevState => ({
                ...prevState,
                name: null,
            }));
        }
        setForm(prevState => ({
            ...prevState,
            name: e.target.value.trim(),
        }));
    }, [valid.name, setValid, setForm]);

    const handleNameBlur = useCallback(e => {
        validateName();
    }, [validateName]);

    const handleConfirm = useCallback(() => {
        let payload = {
            name: form.name,
            description: form.description,
            is_external: activeTab === "extern" ? 1 : 0,
            is_folder: 1,
            is_lock: form.is_private ? 1 : 0,
        };
        if (mode === "edit") {
            payload = {
                ...payload,
                workspace_id: form.workspace_id,
                topic_id: form.workspace_id
            }
            dispatch(
                updateWorkspace(payload, (err, res) => {
                    if(err) {
                        toaster.notify(
                            <span>Folder update failed.<br/>Please try again.</span>,
                            {position: "bottom-left"});
                    }
                    if(res) {
                        toaster.notify(
                            <span><b>{form.name}</b> folder is updated</span>,
                            {position: "bottom-left"});
                        toggle();
                    }
                }),
            );
        } else {
            dispatch(
                createWorkspace(payload, (err, res) => {
                    if(err) {
                        toaster.notify(
                            <span>Folder creation failed.<br/>Please try again.</span>,
                            {position: "bottom-left"});
                    }
                    if(res) {
                        toaster.notify(
                            <span><b>{form.name}</b> folder is created</span>,
                            {position: "bottom-left"});
                        toggle();
                    }
                }),
            );
        }
    }, [dispatch, toggle, activeTab, form.description, form.is_private, form.name, valid.name, setForm, mode]);

    const handleQuillChange = useCallback((content, delta, source, editor) => {
        const textOnly = editor.getText(content);
        setForm(prevState => ({
            ...prevState,
            description: content,
            textOnly: textOnly,
        }));
    }, [setForm]);

    useEffect(() => {
        if (activeTab !== "extern") {
            setActiveTabName("Internal");
        } else {
            setActiveTabName("External");
        }
    }, [activeTab, setActiveTabName]);

    useEffect(() => {
        if (mode === "edit") {
            let folder = {...workspaces[item.workspace_id]};
            if (folder) {
                setForm({
                    ...form,
                    name: folder.name,
                    description: folder.description,
                    textOnly: folder.description,
                    is_private: folder.is_lock === 1,
                    workspace_id: folder.id,
                })
            }
        }
    }, []);

    return (
        <Modal isOpen={modal} toggle={toggle} centered size={"md"} autoFocus={false}>
            <ModalHeaderSection toggle={toggle} className={"workspace-folder-header"}>
                {mode === "edit" ? "Edit folder" : "Create new folder"}
                <ActiveTabName className="intern-extern">{activeTabName}</ActiveTabName>
            </ModalHeaderSection>
            <ModalBody>
                <WrapperDiv>
                    <Label for="folder">
                        Folder name</Label>
                    <Input
                        defaultValue={mode === "edit" ? item.workspace_name : ""}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        valid={valid.name}
                        invalid={valid.name !== null && !valid.name}
                        autoFocus
                    />
                    <InputFeedback valid={valid.name}>{feedback.name}</InputFeedback>
                </WrapperDiv>
                <DescriptionInput
                    onChange={handleQuillChange}
                    defaultValue={mode === "edit" && item ? item.workspace_description : ""}
                    mode={mode}
                />
                <WrapperDiv style={{marginTop: "40px"}}>
                    <Label></Label>
                    <CheckBox name="is_private" checked={form.is_private} onClick={toggleCheck}>Lock
                        workspace</CheckBox>
                    <button
                        className="btn btn-primary"
                        disabled={valid.name === null || valid.name === false}
                        onClick={handleConfirm}>
                        {mode === "edit" ? "Update workspace" : "Create workspace"}
                    </button>
                </WrapperDiv>
            </ModalBody>
        </Modal>
    );
};

export default React.memo(CreateWorkspaceFolderModal);