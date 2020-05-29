import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Input, InputGroup, Label, Modal, ModalBody} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import {createWorkspace} from "../../redux/actions/workspaceActions";
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

    const {type, mode} = props.data;

    const dispatch = useDispatch();
    const workspaces = useSelector(state => state.workspaces.workspaces);
    const channel = useSelector(state => state.chat.selectedChannel);
    const activeTab = useSelector(state => state.workspaces.activeTab);
    const [modal, setModal] = useState(true);
    const [activeTabName, setActiveTabName] = useState("Internal");
    const [form, setForm] = useState({
        is_private: false,
        name: "",
        description: "",
        textOnly: "",
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

    const toggleCheck = (e) => {
        const name = e.target.dataset.name;
        setForm({
            ...form,
            [name]: !form[name],
        });
    };

    const handleNameChange = e => {
        if (valid.name !== null) {
            setValid({
                ...form,
                name: null,
            });
        }
        setForm({
            ...form,
            name: e.target.value.trim(),
        });
    };

    const handleNameBlur = e => {
        setValid({
            ...valid,
            name: form.name !== "",
        });

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
    };

    const handleConfirm = () => {
        let payload = {
            name: form.name,
            description: form.description,
            is_external: activeTab === "extern" ? 1 : 0,
            is_folder: 1,
            is_lock: form.is_private ? 1 : 0,
        };
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

    useEffect(() => {
        if (activeTab !== "extern") {
            setActiveTabName("Internal");
        } else {
            setActiveTabName("External");
        }
    }, [activeTab]);

    return (

        <Modal isOpen={modal} toggle={toggle} centered size={"md"}>
            <ModalHeaderSection toggle={toggle} className={"workspace-folder-header"}>
                {mode === "edit" ? "Edit folder" : "Create new folder"}
                <ActiveTabName className="intern-extern">{activeTabName}</ActiveTabName>
            </ModalHeaderSection>
            <ModalBody>
                <WrapperDiv>
                    <Label for="folder">
                        Folder name</Label>
                    <Input
                        defaultValue={mode === "edit" ? channel.title : ""}
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
                />
                <WrapperDiv style={{marginTop: "40px"}}>
                    <Label></Label>
                    <CheckBox name="is_private" checked={form.is_private} onClick={toggleCheck}>Lock
                        workspace</CheckBox>
                    <button
                        className="btn btn-primary"
                        disabled={valid.name}
                        onClick={handleConfirm}>
                        {mode === "edit" ? "Update workspace" : "Create workspace"}
                    </button>
                </WrapperDiv>
            </ModalBody>
        </Modal>
    );
};

export default CreateWorkspaceFolderModal;