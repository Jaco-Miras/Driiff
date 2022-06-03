import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import { moveFile, putDriveLink } from "../../redux/actions/fileActions";
import { clearModal } from "../../redux/actions/globalActions";
import { useToaster } from "../hooks";
import { ModalHeaderSection } from "./index";
import { darkTheme, lightTheme } from "../../helpers/selectTheme";
import { useSettings, useTranslationActions } from "../hooks";

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

const MoveFilesModal = (props) => {
  const { className = "", type, file, topic_id, folder_id, isLink = false, params, ...otherProps } = props;

  const history = useHistory();
  const dispatch = useDispatch();
  const toaster = useToaster();
  const { _t } = useTranslationActions();

  const dictionary = {
    rootFolder: _t("OPTIONS.ROOT_FOLDER", "Root folder"),
  };

  const workspaceFiles = useSelector((state) => state.files.workspaceFiles);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const workspace = useSelector((state) => state.workspaces.activeTopic);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading, setLoading] = useState(false);
  let sharedPayload = null;
  if (params && params.workspaceId && history.location.pathname.startsWith("/shared-workspace") && workspace) {
    sharedPayload = { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true };
  }

  let options = Object.values(workspaceFiles[topic_id].folders)
    .filter((f) => {
      if (typeof f.payload !== "undefined") return false;

      // if (folder_id && f.id === folder_id) return false;

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

  options = [{ label: dictionary.rootFolder, value: null }, ...options].filter((f) => {
    if (folder_id) {
      return f.value !== parseInt(folder_id);
    } else {
      return f.value !== null;
    }
  });

  const toggle = () => {
    dispatch(clearModal({ type: type }));
  };

  const handleClose = () => {
    toggle();
  };

  const handleConfirm = () => {
    if (loading) return;

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

      if (isLink) {
        let payload = {
          id: file.id,
          type: file.type,
          name: file.name,
          link: file.link,
          topic_id: topic_id,
          folder_id: selectedFolder.value,
          sharedPayload: sharedPayload,
        };
        dispatch(putDriveLink(payload, cb));
      } else {
        dispatch(
          moveFile(
            {
              file_id: file.id,
              topic_id: topic_id,
              folder_id: selectedFolder.value,
              sharedPayload: sharedPayload,
            },
            cb
          )
        );
      }
    }
    toggle();
  };

  const handleSelectFolder = (e) => {
    setSelectedFolder(e);
  };

  const {
    generalSettings: { dark_mode },
  } = useSettings();

  return (
    <Wrapper isOpen={true} toggle={toggle} centered className={`single-input-modal ${className}`} {...otherProps}>
      <ModalHeaderSection toggle={toggle}>Move the file</ModalHeaderSection>
      <ModalBody>
        <div className="d-flex align-items-center">
          <span className="pr-1 mb-3">Move</span>
          <div className="folder-name mb-3">{isLink ? file.name : file.search}</div>
          <span className="pl-1 mb-3">to:</span>
        </div>
        <Label className={"folder-name"}>Select a folder</Label>
        <Select className={"react-select-container"} classNamePrefix="react-select" styles={dark_mode === "0" ? lightTheme : darkTheme} options={options} onChange={handleSelectFolder} />
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={handleClose}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={handleConfirm}>
          {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
          Move File
        </button>
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(MoveFilesModal);
