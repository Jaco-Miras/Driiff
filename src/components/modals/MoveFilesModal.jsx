import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Modal, ModalBody, ModalFooter} from "reactstrap";
import styled from "styled-components";
import Select from "react-select";
import {clearModal} from "../../redux/actions/globalActions";
import {moveFile} from "../../redux/actions/fileActions";
import {ModalHeaderSection} from "./index";
import toaster from "toasted-notes";


const Wrapper = styled(Modal)`
`;

const MoveFilesModal = (props) => {

    const {
        className = "",
        type,
        file,
        topic_id,
        folder_id,
        ...otherProps
    } = props;

    const dispatch = useDispatch();

    const workspaceFiles = useSelector(state => state.files.workspaceFiles);
    const [selectedFolder, setSelectedFolder] = useState(null);
    
    let options = Object.values(workspaceFiles[topic_id].folders).filter(f => {
        if (folder_id) {
            if (f.id == folder_id) return false;
            else return true;
        } else return true;
    })
    .map(f => {
        return {
            ...f,
            id: f.id,
            label: f.search
        }
    })

    const toggle = () => {
        dispatch(
            clearModal({type: type}),
        );
    };

    const handleClose = () => {
        toggle();
    };

    const handleConfirm = () => {
        if (selectedFolder) {
            let cb = (err,res) => {
                if (err) return;
                toaster.notify(`${file.search} has been moved to ${selectedFolder.label}`,
                    {position: "bottom-left"});
            }
            dispatch(
                moveFile({
                    file_id: file.id,
                    topic_id: topic_id,
                    folder_id: selectedFolder.id
                }, cb)
            );
        }
        toggle();
    };

    const handleSelectFolder = e => {
        setSelectedFolder(e);
    };

    return (
        <Wrapper isOpen={true} toggle={toggle} centered
                 className={`single-input-modal ${className}`} {...otherProps}>
            <ModalHeaderSection toggle={toggle}>Move file</ModalHeaderSection>
            <ModalBody>
                <div>{file.search}</div>
                <Select options={options} onChange={handleSelectFolder}/>
            </ModalBody>
            <ModalFooter>
                <button
                    type="button" className="btn btn-secondary" data-dismiss="modal"
                    onClick={handleClose}>Cancel</button>
                <button
                    type="button" className="btn btn-primary"
                    onClick={handleConfirm}>Move</button>
            </ModalFooter>
        </Wrapper>
    );
};

export default React.memo(MoveFilesModal);