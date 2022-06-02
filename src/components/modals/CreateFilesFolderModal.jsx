import React, { useRef, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FormGroup, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { useTranslationActions, useOutsideClick } from "../hooks";
import { ModalHeaderSection } from "./index";
import { replaceChar } from "../../helpers/stringFormatter";
import { putCompanyFolders, postCompanyFolders, addFolder, putFolder, addGoogleDriveFolder } from "../../redux/actions/fileActions";
import { BlockPicker } from "react-color";
import colorWheel from "../../assets/img/svgs/RGB_color_wheel_12.svg";
import { useSelector } from "react-redux";

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

const PickerWrapper = styled.div`
  position: absolute;
  z-index: 2;
  left: 50%;
  margin-left: -90px;
  right: 50%;
`;

const ColorWheelIcon = styled.img`
  height: 1rem;
  width: 1rem;
  cursor: pointer;
`;
const defaultColors = ["#D9E3F0", "#F47373", "#697689", "#37D67A", "#2CCCE4", "#555555", "#dce775", "#ff8a65", "#ba68c8"];

const CreateFilesFolderModal = (props) => {
  const { type, folder = null, mode = "create", params, topic_id = null, parentFolder = null } = props.data;
  const theme = useSelector((state) => state.settings.driff.theme);
  const folderName = parentFolder ? parentFolder.search : "";
  const history = useHistory();
  const { _t } = useTranslationActions();
  const dictionary = {
    folderDescription: _t("FOLDER_MODAL.DESCRIPTION", "Folders help to organize your files. A file can only be connected to one folder."),
    folderName: _t("FOLDER_MODAL.FOLDER_NAME", "Folder name"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    update: _t("BUTTON.UPDATE", "Update"),
    createFolder: _t("FILE.CREATE_FOLDER", "Create folder"),
    create: _t("FILE.CREATE", "Create"),
    updateFolder: _t("FILE.UPDATE_FOLDER", "Update folder"),
    altText: _t("ALT_TEXT_FOLDER_COLOR", "Select folder color"),
    postInputLabel: _t("FOLDER_MODAL.PARENT_FOLDER_LABEL", "The folder will be created inside ::folderName::", { folderName: folderName }),
  };
  const dispatch = useDispatch();

  const refs = {
    main: useRef(null),
    name: useRef(null),
  };

  const pickerRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState(folder ? folder.bg_color : "");

  const [inputValue, setInputValue] = useState(folder ? folder.search : "");

  const colors = useMemo(() => [...Object.values(theme.colors), ...defaultColors], [theme.colors]);

  const workspace = useSelector((state) => state.workspaces.activeTopic);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);

  const toggle = () => {
    dispatch(clearModal({ type: type }));
  };

  const handleClose = () => {
    toggle();
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCreateFolder = () => {
    let cb = (err, res) => {
      if (err) return;
      if (topic_id) {
        if (params.hasOwnProperty("folderId")) {
          history.push(`/workspace/files/${params.folderId}/${params.folderName}/${params.workspaceId}/${params.workspaceName}/folder/${res.data.folder.id}/${replaceChar(res.data.folder.search)}`);
        } else {
          history.push(`/workspace/files/${params.workspaceId}/${params.workspaceName}/folder/${res.data.folder.id}/${replaceChar(res.data.folder.search)}`);
        }
      } else {
        history.push(`/files/folder/${res.data.folder.id}/${replaceChar(res.data.folder.search)}`);
      }
    };
    let payload = {
      name: inputValue,
      bg_color: color,
    };
    if (params.hasOwnProperty("folderId") && topic_id === null) {
      payload = {
        ...payload,
        folder_id: params.folderId,
      };
    }
    if (params.hasOwnProperty("fileFolderId") && topic_id) {
      payload = {
        ...payload,
        folder_id: params.fileFolderId,
      };
    }
    if (params && params.workspaceId && history.location.pathname.startsWith("/shared-workspace") && workspace) {
      payload = {
        ...payload,
        sharedPayload: { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true },
      };
    }
    if (topic_id) {
      dispatch(addFolder({ ...payload, topic_id: topic_id }, cb));
    } else {
      dispatch(postCompanyFolders(payload, cb));
    }
  };

  const handleUpdateFolder = () => {
    let cb = (err, res) => {
      if (err) return;
      if (topic_id) {
        if (params.hasOwnProperty("folderId")) {
          history.push(`/workspace/files/${params.folderId}/${params.folderName}/${params.workspaceId}/${params.workspaceName}/folder/${res.data.folder.id}/${replaceChar(res.data.folder.search)}`);
        } else {
          history.push(`/workspace/files/${params.workspaceId}/${params.workspaceName}/folder/${res.data.folder.id}/${replaceChar(res.data.folder.search)}`);
        }
      } else {
        history.push(`/files/folder/${res.data.folder.id}/${replaceChar(res.data.folder.search)}`);
      }
    };
    let payload = {
      id: folder.id,
      name: inputValue,
      is_archived: true,
      bg_color: color,
    };
    if (params && params.workspaceId && history.location.pathname.startsWith("/shared-workspace") && workspace) {
      payload = {
        ...payload,
        sharedPayload: { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true },
      };
    }
    if (topic_id) {
      dispatch(putFolder({ ...payload, topic_id: topic_id }, cb));
    } else {
      dispatch(putCompanyFolders(payload, cb));
    }
  };

  const handleConfirm = () => {
    toggle();
    if (mode === "create") handleCreateFolder();
    else handleUpdateFolder();
  };

  const inputRef = useRef();

  const onOpened = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleShowColorPicker = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowColorPicker(!showColorPicker);
  };

  const handleColorChange = (color, e) => {
    e.stopPropagation();
    setColor(color.hex);
  };

  useOutsideClick(pickerRef, () => setShowColorPicker(!showColorPicker), showColorPicker);

  return (
    <Wrapper ref={refs.main} isOpen={true} toggle={toggle} centered onOpened={onOpened} className={"single-input-modal"} color={color}>
      <ModalHeaderSection toggle={toggle}>{mode === "create" ? dictionary.createFolder : dictionary.updateFolder}</ModalHeaderSection>
      <ModalBody>
        <Label className={"modal-info mb-3"}>{dictionary.folderDescription}</Label>
        <WrapperDiv>
          <Label className={"modal-label"}>{dictionary.folderName}</Label>
          <div className="d-flex align-items-center mb-2">
            <Input innerRef={inputRef} autoFocus defaultValue={mode === "create" ? "" : folder.search} onChange={handleInputChange} />
            <ColorWheelIcon className="color-picker ml-2" src={colorWheel} alt={dictionary.altText} onClick={handleShowColorPicker} />
          </div>
          {parentFolder && <span>{dictionary.postInputLabel}</span>}
        </WrapperDiv>
        {showColorPicker && (
          <PickerWrapper ref={pickerRef}>
            <BlockPicker width={202} color={color} colors={colors} onChange={handleColorChange} />
          </PickerWrapper>
        )}
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={handleClose}>
          {dictionary.cancel}
        </button>
        <button disabled={inputValue.trim() === ""} type="button" className="btn btn-primary" onClick={handleConfirm}>
          {mode === "create" ? dictionary.create : dictionary.update}
        </button>
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(CreateFilesFolderModal);
