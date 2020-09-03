import React, {useState} from "react";
import {useDispatch} from "react-redux";
import Select from "react-select";
import {Modal, ModalBody, ModalFooter} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import {useCompanyFiles} from "../hooks";
import {ModalHeaderSection} from "./index";
import {selectTheme} from "../../helpers/selectTheme";

const Wrapper = styled(Modal)``;

const CompanyMoveFilesModal = (props) => {

  const {className = "", type, file, folder_id, dictionary, actions} = props.data;

  const {folders} = useCompanyFiles();
  const dispatch = useDispatch();

  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggle = () => {
    dispatch(clearModal({type: type}));
  };

  const handleClose = () => {
    toggle();
  };

  const handleConfirm = () => {
    if (loading || selectedFolder === null)
      return;

    setLoading(true);

    actions.onSubmit({
      name: file.search,
      file_id: file.id,
      folder_id: selectedFolder.id,
    }, () => {
      setLoading(false);
      toggle();
    }, {
      selectedFolder: selectedFolder.label
    })
  };

  const handleSelectFolder = (e) => {
    setSelectedFolder(e);
  };

  let options = Object.values(folders)
    .filter((f) => {
      if (folder_id) {
        if (f.id === folder_id) return false;
        else return !f.is_archived;
      } else {
        return !f.is_archived;
      }
    })
    .map((f) => {
      return {
        ...f,
        id: f.id,
        label: f.search,
      };
    });

  return (
    <Wrapper isOpen={true} toggle={toggle} centered className={`single-input-modal ${className}`}>
      <ModalHeaderSection toggle={toggle}>{dictionary.headerText}</ModalHeaderSection>
      <ModalBody>
        <div>{dictionary.bodyText}</div>
        <Select styles={selectTheme} options={options} onChange={handleSelectFolder}/>
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-primary" onClick={handleConfirm}>
          {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"/>}
          {dictionary.submitText}
        </button>
        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleClose}>
          {dictionary.cancelText}
        </button>
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(CompanyMoveFilesModal);
