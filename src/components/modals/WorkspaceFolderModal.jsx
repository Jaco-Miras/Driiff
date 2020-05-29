import React, {useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {Modal} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import QuillEditor from "../forms/QuillEditor";
import {useQuillModules} from "../hooks";
import {ModalHeaderSection} from "./index";


const PopUpBody = styled.div`
    padding: 15px;
`;

const FormGroupDiv = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    label {
        white-space: nowrap;
        margin-bottom: 0;
        min-width: 80px;
        margin-right: 1rem;
    }
`;

const StyledQuillEditor = styled(QuillEditor)`
    &.folder-description-input {
        border: 1px solid #afb8bd;
        border-radius: 5px;
        max-height: 130px;
        overflow: auto;
        overflow-x: hidden;
        position: static;
        width: 100%;
        min-height: 80px;
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


const WorkspaceFolderModal = props => {

    const {type} = props.data;

    const reactQuillRef = useRef();
    const dispatch = useDispatch();
    const [modal, setModal] = useState(true);
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    const [textOnly, setTextOnly] = useState("");

    const toggle = () => {
        setModal(!modal);
        dispatch(
            clearModal({type: type}),
        );
    };

    const handleNameChange = e => {
        setName(e.target.value);
    };

    const handleQuillChange = (content, delta, source, editor) => {
        const textOnly = editor.getText(content);

        setText(content);
        setTextOnly(textOnly);
    };

    const handleCreateWorkspaceFolder = () => {
        let payload = {
            // name: name,
            // description: text,
            // is_external: 0,
            // is_folder: 1,
            // is_lock: 0,
            // // member_ids: [3,2],
            // workspace_id: 1,
            // topic_id: 100
        };

        dispatch(
            //moveWorkspaceTopic(payload)
            //updateWorkspace(payload)
            //createWorkspace(payload)
        );
        toggle();
    };

    const [modules] = useQuillModules(type);

    return (
        <Modal isOpen={modal} toggle={toggle} centered className='chat-forward-modal'>
            <ModalHeaderSection toggle={toggle}>
                Create new folder
            </ModalHeaderSection>
            <PopUpBody>
                <FormGroupDiv class="form-group">
                    <label for="folderName">Folder name</label>
                    <input onChange={handleNameChange} type="text" class="form-control"/>
                </FormGroupDiv>
                <FormGroupDiv class="form-group">
                    <label for="folderDescription">Description</label>
                    <StyledQuillEditor
                        className="folder-description-input"
                        modules={modules}
                        ref={reactQuillRef}
                        onChange={handleQuillChange}
                    />
                </FormGroupDiv>
                <FormGroupDiv>
                    <button type="button" onClick={handleCreateWorkspaceFolder} class="btn btn-primary">Create
                        workspace
                    </button>
                </FormGroupDiv>
            </PopUpBody>
        </Modal>
    );
};

export default WorkspaceFolderModal;