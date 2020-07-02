import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Input, InputGroup, Label, Modal, ModalBody} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import {createWorkspace, updateWorkspace} from "../../redux/actions/workspaceActions";
import {CheckBox, DescriptionInput, InputFeedback} from "../forms";
import {useToaster} from "../hooks";
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

const CreateWorkspaceFolderModal = props => {

    const {type, mode, item = null} = props.data;

    const toaster = useToaster();
    const inputRef = useRef();
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
    }, [form.name, valid, setValid, feedback, setFeedback, workspaces]);

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

        validateName();
    }, [valid.name, setValid, setForm]);

    const handleNameBlur = useCallback(() => {
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
                        console.log(err);
                        toaster.error(
                            <span>Folder update failed.<br/>Please try again.</span>);
                    }
                    if(res) {
                        toaster.success(
                            <span><b>{form.name}</b> folder is updated</span>);
                        toggle();
                    }
                }),
            );
        } else {
            dispatch(
                createWorkspace(payload, (err, res) => {
                    if(err) {
                        console.log(err);
                        toaster.error(
                            <span>Folder creation failed.<br/>Please try again.</span>);
                    }
                    if(res) {
                        toaster.success(
                            <span><b>{form.name}</b> folder is created</span>);
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
            setActiveTabName("internal");
        } else {
            setActiveTabName("external");
        }
    }, [activeTab, setActiveTabName]);

    const onOpened = () => {
        if (inputRef && inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <Modal isOpen={modal} toggle={toggle} centered size={"md"} onOpened={onOpened}>
            <ModalHeaderSection toggle={toggle} className={"workspace-folder-header"}>
                {mode === "edit" ? "Edit " + activeTabName + " folder" : "Create new " + activeTabName +  " folder"}
                {/* <ActiveTabName className="intern-extern">{activeTabName}</ActiveTabName> */}
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
                        innerRef={inputRef}
                    />
                    <InputFeedback valid={valid.name}>{feedback.name}</InputFeedback>
                </WrapperDiv>
                <DescriptionInput
                    onChange={handleQuillChange}
                    defaultValue={mode === "edit" && item ? item.workspace_description : ""}
                    mode={mode}
                />
                <WrapperDiv style={{marginTop: "40px"}}>
                    <Label/>
                    <CheckBox name="is_private" checked={form.is_private} onClick={toggleCheck}>Lock
                        workspace</CheckBox>
                    <button
                        className="btn btn-primary"
                        disabled={valid.name === null || valid.name === false}
                        onClick={handleConfirm}>
                        {mode === "edit" ? "Update workspace" : "Create folder"}
                    </button>
                </WrapperDiv>
            </ModalBody>
        </Modal>
    );
};

export default React.memo(CreateWorkspaceFolderModal);