import moment from "moment";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import styled from "styled-components";
import {clearModal, deleteDraft, deleteDraftReducer, saveDraft, updateDraft} from "../../redux/actions/globalActions";
import {postCreate, putPost} from "../../redux/actions/postActions";
import {uploadDocument} from "../../redux/services/global";
import {DatePicker, FileAttachments, SvgIconFeather} from "../common";
import {DropDocument} from "../dropzone/DropDocument";
import {CheckBox, DescriptionInput, FolderSelect, PeopleSelect} from "../forms";
import {useGetWorkspaceAndUserOptions, useToaster, useTranslation} from "../hooks";
import {ModalHeaderSection} from "./index";

const WrapperDiv = styled(InputGroup)`
  display: flex;
  align-items: center;
  margin: 20px 0;

  label {
    white-space: nowrap;
    margin: 0 20px 0 0;
    min-width: 109px;
  }
  button {
    margin-left: auto;
  }
  .react-select-container {
    width: 100%;
  }
  .react-select__multi-value__label {
    align-self: center;
  }

  &.more-option {
    margin-left: 130px;
    width: 100%;
    margin-right: -130px;
    @media all and (max-width: 480px) {
        margin-left: 0;
        margin-right: 0;
    }
  }
  &.schedule-post {
    width: 100%;
    label {
      margin: 0 20px 0 0;
    }
    .feather {
      color: #c7ced6;
    }
    .react-date-picker__wrapper {
      border: thin solid #c8ced5;
      border-radius: 4px;
      color: #c7ced6;
      .react-date-picker__inputGroup {
        padding: 0 6px;
      }
    }
    #placeholder {
      color: #c7ced6;
    }
    input {
      color: #505050;
      &::-webkit-input-placeholder {
        color: #c7ced6;
      }
    }
  }
  &.file-attachment-wrapper {
    margin-top: 0;
    margin-bottom: 20px;
  }
  .file-attachments {
    position: relative;
    max-width: 100%;
    margin-left: 128px;
    @media all and (max-width: 480px) {
        margin-left: 0;
    }
    ul {
      margin-right: 128px;
      margin-bottom: 0;
      @media all and (max-width: 480px) {
        padding-right: 40px;
      }
      li {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
`;

const SelectWorkspace = styled(FolderSelect)`
  flex: 1 0 0;
  width: 1%;
  @media all and (max-width: 480px) {
    width: 100%;
  }
`;

const SelectPeople = styled(PeopleSelect)`
  flex: 1 0 0;
  width: 1%;
  .react-select__control--menu-is-open {
    border-color: #7a1b8b !important;
    box-shadow: none;
  }
  .react-select__option {
    background-color: #ffffff;
  }
  .react-select__menu-list--is-multi > div {
    &:hover {
      background: #8c3b9b;
      color: #ffffff;
      cursor: pointer;
      .react-select__option {
        background: #8c3b9b;
        cursor: pointer;
      }
    }
  }
  .react-select__control--is-focused {
    border-color: #7a1b8b !important;
    box-shadow: none;
  }
  @media all and (max-width: 480px) {
    width: 100%;
  }
`;

const CheckBoxGroup = styled.div`
  overflow: hidden;
  transition: all 0.3s ease !important;
  width: 100%;

  &.enter-active {
    max-height: ${(props) => props.maxHeight}px;
    overflow: visible;
  }

  &.leave-active {
    max-height: 0px;
  }

  label {
    min-width: auto;
    font-size: 12.6px;

    &:hover {
      color: #972c86;
    }
  }
`;

const MoreOption = styled.div`
  cursor: pointer;
  cursor: hand;
  margin-bottom: 5px;
  &:hover {
    color: #972c86;
  }
  @media all and (max-width: 480px) {
      margin-top: 40px;
  }
  svg {
    transition: all 0.3s;
    width: 15px;
    margin-left: 5px;

    &.ti-plus {
      transform: rotate(-540deg);
    }
    &.rotate-in {
      transform: rotate(0deg);
    }
  }
`;

