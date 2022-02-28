import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, Input, Label } from "reactstrap";
import styled from "styled-components";
import { SvgIcon, SvgIconFeather } from "../common";
import { clearModal, saveInputData } from "../../redux/actions/globalActions";
import { useToaster, useWIPFileActions } from "../hooks";
import { uploadBulkDocument } from "../../redux/services/global";
import { useTranslationActions } from "../hooks";
import { ModalHeaderSection } from "./index";
import { patchFileVersion } from "../../redux/actions/wipActions";

const ModalWrapper = styled(Modal)`
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

const DescriptionInputWrapper = styled.div`
  flex: 1 0 0;
  width: 100%;
  position: relative;
`;

const FilesPreviewContainer = styled.div`
  width: 100%;
  margin-top: 15px;
  border: 1px solid #afb8bd;
  border-radius: 5px;
  min-height: 350px;
  ul {
    margin: 0;
    padding: 10px 0;
    align-items: center;
    justify-content: ${(props) => (props.hasOneFile ? "center" : "flex-start")};
    display: flex;
    overflow-x: auto;
  }
  li {
    list-style: none;
    padding: 0 10px;
    border-radius: 8px;
    position: relative;

    img {
      width: 100%;
      height: auto;
      border: 1px solid #ddd;
      object-fit: cover;
      border-radius: inherit;
    }
    span {
      position: absolute;
      top: -10px;
      right: -6px;
      display: none;
      color: black;
    }
    span:hover {
      color: ${(props) => props.theme.colors.primary};
      cursor: pointer;
    }
    .app-file-list {
      height: 158px;
      width: 158px;
      margin-bottom: 0;
    }
    &:first-of-type {
      padding-left: 15px;
    }
    &:last-of-type {
      padding-right: 15px;
    }
    .remove-upload {
      background: rgba(0, 0, 0, 0.8);
      color: #ffffff;
      border-radius: 50%;
      position: absolute;
      height: 20px;
      width: 20px;
      display: ${(props) => (!props.hasOneFile ? "flex" : "none")};
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border: 2px solid #fff;
      top: -8px;
      right: 2px;
      &:hover {
        background: rgba(0, 0, 0, 1);
      }
      svg {
        width: 12px;
        height: 12px;
      }
    }
  }
  li:hover span {
    display: ${(props) => (props.hasOneFile ? "none" : "block")};
  }
  &:after {
    content: "";
    width: 100px;
  }
`;

const DocDiv = styled.div``;

const StyledModalFooter = styled(ModalFooter)`
  flex-wrap: nowrap;
