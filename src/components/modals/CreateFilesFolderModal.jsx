import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FormGroup, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { useTranslationActions, useOutsideClick } from "../hooks";
import { ModalHeaderSection } from "./index";
import { replaceChar } from "../../helpers/stringFormatter";
import { putCompanyFolders, postCompanyFolders, addFolder, putFolder } from "../../redux/actions/fileActions";
import { BlockPicker } from "react-color";
import colorWheel from "../../assets/img/svgs/RGB_color_wheel_12.svg";

const Wrapper = styled(Modal)`
  ${(props) =>
    props.color !== "" &&
    `
        .modal-body {
        background-color: ${props.color};
        }
    `}
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

const CreateFilesFolderModal = (props) => {
  const { type, folder = null, mode = "create", params, topic_id = null, parentFolder = null } = props.data;

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
    postInputLabel: _t("FOLDER_MODAL.PARENT_FOLDER_LABEL", "The folder will be created inside ::folderName::", { folderName: parentFolder ? parentFolder : "" }),
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
      if (params.hasOwnProperty("folderId")) {
        let pathname = history.location.pathname.split("/folder/")[0];
        history.push(pathname + `/folder/${res.data.folder.id}/${replaceChar(res.data.folder.search)}`);
      } else {
        history.push(history.location.pathname + `/folder/${res.data.folder.id}/${replaceChar(res.data.folder.search)}`);
      }
    };
    let payload = {
      name: inputValue,
      bg_color: color,
    };
    if (params.hasOwnProperty("folderId")) {
      payload = {
        ...payload,
        folder_id: params.folderId,
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
      if (params.hasOwnProperty("folderId")) {
        let pathname = history.location.pathname.split("/folder/")[0];
        history.push(pathname + `/folder/${res.data.folder.id}/${replaceChar(res.data.folder.search)}`);
      }
    };
    const payload = {
      id: folder.id,
      name: inputValue,
      is_archived: true,
      bg_color: color,
    };
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
            <BlockPicker color={color} onChange={handleColorChange} />
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
