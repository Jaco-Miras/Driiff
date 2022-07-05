import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import styled, { useTheme } from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { useCompanyFiles } from "../hooks";
import { ModalHeaderSection } from "./index";
import { darkTheme, lightTheme } from "../../helpers/selectTheme";
import { useSettings } from "../hooks";

const Wrapper = styled(Modal)`
  .react-select__control,
  .react-select__control:hover,
  .react-select__control:active,
  .react-select__control:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  .react-select__option--is-selected {
    background-color: ${({ theme }) => theme.colors.primary};
  }
  .react-select__option:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  .btn.btn-primary {
    background-color: ${({ theme }) => theme.colors.primary}!important;
    border-color: ${({ theme }) => theme.colors.primary}!important;
  }
  .btn.btn-outline-secondary {
    color: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.secondary};
  }
  .btn.btn-outline-secondary:not(:disabled):not(.disabled):hover,
  .btn.btn-outline-secondary:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  .btn.btn-outline-secondary:not(:disabled):not(.disabled):hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const CompanyMoveFilesModal = (props) => {
  const { className = "", type, file, folder_id, dictionary, actions } = props.data;
  const theme = useTheme();
  const { folders } = useCompanyFiles();
  const dispatch = useDispatch();

  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggle = () => {
    dispatch(clearModal({ type: type }));
  };

  const handleClose = () => {
    toggle();
  };

  const handleConfirm = () => {
    if (loading || selectedFolder === null) return;

    setLoading(true);

    actions.onSubmit(
      {
        name: file.search,
        file_id: file.id,
        folder_id: selectedFolder.value,
      },
      () => {
        setLoading(false);
        toggle();
      },
      {
        selectedFolder: selectedFolder.label,
      }
    );
  };

  const handleSelectFolder = (e) => {
    setSelectedFolder(e);
  };

  let options = Object.values(folders)
    .filter((f) => {
      if (typeof f.payload !== "undefined") return false;

      if (folder_id && f.id === folder_id) return false;

      return !f.is_archived;
    })
    .map((f) => {
      return {
        ...f,
        id: f.id,
        label: f.search,
        value: f.id,
      };
    })
    .sort((a, b) => a.search.localeCompare(b.search));

  options = [{ label: dictionary.rootFolder, value: null }, ...options].filter((f) => f.value !== parseInt(folder_id));

  const {
    generalSettings: { dark_mode },
  } = useSettings();

  return (
    <Wrapper isOpen={true} toggle={toggle} centered className={`single-input-modal ${className}`}>
      <ModalHeaderSection toggle={toggle}>{dictionary.headerText}</ModalHeaderSection>
      <ModalBody>
        <div>{dictionary.bodyText}</div>
        <Select className={"react-select-container"} classNamePrefix="react-select" styles={dark_mode === "0" ? lightTheme : darkTheme} menuColor={theme.colors.primary} options={options} onChange={handleSelectFolder} />
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={handleClose}>
          {dictionary.cancelText}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleConfirm}>
          {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
          {dictionary.submitText}
        </button>
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(CompanyMoveFilesModal);