`;

const WIPFileModal = (props) => {
  const { type, droppedFiles, file, mode } = props.data;

  const history = useHistory();
  const progressBar = useRef(0);
  const toaster = useToaster();
  const fileActions = useWIPFileActions();
  const { _t } = useTranslationActions();
  const dispatch = useDispatch();
  const toasterRef = useRef(null);
  const user = useSelector((state) => state.session.user);
  const [modal, setModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(droppedFiles);
  const [versionName, setVersionName] = useState("");

  const dictionary = {
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    upload: _t("BUTTON.UPLOAD", "Upload"),
    fileUpload: _t("FILE_UPLOAD", "File upload"),
    quillPlaceholder: _t("FORM.REACT_QUILL_PLACEHOLDER", "Write great things here..."),
    fileUploadLabel: _t("LABEL.EXTERNAL_WORKSPACE_FILES", "Files added to workspace can be seen by internal and external accounts"),
    uploading: _t("FILE_UPLOADING", "Uploading File"),
    unsuccessful: _t("FILE_UNSUCCESSFULL", "Upload File Unsuccessful"),
  };

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
    dispatch(saveInputData({ sent: false }));
  };

  const handleRemoveFile = (file) => {
    setFiles(files.filter((f) => f.id !== file.id));
  };

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const uploadFiles = () => {
    if (files.filter((f) => typeof f.id === "string").length) {
      // new endpint
      let formData = new FormData();
      let payload = {
        user_id: user.id,
        file_type: "private",
        folder_id: null,
        // fileOption: fileOption,
        cancelToken: source.token,
        options: {
          config: {
            onUploadProgress: handleOnUploadProgress,
          },
        },
      };
      files
        .filter((f) => {
          return typeof f.id === "string";
        })
        .map((file, index) => {
          formData.append(`files[${index}]`, file.bodyFormData.get("file"));
        });
      payload["files"] = formData;
      uploadBulkDocument(payload)
        .then((result) => {
          const resFiles = [...files.filter((f) => typeof f.id !== "string"), ...result.data.map((res) => res)];
          handleSubmit(resFiles);
          toaster.dismiss(toasterRef.current);
        })
        .catch((error) => {
          handleNetWorkError(error);
        });
    }
  };

  const handleNetWorkError = () => {
    if (toasterRef.curent !== null) {
      setLoading(false);
      toaster.dismiss(toasterRef.current);
      toaster.error(<div>{dictionary.unsuccessful}.</div>);
      toasterRef.current = null;
    }
  };

  const CloseButton = ({ closeToast }) => (
    <i
      className="material-icons"
      onClick={() => {
        setTimeout(() => {
          source.cancel();
        }, 1000);
        closeToast();
        toasterRef.current = null;
      }}
    >
      cancel
    </i>
  );

  const handleOnUploadProgress = (progressEvent) => {
    const progress = progressEvent.loaded / progressEvent.total;
    if (toasterRef.current === null) {
      toasterRef.current = toaster.info(<div>{dictionary.uploading}.</div>, { progress: progressBar.current, autoClose: true, closeButton: CloseButton });
    } else {
      toaster.update(toasterRef.current, { progress: progress, autoClose: true });
    }
  };

  const handleUpload = () => {
    if (!loading) {
      setLoading(true);
      uploadFiles();
      dispatch(clearModal({ type: type }));
    }
  };

  const handleSubmit = (uFiles) => {
    const newFile = uFiles[0];
    if (mode === "replace") {
      const payload = {
        file_id: newFile.id,
        file_version_id: file.file_version_id,
      };
      dispatch(patchFileVersion(payload));
    } else {
      const cb = (err, res) => {
        if (err) return;
        if (res.data) {
          let splitUrl = history.location.pathname.split("/");
          splitUrl.pop();
          const redirectUrl = splitUrl.join("/") + `/${res.data.data.id}`;
          history.push(redirectUrl);
        }
      };
      const payload = {
        media_id: file.media_id,
        version_name: versionName,
        current_version_id: file.id,
        file_id: newFile.id,
      };
      fileActions.uploadNewVersion(payload, cb);
    }
  };

  const handleInputChange = (e) => {
    setVersionName(e.target.value);
  };

  return (
    <ModalWrapper isOpen={modal} toggle={toggle} size={"lg"} centered>
      <ModalHeaderSection toggle={toggle}>{dictionary.fileUpload}</ModalHeaderSection>
      <ModalBody>
        {mode === "new_version" && (
          <DescriptionInputWrapper>
            <Label className={"modal-label"}>Version name</Label>
            <Input className="w-100" value={versionName} onChange={handleInputChange} />
          </DescriptionInputWrapper>
        )}
        <FilesPreview files={files} onRemoveFile={handleRemoveFile} />
      </ModalBody>
      <StyledModalFooter>
        <Button outline color="secondary" onClick={toggle}>
          {dictionary.cancel}
        </Button>
        <Button color="primary" onClick={handleUpload} disabled={mode === "new_version" && versionName.trim() === ""}>
          {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
          {dictionary.upload}
        </Button>
      </StyledModalFooter>
    </ModalWrapper>
  );
};

const FilesPreview = (props) => {
  const { files, onRemoveFile } = props;

  const handleRemoveFile = (file) => {
    onRemoveFile(file);
  };

  return (
    <FilesPreviewContainer hasOneFile={files.length === 1}>
      <ul>
        {files.map((file, i) => {
          return (
            <li key={i}>
              <div className="remove-upload" aria-label="close" onClick={() => handleRemoveFile(file)}>
                <SvgIconFeather icon="x" />
              </div>
              {file.type === "IMAGE" && <img alt="file" src={file.src} />}
              {file.type !== "IMAGE" && (
                <DocDiv className="card app-file-list">
                  <div className="app-file-icon">
                    <SvgIcon icon={"document"} width="28" height="32" />
                  </div>
                  <div className="p-2 small">{file.name}</div>
                </DocDiv>
              )}
            </li>
          );
        })}
      </ul>
    </FilesPreviewContainer>
  );
};

export default React.memo(WIPFileModal);
