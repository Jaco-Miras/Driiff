import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Input, InputGroup, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import {createWorkspace} from "../../redux/actions/workspaceActions";
import {DescriptionInput} from "../forms";

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

const StyledModalHeader = styled(ModalHeader)`
    .intern-extern {
        margin-left: 10px;
        font-size: .7rem;
    }
`;

const CreateWorkspaceFolderModal = props => {

    const {type, mode} = props.data;

    //const reactQuillRef = useRef();
    const dispatch = useDispatch();
    const [modal, setModal] = useState(true);
    const channel = useSelector(state => state.chat.selectedChannel);
    const activeTab = useSelector(state => state.workspaces.activeTab);
    const [form, setForm] = useState({
        is_private: false,
        name: "",
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
            [name]: !form[name]
        });
    };

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
            is_folder: 1,
            is_lock: form.is_private ? 1 : 0,   
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

    return (

        <Modal isOpen={modal} toggle={toggle} centered size={"md"}>
            <StyledModalHeader toggle={toggle} className={"workspace-folder-header"}>
                {mode === "edit" ? "Edit folder" : "Create new folder"}
                <span className="intern-extern">{activeTab}</span>
            </StyledModalHeader>
            <ModalBody>
                <WrapperDiv>
                    <Label for="folder">
                        Folder name</Label>
                    <Input style={{borderRadius: "5px"}}
                           defaultValue={mode === "edit" ? channel.title : ""}
                           onChange={handleNameChange}
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
                        disabled={form.name === ""}
                        onClick={handleConfirm}>
                        {mode === "edit" ? "Update workspace" : "Create workspace"}
                    </button>
                </WrapperDiv>
            </ModalBody>
        </Modal>
    );
};

export default CreateWorkspaceFolderModal;