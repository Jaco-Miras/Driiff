import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Select from "react-select";
import {Modal, ModalBody, ModalFooter} from "reactstrap";
import styled from "styled-components";
import {moveFile} from "../../redux/actions/fileActions";
import {clearModal} from "../../redux/actions/globalActions";
import {useToaster} from "../hooks";
import {ModalHeaderSection} from "./index";
import {selectTheme} from "../../helpers/selectTheme";

const Wrapper = styled(Modal)``;

const MoveFilesModal = (props) => {
  const {className = "", type, file, topic_id, folder_id, ...otherProps} = props;

  const dispatch = useDispatch();
  const toaster = useToaster();

  const workspaceFiles = useSelector((state) => state.files.workspaceFiles);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading, setLoading] = useState(false);

  let options = Object.values(workspaceFiles[topic_id].folders)
    .filter((f) => {
      if (typeof f.payload !== "undefined")
        return false;

      if (folder_id && f.id === folder_id)
        return false;

      return !f.is_archived;
    })
    .map((f) => {
      return {
        ...f,
        id: f.id,
        label: f.search,
      };
    });

  const toggle = () => {
    dispatch(clearModal({type: type}));
  };

  const handleClose = () => {
    toggle();
  };

  const handleConfirm = () => {
    if (loading)
      return;

    setLoading(true);

    if (selectedFolder) {
      let cb = (err, res) => {
        setLoading(false);

        if (err) {
          toaster.success(
            <div>
              Failed to move <b>{file.search}</b> to folder <strong>{selectedFolder.label}</strong>
            </div>
          );

          return;
        }
        toaster.success(
          <div>
            <strong>{file.search}</strong> has been moved to folder <strong>{selectedFolder.label}</strong>
          </div>
        );
      };

      dispatch(
        moveFile(
          {
            file_id: file.id,
            topic_id: topic_id,
            folder_id: selectedFolder.id,
          },
          cb
        )
      );
    }
    toggle();
  };

  const handleSelectFolder = (e) => {
    setSelectedFolder(e);
  };

  return (
    <Wrapper isOpen={true} toggle={toggle} centered className={`single-input-modal ${className}`} {...otherProps}>
      <ModalHeaderSection toggle={toggle}>Move the file</ModalHeaderSection>
      <ModalBody>
        <div>{file.search}</div>
        <Select styles={selectTheme} options={options} onChange={handleSelectFolder}/>
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-primary" onClick={handleConfirm}>
          {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"/>}
          Move
        </button>
        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleClose}>
          Cancel
        </button>
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(MoveFilesModal);
