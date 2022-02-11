import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FormGroup, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { useTranslationActions, useToaster, useDriveLinkActions } from "../hooks";
import { ModalHeaderSection } from "./index";
import { validURL } from "../../helpers/urlContentHelper";
import { FolderSelect } from "../forms";

const Wrapper = styled(Modal)`
  ${(props) =>
    props.color !== "" &&
    `
        .modal-body {
        background-color: ${props.color};
        }
    `}
  input.form-control:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
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

const WrapperDiv = styled(FormGroup)``;

const CreateExternalFileFolder = (props) => {
  const { type, mode = "create", topic_id = null, link = null, params } = props.data;

  const { createDriveLink, updateDriveLink } = useDriveLinkActions();
  const { _t } = useTranslationActions();
  const toaster = useToaster();
  const dictionary = {
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    saveModalHeader: _t("MODAL_HEADER.SAVE_LINK_TO_DRIFF_DRIVE", "Save link to Driff drive"),
    modalDescription: _t("MODAL_DESCRIPTION.LINK_TO_DRIFF_DRIVE_DESCRIPTION", "Share a google or office 365 file or folder of any other kind of link to Driff drive."),
    linkLabel: _t("LABEL.LINK", "Link"),
    typeLabel: _t("LABEL.TYPE", "Type"),
    saveLinkedDocument: _t("BUTTON.SAVE_LINKED_DOCUMENT", "Save linked document"),
    updateLinkedDocument: _t("BUTTON.UPDATE_LINKED_DOCUMENT", "Update linked document"),
    fileFolderName: _t("LABEL.FILE_FOLDER_NAME", "File / Folder name"),
    updateModalHeader: _t("MODAL_HEADER.UPDATE_LINK_TO_DRIFF_DRIVE", "Update link"),
    linkSaveToaster: _t("TOASTER.DRIVE_LINK_SAVED", "Link successfully saved to Driff drive!"),
    linkUpdateToaster: _t("TOASTER.DRIVE_LINK_UPDATED", "Link successfully updated"),
  };
  const dispatch = useDispatch();

  const refs = {
    main: useRef(null),
    name: useRef(null),
  };

  const [linkValue, setLinkValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  //const [googleResult, setGoogleResult] = useState(null);
  const [valid, setValid] = useState({
    validUrl: mode === "create" ? false : true,
    validName: mode === "create" ? false : true,
    validating: mode === "create" ? false : true,
  });

  const [linkType, setLinkType] = useState(null);

  let typeOptions = [
    {
      id: "google_document",
      value: "google_document",
      label: "Google Document",
      icon: "gdoc",
    },
    {
      id: "google_spreadsheet",
      value: "google_spreadsheet",
      label: "Google Spreadsheet",
      icon: "gsheet",
    },
    {
      id: "google_form",
      value: "google_form",
      label: "Google Form",
      icon: "gforms",
    },
    {
      id: "google_folder",
      value: "google_folder",
      label: "Google Folder",
      icon: "google-drive",
    },
    {
      id: "office_word",
      value: "office_word",
      label: "Office365 Word doc",
      icon: "office-word",
    },
    {
      id: "office_excel",
      value: "office_excel",
      label: "Office365 Excel",
      icon: "office-excel",
    },
    {
      id: "office_ppt",
      value: "office_ppt",
      label: "Office365 Powerpoint",
      icon: "office-ppt",
    },
    {
      id: "office_folder",
      value: "office_folder",
      label: "Office365 Folder",
      icon: "office-one-drive",
    },
    {
      id: "dropbox_file",
      value: "dropbox_file",
      label: "Dropbox File",
      icon: "dropbox",
    },
    {
      id: "dropbox_folder",
      value: "dropbox_folder",
      label: "Dropbox Folder",
      icon: "dropbox",
    },
    {
      id: "other_link",
      value: "other_link",
      label: "Other external link",
      icon: "file",
    },
  ];

  const handleSelectLinkType = (e) => {
    setLinkType(e);
  };

  const toggle = () => {
    dispatch(clearModal({ type: type }));
  };

  const handleClose = () => {
    toggle();
  };

  const handleLinkInputChange = (e) => {
    setLinkValue(e.target.value);
    setValid({
      ...valid,
      validUrl: validURL(e.target.value),
    });
  };

  const handleNameInputChange = (e) => {
    setNameValue(e.target.value);
  };

  const handleConfirm = (e) => {
    let payload = {
      type: linkType.id,
      name: nameValue,
      link: linkValue,
    };
    if (params.fileFolderId) {
      payload = {
        ...payload,
        folder_id: params.fileFolderId,
      };
    }
    if (topic_id) {
      payload = {
        ...payload,
        topic_id: topic_id,
      };
    }
    const cb = (err, res) => {
      if (err) return;
      else {
        if (mode === "create") toaster.success(dictionary.linkSaveToaster);
        else toaster.success(dictionary.linkUpdateToaster);
      }
    };
    if (mode === "create") {
      createDriveLink(payload, cb);
    } else {
      payload = {
        ...payload,
        id: link.id,
      };
      updateDriveLink(payload, cb);
    }
    toggle();
  };

  const inputRef = useRef();

  const onOpened = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (mode !== "create" && link) {
      setNameValue(link.name);
      setLinkValue(link.link);
      setLinkType(typeOptions.find((o) => o.id === link.type));
    }
  }, []);

  return (
    <Wrapper ref={refs.main} isOpen={true} toggle={toggle} centered onOpened={onOpened} className={"single-input-modal"}>
      <ModalHeaderSection toggle={toggle}>{mode === "create" ? dictionary.saveModalHeader : dictionary.updateModalHeader}</ModalHeaderSection>
      <ModalBody>
        <Label className={"modal-info mb-3"}>{dictionary.modalDescription}</Label>
        <WrapperDiv>
          <Label className={"modal-label"}>{dictionary.linkLabel}</Label>
          <div className="d-flex align-items-center mb-2">
            <Input innerRef={inputRef} autoFocus defaultValue={""} value={linkValue} onChange={handleLinkInputChange} />
          </div>
          <Label className={"modal-label"}>{dictionary.typeLabel}</Label>
          <FolderSelect className={"react-select-container mb-2"} classNamePrefix="react-select" isMulti={false} options={typeOptions} value={linkType} placeholder={"Select type"} onChange={handleSelectLinkType} />
          <Label className={"modal-label"}>{dictionary.fileFolderName}</Label>
          <div className="d-flex align-items-center mb-2">
            <Input defaultValue={""} value={nameValue} onChange={handleNameInputChange} />
          </div>
        </WrapperDiv>
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={handleClose}>
          {dictionary.cancel}
        </button>
        <button disabled={nameValue.trim() === "" || !valid.validUrl || linkType === null} type="button" className="btn btn-primary" onClick={handleConfirm}>
          {mode === "create" ? dictionary.saveLinkedDocument : dictionary.updateLinkedDocument}
        </button>
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(CreateExternalFileFolder);