const StyledDescriptionInput = styled(DescriptionInput)`
    height: ${props => props.height}px;
    max-height: 300px;
`;

const StyledDatePicker = styled(DatePicker)``;

const CreateEditWorkspacePostModal = (props) => {
  const {type, mode, item = {}} = props.data;

  const inputRef = useRef();
  const dispatch = useDispatch();
  const toaster = useToaster();
  const [modal, setModal] = useState(true);
  const user = useSelector((state) => state.session.user);
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const [showMoreOptions, setShowMoreOptions] = useState(null);
  const [maxHeight, setMaxHeight] = useState(null);
  const [draftId, setDraftId] = useState(null);
  const [showDropzone, setShowDropzone] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [form, setForm] = useState({
    must_read: false,
    reply_required: false,
    no_reply: false,
    is_private: false,
    has_folder: false,
    title: "",
    selectedUsers: [],
    selectedWorkspaces: [],
    body: "",
    textOnly: "",
    show_at: null,
    end_at: null,
  });
  const formRef = {
    reactQuillRef: useRef(null),
    more_options: useRef(null),
    dropzone: useRef(null),
    arrow: useRef(null),
  };

  const [nestedModal, setNestedModal] = useState(false);
  const [closeAll, setCloseAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const {_t} = useTranslation();

  const dictionary = {
    createPost: _t("POST.CREATE_POST", "Create post"),
    createNewPost: _t("POST.CREATE_NEW_POST", "Create new post"),
    editPost: _t("POST.EDIT_POST", "Edit post"),
    postTitle: _t("POST.TITLE", "Post title"),
    workspace: _t("POST.WORKSPACE", "Workspace"),
    responsible: _t("POST.RESPONSIBLE", "Responsible"),
    description: _t("POST.DESCRIPTION", "Description"),
    saveAsDraft: _t("POST.SAVE_AS_DRAFT", "Save as draft"),
    moreOptions: _t("POST.MORE_OPTIONS", "More options"),
    replyRequired: _t("POST.REPLY_REQUIRED", "Reply required"),
    mustRead: _t("POST.MUST_READ", "Must read"),
    noReplies: _t("POST.NO_REPLIES", "No replies"),
    schedulePost: _t("POST.SCHEDULE", "Schedule post"),
    save: _t("POST.SAVE", "Save"),
    discard: _t("POST.DISCARD", "Discard"),
    draftBody: _t("POST.DRAFT_BODY", "Not sure about the content? Save it as a draft."),
  };

  const toggleNested = () => {
    setNestedModal(!nestedModal);
    setCloseAll(false);
  };

  const toggleAll = (saveDraft = false) => {
    setNestedModal(!nestedModal);
    setCloseAll(true);
    if (saveDraft) {
      handleSaveDraft();
    } else if (draftId) {
      dispatch(
        deleteDraft({
          type: "draft_post",
          draft_id: draftId,
        }, (err, res) => {
          dispatch(
            deleteDraftReducer({
              topic_id: activeTopic.id,
              draft_type: "draft_post",
              draft_id: draftId,
            }, (err, res) => {
              toaster.success(<>Draft <b>{form.title}</b> successfully removed.</>);
            })
          );
        })
      );
    }
    setModal(!modal);
    dispatch(clearModal({type: type}));
  };

  const toggle = () => {
    if (mode === "edit") {
      const post = item.post;

      if (form.title !== post.title) {
        toggleNested();
        return;
      }

      if (form.body !== post.body) {
        toggleNested();
        return;
      }

      if (form.end_at !== post.end_at) {
        toggleNested();
        return;
      }

      if (form.is_private !== post.is_personal) {
        toggleNested();
        return;
      }

      if (form.must_read !== post.is_must_read) {
        toggleNested();
        return;
      }

      if (form.no_reply !== post.is_must_reply) {
        toggleNested();
        return;
      }

      if (form.reply_required !== post.is_must_reply) {
        toggleNested();
        return;
      }

      if (form.show_at !== post.show_at) {
        toggleNested();
        return;
      }

      if (activeTopic) {
        if (form.selectedUsers.filter((u) => u.value !== user.id).length || form.selectedWorkspaces.filter((u) => u.value !== activeTopic.id).length) {
          toggleNested();
          return;
        }
      }
    } else {
      if (form.title !== "") {
        toggleNested();
        return;
      }

      if (form.body !== "<div><br></div>") {
        toggleNested();
        return;
      }

      if (form.end_at !== null) {
        toggleNested();
        return;
      }

      if (form.has_folder !== false) {
        toggleNested();
        return;
      }

      if (form.is_private !== false) {
        toggleNested();
        return;
      }

      if (form.must_read !== false) {
        toggleNested();
        return;
      }

      if (form.no_reply !== false) {
        toggleNested();
        return;
      }

      if (form.reply_required !== false) {
        toggleNested();
        return;
      }

      if (form.show_at !== null) {
        toggleNested();
        return;
      }

      if (activeTopic) {
        if (form.selectedUsers.filter((u) => u.value !== user.id).length || form.selectedWorkspaces.filter((u) => u.value !== activeTopic.id).length) {
          toggleNested();
          return;
        }
      }
    }

    toggleAll(false);
  };

  const handleSelectUser = (e) => {
    if (e === null) {
      setForm({
        ...form,
        selectedUsers: [],
      });
    } else {
      setForm({
        ...form,
        selectedUsers: e,
      });
    }
  };

  const handleSelectWorkspace = (e) => {
    if (e === null) {
      setForm({
        ...form,
        selectedWorkspaces: [],
      });
    } else {
      setForm({
        ...form,
        selectedWorkspaces: e,
      });
    }
  };

  const handleNameChange = (e) => {
    setForm({
      ...form,
      title: e.target.value,
    });
  };

  const handleSaveDraft = () => {
    if (!(form.title === "" && form.body === "" && !form.selectedUsers.length)) {
      let timestamp = Math.floor(Date.now() / 1000);
      let payload = {
        type: "draft_post",
        form: {
          ...form,
          must_read: form.must_read ? 1 : 0,
          must_reply: form.reply_required ? 1 : 0,
          read_only: form.no_reply ? 1 : 0,
          users_responsible: form.selectedUsers,
        },
        timestamp: timestamp,
        topic_id: activeTopic.id,
        id: timestamp,
        is_must_read: form.must_read ? 1 : 0,
        is_must_reply: form.must_reply ? 1 : 0,
        is_read_only: form.no_reply ? 1 : 0,
        created_at: {timestamp: timestamp},
      };
      if (draftId) {
        payload = {
          ...payload,
          draft_id: draftId,
        };
        dispatch(updateDraft(payload));
      } else {
        dispatch(saveDraft(payload));
      }
    }
  };

  const handleConfirm = () => {
    if (loading)
      return;

    setLoading(true);

    let payload = {
      title: form.title,
      body: form.body,
      responsible_ids: form.selectedUsers.map((u) => u.value),
      type: "post",
      personal: 0,
      recipient_ids: form.selectedWorkspaces.filter((ws) => ws.type !== "FOLDER").map((ws) => ws.value),
      must_read: form.must_read ? 1 : 0,
      must_reply: form.reply_required ? 1 : 0,
      read_only: form.no_reply ? 1 : 0,
      workspace_ids: form.selectedWorkspaces.filter((ws) => ws.type === "FOLDER").map((ws) => ws.value),
      show_at: form.show_at ? moment(form.show_at, "YYYY-MM-DD").format("YYYY-MM-DD") : form.end_at ? moment(new Date()).add(1, "day").format("YYYY-MM-DD") : null,
      end_at: form.end_at ? moment(form.end_at, "YYYY-MM-DD").format("YYYY-MM-DD") : null,
      tag_ids: [],
      file_ids: [],
      code_data: {
        base_link: `${process.env.REACT_APP_apiProtocol}${localStorage.getItem("slug")}.${process.env.REACT_APP_localDNSName}`
      }
    };
    if (draftId) {
      dispatch(
        deleteDraft({
          type: "draft_post",
          draft_id: draftId,
        }, () => {
          setLoading(false);
        })
      );
      dispatch(
        deleteDraft({
          type: "draft_post",
          draft_id: draftId,
        }, () => {
          setLoading(false);
        })
      )
    }
    if (mode === "edit") {
      payload = {
        ...payload,
        id: item.post.id,
        file_ids: uploadedFiles.map((f) => f.id),
      };
      if (attachedFiles.length) {
        uploadFiles(payload, "edit");
      } else {
        dispatch(putPost(payload, () => {
          setLoading(false);
        }));
      }
    } else {
      if (attachedFiles.length) {
        uploadFiles(payload, "create");
      } else {
        dispatch(postCreate(payload, () => {
          setLoading(false);
        }));
      }
    }
    toggleAll(false);
  };

  const handleQuillChange = (content, delta, source, editor) => {
    const textOnly = editor.getText(content);
    setForm({
      ...form,
      body: content,
      textOnly: textOnly,
    });
  };

  const toggleCheck = useCallback(
    (e) => {
      const name = e.target.dataset.name;
      switch (name) {
        case "no_reply": {
          setForm((prevState) => ({
            ...prevState,
            [name]: !prevState[name],
            reply_required: !prevState[name] === true ? false : prevState["reply_required"],
          }));
          break;
        }
        case "reply_required": {
          setForm((prevState) => ({
            ...prevState,
            [name]: !prevState[name],
            no_reply: !prevState[name] === true ? false : prevState["no_reply"],
          }));
          break;
        }
        default: {
          setForm((prevState) => ({
            ...prevState,
            [name]: !prevState[name],
          }));
        }
      }
    },
    [setForm]
  );

  const toggleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  useEffect(() => {
    if (activeTopic !== null && item.hasOwnProperty("draft")) {
      setForm(item.draft.form);
      setDraftId(item.draft.draft_id);
    } else if (activeTopic !== null && mode !== "edit") {
      setForm({
        ...form,
        selectedWorkspaces: [
          {
            ...activeTopic,
            value: activeTopic.id,
            label: activeTopic.name,
          },
        ],
        selectedUsers: [
          {
            id: user.id,
            value: user.id,
            label: user.name,
            name: user.name,
            first_name: user.first_name,
            profile_image_link: user.profile_image_link,
          },
        ],
      });
    } else if (mode === "edit" && item.hasOwnProperty("post")) {
      setForm({
        ...form,
        body: item.post.body,
        textOnly: item.post.body,
        title: item.post.title,
        hast_folder: activeTopic.hasOwnProperty("workspace_id"),
        no_reply: item.post.is_read_only,
        must_read: item.post.is_must_read,
        reply_required: item.post.is_must_reply,
        selectedWorkspaces: [
          {
            ...activeTopic,
            value: activeTopic.id,
            label: activeTopic.name,
          },
        ],
        selectedUsers: item.post.users_responsible.map((u) => {
          return {
            ...u,
            value: u.id,
            label: u.name,
          };
        }),
        file_ids: item.post.files.map((f) => f.id),
        show_at: item.post.show_at,
        end_at: item.post.end_at
      });
      if ((item.post.end_at !== null || item.post.show_at !== null) || (item.post.is_read_only || item.post.is_must_read || item.post.is_must_reply)) {
        if (formRef.more_options.current !== null) {
          setMaxHeight(formRef.more_options.current.offsetHeight);
        }
        setShowMoreOptions(true);
      }
      setUploadedFiles(
        item.post.files.map((f) => {
          return {
            ...f,
            rawFile: f,
          };
        })
      );
    }
  }, []);

  useEffect(() => {
    if (formRef.more_options.current !== null && maxHeight === null && draftId === null) {
      setMaxHeight(formRef.more_options.current.offsetHeight);
      setShowMoreOptions(!!(item.post !== null && (item.post.is_read_only || item.post.is_must_read || item.post.is_must_reply)));
    }
  }, [formRef, setMaxHeight]);

  const handleSelectStartDate = useCallback(
    (value) => {
      setForm((f) => ({
        ...f,
        show_at: value,
      }));
    },
    [setForm]
  );

  const handleSelectEndDate = useCallback(
    (value) => {
      setForm((f) => ({
        ...f,
        end_at: value,
      }));
    },
    [setForm]
  );

  const handleOpenFileDialog = () => {
    if (formRef.dropzone.current) {
      formRef.dropzone.current.open();
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
      let timestamp = Math.floor(Date.now());
      //let shortFileId = require("shortid").generate();
      if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif" || file.type === "image/webp") {
        selectedFiles.push({
          rawFile: file,
          bodyFormData: bodyFormData,
          type: "IMAGE",
          id: timestamp,
          status: false,
          src: URL.createObjectURL(file),
          name: file.name ? file.name : file.path,
          uploader: user,
        });
      } else if (file.type === "video/mp4") {
        selectedFiles.push({
          rawFile: file,
          bodyFormData: bodyFormData,
          type: "VIDEO",
          id: timestamp,
          status: false,
          src: URL.createObjectURL(file),
          name: file.name ? file.name : file.path,
          uploader: user,
        });
      } else {
        selectedFiles.push({
          rawFile: file,
          bodyFormData: bodyFormData,
          type: "DOC",
          id: timestamp,
          status: false,
          src: URL.createObjectURL(file),
          name: file.name ? file.name : file.path,
          uploader: user,
        });
      }
    });
    setAttachedFiles((prevState) => [...prevState, ...selectedFiles]);
    handleHideDropzone();
  };

  async function uploadFiles(payload, type = "create") {
    await Promise.all(
      attachedFiles.map((file) =>
        uploadDocument({
          user_id: user.id,
          file: file.bodyFormData,
          file_type: "private",
          folder_id: null,
        })
      )
    ).then((result) => {
      if (type === "edit") {
        payload = {
          ...payload,
          file_ids: [...result.map((res) => res.data.id), ...payload.file_ids],
        };
        dispatch(putPost(payload));
      } else {
        payload = {
          ...payload,
          file_ids: result.map((res) => res.data.id),
        };
        dispatch(postCreate(payload));
      }
    });
  }

  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prevState) => prevState.filter((f) => f.id !== parseInt(fileId)));
    setAttachedFiles((prevState) => prevState.filter((f) => f.id !== parseInt(fileId)));
  }

  const [wsOptions, userOptions] = useGetWorkspaceAndUserOptions(form.selectedWorkspaces, activeTopic);

  const onOpened = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  console.log(form,item)

  return (
    <Modal isOpen={modal} toggle={toggle} centered size={"lg"} onOpened={onOpened}>
      <ModalHeaderSection
        toggle={toggle}>{mode === "edit" ? dictionary.editPost : dictionary.createNewPost}</ModalHeaderSection>
      <ModalBody>
        <Modal isOpen={nestedModal} toggle={toggleNested} onClosed={closeAll ? toggle : undefined} centered>
          <ModalHeader>{dictionary.saveAsDraft}</ModalHeader>
          <ModalBody>{dictionary.draftBody}</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => toggleAll(true)}>
              {dictionary.save}
            </Button>
            <Button color="secondary" onClick={() => toggleAll(false)}>
              {dictionary.discard}
            </Button>
          </ModalFooter>
        </Modal>
        <DropDocument
          hide={!showDropzone}
          ref={formRef.dropzone}
          onDragLeave={handleHideDropzone}
          onDrop={({acceptedFiles}) => {
            dropAction(acceptedFiles);
          }}
          onCancel={handleHideDropzone}
          attachedFiles={attachedFiles}
        />
        <WrapperDiv>
          <Label for="post-title">{dictionary.postTitle}</Label>
          <Input style={{borderRadius: "5px"}} defaultValue={mode === "edit" ? "" : ""} value={form.title}
                 onChange={handleNameChange} innerRef={inputRef}/>
        </WrapperDiv>
        <WrapperDiv>
          <Label for="workspace">{dictionary.workspace}</Label>
          <SelectWorkspace options={wsOptions} value={form.selectedWorkspaces}
                           onChange={handleSelectWorkspace} isMulti={true} isClearable={true}/>
        </WrapperDiv>
        <WrapperDiv>
          <Label for="responsible">{dictionary.responsible}</Label>
          <SelectPeople options={userOptions} value={form.selectedUsers} onChange={handleSelectUser}/>
        </WrapperDiv>
        <StyledDescriptionInput
          height={window.innerHeight - 660}
          showFileButton={true}
          onChange={handleQuillChange}
          onOpenFileDialog={handleOpenFileDialog}
          defaultValue={item.hasOwnProperty("draft") ? form.body : mode === "edit" ? item.post.body : ""}
          mode={mode}
          members={activeTopic ? activeTopic.members : []}
          required
          /*valid={valid.description}
                     feedback={feedback.description}*/
        />
        {(attachedFiles.length > 0 || uploadedFiles.length > 0) && (
          <WrapperDiv className="file-attachment-wrapper">
            <FileAttachments attachedFiles={[...attachedFiles, ...uploadedFiles]}
                             handleRemoveFile={handleRemoveFile}/>
          </WrapperDiv>
        )}
        <WrapperDiv className="more-option">
          <MoreOption onClick={toggleMoreOptions}>
            {dictionary.moreOptions}
            <SvgIconFeather icon="chevron-down"
                            className={`sub-menu-arrow ti-angle-up ${showMoreOptions ? "ti-minus rotate-in" : " ti-plus"}`}/>
          </MoreOption>

          <CheckBoxGroup ref={formRef.more_options} maxHeight={maxHeight}
                         className={showMoreOptions === null ? "" : showMoreOptions ? "enter-active" : "leave-active"}>
            <div className="d-flex">
              <CheckBox name="must_read" checked={form.must_read} onClick={toggleCheck} type="danger">
                {dictionary.mustRead}
              </CheckBox>
              <CheckBox name="reply_required" checked={form.reply_required} onClick={toggleCheck}
                        type="warning">
                {dictionary.replyRequired}
              </CheckBox>
              <CheckBox name="no_reply" checked={form.no_reply} onClick={toggleCheck} type="info">
                {dictionary.noReplies}
              </CheckBox>
            </div>

            <WrapperDiv className="schedule-post">
              <Label>{dictionary.schedulePost}</Label>
              <SvgIconFeather className="mr-2" width={18} icon="calendar"/>
              <StyledDatePicker className="mr-2 start-date" onChange={handleSelectStartDate}
                                value={form.show_at}
                                minDate={new Date(new Date().setDate(new Date().getDate() + 1))}/>
              <StyledDatePicker className="end-date" onChange={handleSelectEndDate} value={form.end_at}
                                minDate={new Date(new Date().setDate(new Date().getDate() + 1))}/>
            </WrapperDiv>
          </CheckBoxGroup>
        </WrapperDiv>
        <WrapperDiv>
          <button className="btn btn-primary"
                  disabled={form.selectedUsers.length === 0 || form.title === "" || form.textOnly.trim() === "" || form.selectedWorkspaces.length === 0}
                  onClick={handleConfirm}>
            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"/>}
            {mode === "edit" ? "Update post" : "Create post"}
          </button>
        </WrapperDiv>
      </ModalBody>
    </Modal>
  );
};

export default CreateEditWorkspacePostModal;
