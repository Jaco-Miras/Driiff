import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormGroup, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { useTranslationActions, useTeamActions, useToaster } from "../hooks";
import { ModalHeaderSection } from "./index";
import { InputFeedback, PeopleSelect } from "../forms";
import { EmailRegex } from "../../helpers/stringFormatter";
import { DropDocument } from "../dropzone/DropDocument";
import { Avatar, SvgIconFeather } from "../common";
import { addToModals } from "../../redux/actions/globalActions";
import { uploadBulkDocument } from "../../redux/services/global";

const Wrapper = styled(Modal)`
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

const WrapperDiv = styled(FormGroup)`
  .invalid-feedback {
    display: block;
  }
  .icon-wrapper {
    width: 60px;
    position: relative;
    justify-content: center;
    align-items: center;
    display: grid;

    .btn {
      background: #fff;
      position: absolute;
      right: 5px;
      bottom: -5px;
      padding: 3px;

      &:hover {
        background: #fff !important;
      }
    }
  }
  .name-wrapper {
    width: 100%;
  }
  .team-name-wrapper {
    position: relative;
  }
  .dimensions-label {
    position: absolute;
    bottom: -17px;
    font-size: 0.5rem;
    text-align: center;
    left: -4px;
    span {
      display: block;
    }
  }
`;

const SelectPeople = styled(PeopleSelect)`
  flex: 1 0 0;
  width: 1%;
  .react-select__control--menu-is-open {
    //border-color: #7a1b8b !important;
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
        //background: #8c3b9b;
        cursor: pointer;
      }
    }
  }
  .react-select__control--is-focused {
    //border-color: #7a1b8b !important;
    box-shadow: none;
  }
  .has-not-accepted .react-select__multi-value__label {
    background: #33b5e5;
    color: #fff;
  }
  @media all and (max-width: 480px) {
    width: 100%;
  }
