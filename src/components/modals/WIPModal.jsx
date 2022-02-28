import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Input, InputGroup, Label, Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import DateTimePicker from "react-datetime-picker";
import { ModalHeaderSection } from "./index";
import { DropDocument } from "../dropzone/DropDocument";
import { clearModal } from "../../redux/actions/globalActions";
import { DescriptionInput, PeopleSelect, CheckBox, FolderSelect, InputFeedback } from "../forms";
import Select from "react-select";
import Proposals from "../panels/wip/Proposals";
import moment from "moment";
import { useWIPActions, useToaster } from "../hooks";
import { uploadBulkDocument } from "../../redux/services/global";
import { replaceChar } from "../../helpers/stringFormatter";
import { postWIP, putWIP } from "../../redux/actions/wipActions";
//import { validURL } from "../../helpers/urlContentHelper";

const WrapperDiv = styled(InputGroup)`
  display: flex;
  align-items: center;
  margin: 20px 0;
  .modal-description {
    margin: 0;
  }
  &.approval-prio {
    justify-content: space-between;
    flex-wrap: nowrap;
    z-index: 2;
  }
  &.inline-block {
    display: inline-block;
  }
`;

const StyledDescriptionInput = styled(DescriptionInput)`
  .description-input {
    height: calc(100% - 50px);
  }

  label {
    min-width: 100%;
    font-weight: 500;
  }

  .ql-toolbar {
    bottom: 5px;
    left: 70px;
  }

  .invalid-feedback {
    position: absolute;
    bottom: 0;
    top: auto;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-end;
`;

const StyledDateTimePicker = styled(DateTimePicker)`
  display: flex;
  .react-datetime-picker__wrapper {
    padding: 0.28rem;
    border-color: hsl(0, 0%, 80%);
  }
`;

const SelectSubject = styled(FolderSelect)`
  // flex: 1 0 0;
  // width: 1%;
  // @media all and (max-width: 480px) {
  //   width: 100%;
  // }
`;

const URLInputWrapper = styled.div`
  display: flex;
  align-items: center;
  label {
    margin: 0;
  }
  input {
    width: 100%;
  }
  .modal-label {
    min-width: 40px;
  }
  .input-feedback {
    margin-left: 0.5rem !important;
  }
`;

const prioOptions = [
  {
    label: "High",
    value: "high",
    color: "#f44",
  },
  {
    label: "Medium",
    value: "medium",
    color: "#fb3",
  },
  {
    label: "Low",
    value: "low",
    color: "#55acee",
  },
];

const WIPModal = (props) => {
  const { type, mode, wip = {} } = props.data;
  const dispatch = useDispatch();
  const toaster = useToaster();
  const inputRef = useRef();
  const dropzoneRef = useRef(null);
  const toasterRef = useRef(null);
  const firstURLInputRef = useRef(null);
  const URLInputRef = useRef();
  const URLTitleRef = useRef();
  const progressBar = useRef(0);
  const history = useHistory();
  const wipActions = useWIPActions();
  const allSubjects = useSelector((state) => state.wip.subjects);
  const user = useSelector((state) => state.session.user);
  const users = useSelector((state) => state.users.users);
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const userSettings = useSelector((state) => state.settings.user);
  const language = userSettings.GENERAL_SETTINGS.language;
  const date_format = userSettings.GENERAL_SETTINGS.date_format.replace("YYYY", "y").replace("DD", "d");
  //const time_format = userSettings.GENERAL_SETTINGS.time_format.replace("A", "a");
  const [modal, setModal] = useState(true);
  const [showNestedModal, setShowNestedModal] = useState(false);
  const [showDropzone, setShowDropzone] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState(mode === "edit" && wip ? wip.files : []);
  const [URLs, setURLs] = useState([
    {
      title: "",
      url: "",
    },
    {
      title: "",
      url: "",
    },
    {
      title: "",
      url: "",
    },
  ]);
  const [fileLinks, setFileLinks] = useState([]);
  //const [uploadedFiles, setUploadedFiles] = useState([]);
  const [title, setTitle] = useState(mode === "edit" && wip ? wip.title : "");
  const [subject, setSubject] = useState(mode === "edit" && wip ? { ...wip.subject, value: wip.subject.id, label: wip.subject.name } : null);
  const [subjectOptions, setSubjectOptions] = useState(
    allSubjects
      .filter((s) => s.topic_id === activeTopic.id)
      .map((s) => {
        return {
          id: s.id,
          label: s.name,
          value: s.name,
        };
      })
  );
  const [subjectInput, setSubjectInput] = useState("");
  const [creatingSubject, setCreatingSubject] = useState(false);
  const [description, setDesription] = useState({
    textOnly: mode === "edit" && wip ? wip.description : "",
    description: mode === "edit" && wip ? wip.description : "",
  });
  const [approver, setApprover] = useState(mode === "edit" && wip ? { ...wip.approver_users[0], label: wip.approver_users[0].name, value: wip.approver_users[0].id } : null);
  const [inlineImages, setInlineImages] = useState([]);
  const [addAnother, setAddAnother] = useState(false);
  //const [proposals, setProposals] = useState([]);
  const [deadline, setDeadline] = useState(wip && wip.deadline ? moment(wip.deadline.timestamp, "X").toDate() : moment().add(20, "m").toDate());
  const [priority, setPriority] = useState(
    mode === "edit" && wip
      ? prioOptions.find((o) => o.value === wip.priority)
      : {
          label: "Medium",
          value: "medium",
          color: "#fb3",
        }
  );
  const toggleAll = (saveDraft = false, showDeleteToaster = false) => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const toggle = () => {
    toggleAll();
  };

  const toggleNested = () => {
    setShowNestedModal((prevState) => !prevState);
  };

  const onOpenedNested = () => {
    if (firstURLInputRef.current) {
      firstURLInputRef.current.focus();
    }
  };

  const onDragEnter = () => {
    if (!showDropzone) setShowDropzone(true);
  };

  const onOpened = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleHideDropzone = () => {
    setShowDropzone(false);
  };

  const dropAction = (acceptedFiles) => {
    let selectedFiles = [];
    acceptedFiles.forEach((file) => {
      var bodyFormData = new FormData();
      bodyFormData.append("file", file);
      //let timestamp = Math.floor(Date.now());
      let timestamp = require("shortid").generate();
      if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif" || file.type === "image/webp") {
        selectedFiles.push({
          id: timestamp,
          code: timestamp,
          file_versions: [
            {
              rawFile: file,
              bodyFormData: bodyFormData,
              type: "IMAGE",
              id: timestamp,
              file_id: timestamp,
              status: false,
              src: URL.createObjectURL(file),
              name: file.name ? file.name : file.path,
              file_name: file.name ? file.name : file.path,
              size: file.size,
              uploader: user,
              mime_type: file.type,
            },
          ],
          link_versions: [],
        });
      } else if (file.type === "video/mp4") {
        selectedFiles.push({
          id: timestamp,
          code: timestamp,
          file_versions: [
            {
              rawFile: file,
              bodyFormData: bodyFormData,
              type: "VIDEO",
              id: timestamp,
              file_id: timestamp,
              status: false,
              src: URL.createObjectURL(file),
              name: file.name ? file.name : file.path,
              file_name: file.name ? file.name : file.path,
              size: file.size,
              uploader: user,
              mime_type: file.type,
            },
          ],
          link_versions: [],
        });
      } else {
        selectedFiles.push({
          id: timestamp,
          code: timestamp,
          file_versions: [
            {
              rawFile: file,
              bodyFormData: bodyFormData,
              type: "DOC",
              id: timestamp,
              file_id: timestamp,
              status: false,
              src: URL.createObjectURL(file),
              name: file.name ? file.name : file.path,
              file_name: file.name ? file.name : file.path,
              size: file.size,
              uploader: user,
              mime_type: file.type,
            },
          ],
          link_versions: [],
        });
      }
    });
    setAttachedFiles((prevState) => [...prevState, ...selectedFiles]);
    handleHideDropzone();
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSelectSubject = (e) => {
    setSubject(e);
  };

  const handleSubjectInputChange = (e) => {
    setSubjectInput(e);
  };

  const formatCreateLabel = (inputValue) => {
    return `Add ${inputValue}`;
  };

  const handleSubjectValidation = (inputValue, selectValue, selectOptions) => {
    if (inputValue && inputValue.trim() !== "" && subjectOptions.some((f) => f.label.trim().toLowerCase() === inputValue.trim().toLowerCase())) return false;
    if (inputValue && inputValue.trim() !== "" && selectOptions.length === 0) return true;
  };

  const handleCreateSubjectOption = (inputValue) => {
    const subjectName = inputValue.trim();
    setCreatingSubject(true);
    const tempId = require("shortid").generate();
    setSubjectOptions([...subjectOptions, { id: tempId, label: subjectName, value: subjectName, topic_id: activeTopic.id }]);
    setSubject({ id: tempId, label: subjectName, value: subjectName });
    let payload = {
      name: subjectName,
      group_id: activeTopic.id,
    };
    const callback = (err, res) => {
      setCreatingSubject(false);
      if (err) return;
      if (res) {
        setSubjectOptions([...subjectOptions, { id: res.data.id, label: res.data.name, value: res.data.name, topic_id: activeTopic.id }]);
        setSubject({ id: res.data.id, label: res.data.name, value: res.data.name });
      }
    };
    wipActions.createSubject(payload, callback);
  };

  const approverOptions = Object.values(users)
    .filter((u) => activeTopic.member_ids.some((mid) => mid === u.id) && user.id !== u.id)
    .map((m) => {
      return {
        ...m,
        label: m.name,
        value: m.id,
      };
    });

  const handleSelectApprover = (e) => {
    setApprover(e);
  };

  const dot = (color = "transparent") => ({
    alignItems: "center",
    display: "flex",

    ":before": {
      backgroundColor: color,
      borderRadius: 10,
      content: "\" \"",
      display: "block",
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });

  const prioStyles = {
    option: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };

  const handleOpenFileDialog = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };

  const handleShowURLForm = () => {
    toggleNested();
  };

  const handleMentionUser = (mention_ids) => {
    mention_ids = mention_ids.map((id) => parseInt(id)).filter((id) => !isNaN(id));
    // if (mention_ids.length) {
    //   //check for recipients/type
    //   let ignoreIds = [user.id, ...form.selectedUsers.map((u) => u.id), ...ignoredMentionedUserIds];
    //   let userIds = mention_ids.filter((id) => {
    //     return !ignoreIds.some((iid) => iid === id);
    //   });
    //   setMentionedUserIds(userIds.length ? userIds.map((id) => parseInt(id)) : []);
    // } else {
    //   setIgnoredMentionedUserIds([]);
    //   setMentionedUserIds([]);
    // }
  };

  const handleQuillChange = (content, delta, source, editor) => {
    const textOnly = editor.getText(content);
    if (editor.getContents().ops && editor.getContents().ops.length) {
      handleMentionUser(
        editor
          .getContents()
          .ops.filter((m) => m.insert.mention)
          .map((i) => i.insert.mention.id)
      );
    }

    setDesription({
      description: content,
      textOnly: textOnly,
    });
  };

  const handleOnUploadProgress = (progressEvent) => {
    const progress = progressEvent.loaded / progressEvent.total;
    if (toasterRef.current === null) {
      toasterRef.current = toaster.info(<div>uploading and sending</div>, { progress: progressBar.current, autoClose: true });
    } else {
      toaster.update(toasterRef.current, { progress: progress, autoClose: true });
    }
  };

  const handleNetWorkError = () => {
    if (toasterRef.curent !== null) {
      toaster.dismiss(toasterRef.current);
      toaster.error(<div>Unsuccessful</div>);
      toasterRef.current = null;
    }
  };

  async function uploadFiles(payload, type = "create") {
    let formData = new FormData();

    let uploadData = {
      user_id: user.id,
      file_type: "private",
      folder_id: null,
      fileOption: null,
      options: {
        config: {
          onUploadProgress: handleOnUploadProgress,
        },
      },
    };
    if (type === "edit") {
      const newAttachedFiles = attachedFiles.filter((a) => isNaN(a.id));
      newAttachedFiles.map((file, index) => formData.append(`files[${index}]`, file.file_versions[file.file_versions.length - 1].bodyFormData.get("file")));
    } else {
      attachedFiles.map((file, index) => formData.append(`files[${index}]`, file.file_versions[file.file_versions.length - 1].bodyFormData.get("file")));
    }

    uploadData["files"] = formData;

    await new Promise((resolve, reject) => resolve(uploadBulkDocument(uploadData)))
      .then((result) => {
        if (type === "edit") {
          payload = {
            ...payload,
            new_file_ids: [...result.data.map((res) => res.id)],
          };
          dispatch(
            putWIP(payload, (err, res) => {
              if (toasterRef.current) toaster.dismiss(toasterRef.current);
              if (err) return;
              if (activeTopic.folder_id) {
                history.push(`/workspace/wip/${activeTopic.folder_id}/${replaceChar(activeTopic.folder_name)}/${activeTopic.id}/${replaceChar(activeTopic.name)}/wip/${res.data.id}/${replaceChar(res.data.title)}`);
              } else {
                history.push(`/workspace/wip/${activeTopic.id}/${replaceChar(activeTopic.name)}/wip/${res.data.id}/${replaceChar(res.data.title)}`);
              }
            })
          );
        } else {
          payload = {
            ...payload,
            file_ids: [...result.data.map((res) => res.id), ...payload.file_ids],
          };
          dispatch(
            postWIP(payload, (err, res) => {
              if (toasterRef.current) toaster.dismiss(toasterRef.current);
              if (err) return;
              if (activeTopic.folder_id) {
                history.push(`/workspace/wip/${activeTopic.folder_id}/${replaceChar(activeTopic.folder_name)}/${activeTopic.id}/${replaceChar(activeTopic.name)}/wip/${res.data.id}/${replaceChar(res.data.title)}`);
              } else {
                history.push(`/workspace/wip/${activeTopic.id}/${replaceChar(activeTopic.name)}/wip/${res.data.id}/${replaceChar(res.data.title)}`);
              }
            })
          );
        }
      })
      .catch((error) => {
        handleNetWorkError(error);
      });
  }

  const handleSubmit = () => {
    if (mode === "create") {
      const deadlineDate = new Date(deadline);
      const payload = {
        title: title,
        description: description.description,
        approver_ids: [approver.id],
        group_id: activeTopic.id,
        deadline: moment.utc(deadlineDate).format("MM-DD-YYYY"),
        priority: priority.value,
        subject: subject.id,
        file_ids: [],
        file_links: fileLinks,
        mention_ids: [],
      };
      if (attachedFiles.length) uploadFiles(payload, "create");
      else {
        dispatch(
          postWIP(payload, (err, res) => {
            if (toasterRef.current) toaster.dismiss(toasterRef.current);
            if (err) return;
            if (activeTopic.folder_id) {
              history.push(`/workspace/wip/${activeTopic.folder_id}/${replaceChar(activeTopic.folder_name)}/${activeTopic.id}/${replaceChar(activeTopic.name)}/wip/${res.data.id}/${replaceChar(res.data.title)}`);
            } else {
              history.push(`/workspace/wip/${activeTopic.id}/${replaceChar(activeTopic.name)}/wip/${res.data.id}/${replaceChar(res.data.title)}`);
            }
          })
        );
      }
      toggleAll();
      if (addAnother)
        setTimeout(() => {
          wipActions.showModal();
        }, 2000);
    } else {
      // update
      const deadlineDate = new Date(deadline);
      const payload = {
        title: title,
        description: description.description,
        approver_ids: [approver.id],
        group_id: activeTopic.id,
        deadline: moment.utc(deadlineDate).format("MM-DD-YYYY"),
        priority: priority.value,
        subject: subject.id,
        new_file_ids: [],
        new_file_version: [],
        new_file_links: fileLinks,
        replace_file_version: [],
        remove_file_ids: [],
        mention_ids: [],
        id: wip.id,
      };
      const newAttachedFiles = attachedFiles.filter((a) => isNaN(a.id));
      if (newAttachedFiles.length) uploadFiles(payload, "edit");
      else {
        dispatch(
          putWIP(payload, (err, res) => {
            if (toasterRef.current) toaster.dismiss(toasterRef.current);
            if (err) return;
            if (activeTopic.folder_id) {
              history.push(`/workspace/wip/${activeTopic.folder_id}/${replaceChar(activeTopic.folder_name)}/${activeTopic.id}/${replaceChar(activeTopic.name)}/wip/${res.data.id}/${replaceChar(res.data.title)}`);
            } else {
              history.push(`/workspace/wip/${activeTopic.id}/${replaceChar(activeTopic.name)}/wip/${res.data.id}/${replaceChar(res.data.title)}`);
            }
          })
        );
      }
      toggleAll();
      if (addAnother)
        setTimeout(() => {
          wipActions.showModal();
        }, 2000);
    }
  };

  const toggleCheck = (e) => {
    setAddAnother(!addAnother);
  };

  const minDate = moment().add(1, "m").toDate();

  const handlePickDateTime = (e) => {
    setDeadline(e);
  };

  const handleSelectPriority = (e) => {
    setPriority(e);
  };

  const handleURLInputChange = (e, index) => {
    clearTimeout(URLInputRef.current);
    const value = e.target.value;
    const validUrl = require("valid-url");
    URLInputRef.current = setTimeout(() => {
      setURLs(
        URLs.map((data, k) => {
          if (k === index) {
            return { ...data, url: value, validURL: validUrl.isUri(value) ? true : false };
          } else {
            return data;
          }
        })
      );
    }, 1000);
    setURLs(
      URLs.map((data, k) => {
        if (k === index) {
          return { ...data, url: e.target.value };
        } else {
          return data;
        }
      })
    );
  };

  const handleURLTitleInputChange = (e, index) => {
    clearTimeout(URLTitleRef.current);
    const value = e.target.value;
    URLTitleRef.current = setTimeout(() => {
      setURLs(
        URLs.map((data, k) => {
          if (k === index) {
            return { ...data, title: value, validTitle: value.trim() !== "" };
          } else {
            return data;
          }
        })
      );
    }, 1000);
    setURLs(
      URLs.map((data, k) => {
        if (k === index) {
          return { ...data, title: e.target.value };
        } else {
          return data;
        }
      })
    );
  };

  const handleSaveURLs = () => {
    const links = URLs.filter((data) => data.url.trim() !== "" && data.title.trim() !== "");
    setFileLinks(links);
    toggleNested();
  };

  const handleAddMoreURLs = () => {
    setURLs([
      ...URLs,
      {
        title: "",
        validTitle: null,
        url: "",
        validURL: null,
      },
      {
        title: "",
        validTitle: null,
        url: "",
        validURL: null,
      },
    ]);
  };

  const handleRemoveProposalItem = (file, parentId) => {
    console.log(file);
  };

  return (
    <Modal isOpen={modal} toggle={toggle} size={"xl"} onOpened={onOpened} centered className="wip-modal">
      <ModalHeaderSection toggle={toggle}>Add new WIP</ModalHeaderSection>
      <ModalBody onDragOver={onDragEnter}>
        <Modal isOpen={showNestedModal} toggle={toggleNested} centered onOpened={onOpenedNested}>
          <ModalHeaderSection toggle={toggleNested}>Add URL</ModalHeaderSection>
          <ModalBody>
            {URLs.map((url, k) => {
              return (
                <div key={k} className="mb-4">
                  <URLInputWrapper className="mb-2">
                    <Label className={"modal-label"}>Title</Label>
                    <div className="w-100">
                      <Input
                        className="ml-2"
                        value={url.title}
                        onChange={(e) => handleURLTitleInputChange(e, k)}
                        autoFocus
                        innerRef={k === 0 ? firstURLInputRef : null}
                        valid={url.validTitle}
                        invalid={url.hasOwnProperty("validTitle") && url.validTitle === false && url.url.trim() !== ""}
                      />
                      <InputFeedback valid={url.validTitle}>{url.hasOwnProperty("validTitle") && url.validTitle ? "" : "Title required"}</InputFeedback>
                    </div>
                  </URLInputWrapper>
                  <URLInputWrapper className="mb-2">
                    <Label className={"modal-label"}>URL</Label>
                    <div className="w-100">
                      <Input className="ml-2" value={url.url} onChange={(e) => handleURLInputChange(e, k)} valid={url.validURL} invalid={url.hasOwnProperty("validURL") && url.validURL === false && url.url.trim() !== ""} />
                      <InputFeedback valid={url.valid}>{url.hasOwnProperty("validURL") && url.validURL ? "" : "Invalid url"}</InputFeedback>
                    </div>
                  </URLInputWrapper>
                </div>
              );
            })}
            <Button color="primary" onClick={handleAddMoreURLs}>
              Add more
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button className="btn-outline-secondary" onClick={toggleNested}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSaveURLs}>
              Save
            </Button>
          </ModalFooter>
        </Modal>
        <DropDocument
          hide={!showDropzone}
          ref={dropzoneRef}
          onDragLeave={handleHideDropzone}
          onDrop={({ acceptedFiles }) => {
            dropAction(acceptedFiles);
          }}
          onCancel={handleHideDropzone}
          attachedFiles={attachedFiles}
        />
        <WrapperDiv className={"modal-input mt-0"}>
          <div className="w-100">
            <Label className={"modal-label"} for="wip-title">
              Title
            </Label>
            <Input className="w-100" value={title} onChange={handleTitleChange} innerRef={inputRef} />
          </div>
        </WrapperDiv>
        <WrapperDiv className={"modal-input mt-0"}>
          <div className="w-100">
            <Label className={"modal-label"} for="wip-title">
              Subject
            </Label>
            <SelectSubject
              creatable={true}
              defaultOptions={subjectOptions}
              value={subject}
              onChange={handleSelectSubject}
              isMulti={false}
              isClearable={true}
              inputValue={subjectInput}
              isValidNewOption={handleSubjectValidation}
              onCreateOption={handleCreateSubjectOption}
              onInputChange={handleSubjectInputChange}
              formatCreateLabel={formatCreateLabel}
              //loadOptions={promiseOptions}
              isSearchable
            />
          </div>
        </WrapperDiv>
        <WrapperDiv className={"modal-input mt-0"}>
          <div className="w-100">
            <StyledDescriptionInput
              className="modal-description"
              showFileButton={true}
              onChange={handleQuillChange}
              onOpenFileDialog={handleOpenFileDialog}
              defaultValue={mode === "edit" && wip ? wip.description : ""}
              mode={mode}
              disableBodyMention={true}
              modal={"workspace"}
              setInlineImages={setInlineImages}
            />
          </div>
        </WrapperDiv>
        <WrapperDiv className={"modal-input mt-0"}>
          <div className="w-100">
            <Label className={"modal-label"} for="wip-title">
              Who needs to approve
            </Label>
            <PeopleSelect options={approverOptions} value={approver} onChange={handleSelectApprover} isClearable={true} isMulti={false} />
          </div>
        </WrapperDiv>
        <WrapperDiv className={"approval-prio mt-0"}>
          <div className="w-100 mr-2">
            <Label className={"modal-label"} for="wip-title">
              Approval deadline
            </Label>
            <StyledDateTimePicker minDate={mode === "edit" ? null : minDate} onChange={handlePickDateTime} value={deadline} locale={language} format={`${date_format}`} disableClock={true} />
          </div>
          <div className="w-100 ml-2">
            <Label className={"modal-label"} for="wip-title">
              Priority
            </Label>
            <Select defaultValue={prioOptions[1]} value={priority} options={prioOptions} styles={prioStyles} onChange={handleSelectPriority} />
          </div>
        </WrapperDiv>
        <WrapperDiv className={"modal-input mt-0 inline-block"}>
          <button className="btn btn-primary mr-2" onClick={handleOpenFileDialog}>
            Upload files
          </button>
          <button className="btn btn-primary" onClick={handleShowURLForm}>
            Add URL
          </button>
        </WrapperDiv>
        {(attachedFiles.length > 0 || fileLinks.length > 0) && (
          <WrapperDiv className={"modal-input mt-0"}>
            <Proposals
              showOptions={false}
              fromModal={true}
              items={[
                ...attachedFiles.map((a) => {
                  return { ...a, removeItem: handleRemoveProposalItem };
                }),
                ...fileLinks.map((link) => {
                  return {
                    ...link,
                    removeItem: handleRemoveProposalItem,
                    id: require("shortid").generate(),
                    link_versions: [{ ...link, id: require("shortid").generate(), media_link_title: link.title, media_link: link.url }],
                  };
                }),
              ]}
            />
          </WrapperDiv>
        )}
        <WrapperDiv className={"modal-input mt-0"}>
          <ButtonWrapper>
            <CheckBox name="must_read" checked={addAnother} onClick={toggleCheck} type="success">
              Add another
            </CheckBox>
            <button className="btn btn-outline-secondary ml-2" onClick={toggle}>
              Cancel
            </button>
            <button className="btn btn-primary ml-2" onClick={handleSubmit} disabled={title.trim() === "" || approver === null || (attachedFiles.length === 0 && fileLinks.length === 0) || creatingSubject || subject === null}>
              {mode === "edit" ? "Update" : "Submit"}
            </button>
          </ButtonWrapper>
        </WrapperDiv>
      </ModalBody>
    </Modal>
  );
};

export default WIPModal;