`;

const CreateEditTeamModal = (props) => {
  const { type, team = null, mode = "create" } = props.data;

  const { _t } = useTranslationActions();
  const toaster = useToaster();
  const dictionary = {
    teamDescription: _t(
      "TEAM_MODAL.DESCRIPTION",
      "A team is a group of people. A team can be added to a workspace and all team members have access to that WS. When you remove a team member from a team, he doesn't have access to the connected workspaces anymore."
    ),
    teamName: _t("TEAM_MODAL.TEAM_NAME", "Team name"),
    teamMembers: _t("TEAM_MODAL.TEAM_MEMBERS", "Team members"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    createTeam: _t("TEAM_MODAL.CREATE_TEAM_BTN", "Create team"),
    updateTeam: _t("TEAM_MODAL.UPDATE_TEAM_BTN", "Update team"),
    createNewTeam: _t("TEAM_MODAL.CREATE_NEW_TEAM", "Create new team"),
    teamCreateSuccess: _t("TOASTER.TEAM_CREATE_SUCCESS", "Successfully created new team"),
    teamUpdateSuccess: _t("TOASTER.TEAM_UPDATE_SUCCESS", "Successfuly updated team"),
    feedbackTeamTaken: _t("FEEDBACK.TEAM_NAME_TAKEN", "Team name already taken"),
    parentTeam: _t("TEAM_MODAL.PARENT_TEAM", "Parent team"),
  };
  const dispatch = useDispatch();

  const { createTeam, updateTeam } = useTeamActions();

  const refs = {
    main: useRef(null),
    name: useRef(null),
    iconDropZone: useRef(null),
  };

  const user = useSelector((state) => state.session.user);
  const users = useSelector((state) => state.users.users);
  const teams = useSelector((state) => state.users.teams);
  const [inputNameValue, setInputNameValue] = useState(team ? team.name : "");
  const [teamInputValue, setTeamInputValue] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedParentTeam, setSelectedParentTeam] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [valid, setValid] = useState({
    isValid: null,
    validating: false,
    feedback: "",
  });

  const [showIconDropzone, setShowIconDropzone] = useState(false);
  const [iconLink, setIconLink] = useState(null);

  const toggle = () => {
    dispatch(clearModal({ type: type }));
  };

  const handleClose = () => {
    toggle();
  };

  const handleInputNameChange = (e) => {
    setInputNameValue(e.target.value);
  };

  const inputRef = useRef();

  const onOpened = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte", "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot", "huddle_bot"];

  const internalUsers = Object.values(users).filter((u) => {
    return u.type === "internal" && u.active === 1 && !botCodes.includes(u.email) && EmailRegex.test(u.email);
  });

  const userOptions = internalUsers.map((u) => {
    return {
      ...u,
      value: u.id,
      label: u.name,
      useLabel: true,
    };
  });

  const handleSelectUser = (e) => {
    if (e === null) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(e);
    }
  };

  const handleTeamInputChange = (e) => {
    setTeamInputValue(e);
  };

  useEffect(() => {
    setMounted(true);
    if (mode === "edit") {
      setSelectedUsers(
        team.members.map((m) => {
          return {
            ...m,
            value: m.id,
            label: m.name,
            useLabel: true,
          };
        })
      );

      if (team.parent_team) {
        const parent = Object.values(teams).find((t) => t.id === team.parent_team);
        if (parent) {
          let parentTeam = { ...parent, value: parent.id, label: parent.name, type: "TEAM" };
          setSelectedParentTeam(parentTeam);
        }
      }
    }
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (!mounted) return;
      if (mode === "edit" && inputNameValue.trim().toLowerCase() === team.name.trim().toLowerCase()) return;
      if (Object.values(teams).some((t) => t.name.trim().toLowerCase() === inputNameValue.trim().toLowerCase())) {
        setValid({
          isValid: false,
          validating: false,
          feedback: dictionary.feedbackTeamTaken,
        });
      } else {
        setValid({
          isValid: true,
          validating: false,
          feedback: "",
        });
      }
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [inputNameValue]);

  const teamOptions = Object.values(teams).map((u) => {
    return {
      ...u,
      value: u.id,
      label: u.name,
      type: "TEAM",
    };
  });

  const handleSelectParentTeam = (e) => {
    setSelectedParentTeam(e);
  };

  const handleTeamIconClick = () => {
    refs.iconDropZone.current.open();
  };

  const handleHideIconDropzone = () => {
    setShowIconDropzone(false);
  };

  const handleUseTeamIcon = (file, fileUrl) => {
    setIconLink({ file: file, icon_link: fileUrl });
  };

  const dropIconAction = (uploadedFiles) => {
    if (uploadedFiles.length === 0) {
      toaster.error("File type not allowed. Please use an image file.");
    } else if (uploadedFiles.length > 1) {
      toaster.warning("Multiple files detected. First selected image will be used.");
    }

    let modal = {
      type: "file_crop_upload",
      imageFile: uploadedFiles[0],
      mode: "profile",
      handleSubmit: handleUseTeamIcon,
    };

    dispatch(
      addToModals(modal, () => {
        handleHideIconDropzone();
      })
    );
  };

  async function uploadFiles(file, payload, cb) {
    let formData = new FormData();
    formData.append("files[0]", file);
    let uploadPayload = {
      user_id: user.id,
      file_type: "private",
      folder_id: null,
      fileOption: null,
      // options: {
      //   config: {
      //     onUploadProgress: handleOnUploadProgress,
      //   },
      // },
    };
    uploadPayload["files"] = formData;

    await new Promise((resolve, reject) => {
      resolve(uploadBulkDocument(uploadPayload));
    })
      .then((result) => {
        if (result.data) {
          if (mode === "create") {
            createTeam({ ...payload, file_id: result.data[0].id }, cb);
          } else {
            updateTeam({ ...payload, file_id: result.data[0].id }, cb);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleCreateTeam = () => {
    let payload = {
      name: inputNameValue,
      member_ids: selectedUsers.map((m) => m.value),
      parent_team: 0,
    };
    if (selectedParentTeam) {
      payload = {
        ...payload,
        parent_team: selectedParentTeam.value,
      };
    }
    const cb = (err, res) => {
      if (err) return;
      toaster.success(dictionary.teamCreateSuccess);
    };
    if (iconLink) {
      uploadFiles(iconLink.file, payload, cb);
    } else {
      createTeam(payload, cb);
    }
  };

  const handleUpdateTeam = () => {
    const removedMemberIds = team.member_ids.filter((id) => !selectedUsers.some((u) => u.value === id));
    let payload = {
      name: inputNameValue,
      id: team.id,
      member_ids: selectedUsers.map((m) => m.value),
      parent_team: 0,
      remove_member_ids: removedMemberIds,
    };
    if (selectedParentTeam) {
      payload = {
        ...payload,
        parent_team: selectedParentTeam.value,
      };
    }
    const cb = (err, res) => {
      if (err) return;
      toaster.success(dictionary.teamUpdateSuccess);
    };

    if (iconLink) {
      uploadFiles(iconLink.file, payload, cb);
    } else {
      updateTeam(payload, cb);
    }
  };

  const handleConfirm = () => {
    toggle();
    if (mode === "create") handleCreateTeam();
    else handleUpdateTeam();
  };

  return (
    <Wrapper ref={refs.main} isOpen={true} toggle={toggle} centered onOpened={onOpened} className={"single-input-modal"}>
      <ModalHeaderSection toggle={toggle}>{mode === "create" ? dictionary.createNewTeam : dictionary.updateTeam}</ModalHeaderSection>
      <ModalBody>
        <Label className={"modal-info mb-3"}>{dictionary.teamDescription}</Label>
        <WrapperDiv>
          <div className="d-flex justify-content-start align-items-center team-name-wrapper">
            <div className="icon-wrapper" onClick={handleTeamIconClick}>
              <DropDocument
                acceptType="imageOnly"
                hide={!showIconDropzone}
                ref={refs.iconDropZone}
                onDragLeave={handleHideIconDropzone}
                onDrop={({ acceptedFiles }) => {
                  dropIconAction(acceptedFiles);
                }}
                onCancel={handleHideIconDropzone}
              />
              {<Avatar imageLink={iconLink ? iconLink.icon_link : team ? team.icon_link : null} name={inputNameValue} noDefaultClick={true} forceThumbnail={false} type="TEAM" />}
              <span className="btn btn-outline-light btn-sm">
                <SvgIconFeather icon="pencil" />
              </span>
            </div>
            <div className="name-wrapper">
              <Label className={"modal-label"}>{dictionary.teamName}</Label>
              <div className="d-flex align-items-center mb-2">
                <Input valid={valid.isValid} invalid={valid.isValid === false} innerRef={inputRef} autoFocus defaultValue={mode === "create" ? "" : team.name} onChange={handleInputNameChange} />
              </div>
              <InputFeedback valid={valid.isValid}>{valid.feedback}</InputFeedback>
            </div>
            <span className="dimensions-label">
              <span>120 px by 120 px</span>
              <span>max: 3mb</span>
            </span>
          </div>
        </WrapperDiv>
        <WrapperDiv>
          <Label className={"modal-label"}>{dictionary.parentTeam}</Label>
          <div className="d-flex align-items-center mb-2">
            <SelectPeople options={teamOptions} value={selectedParentTeam} onChange={handleSelectParentTeam} isSearchable isMulti={false} isClearable={true} />
          </div>
        </WrapperDiv>
        <WrapperDiv>
          <Label className={"modal-label"}>{dictionary.teamMembers}</Label>
          <div className="d-flex align-items-center mb-2">
            <SelectPeople options={userOptions} value={selectedUsers} inputValue={teamInputValue} onChange={handleSelectUser} onInputChange={handleTeamInputChange} isSearchable isClearable={true} />
          </div>
        </WrapperDiv>
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={handleClose}>
          {dictionary.cancel}
        </button>
        <button disabled={inputNameValue.trim() === "" || valid.isValid === false} type="button" className="btn btn-primary" onClick={handleConfirm}>
          {mode === "create" ? dictionary.createTeam : dictionary.updateTeam}
        </button>
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(CreateEditTeamModal);
