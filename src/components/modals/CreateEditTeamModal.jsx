import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormGroup, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { useTranslationActions, useTeamActions, useToaster } from "../hooks";
import { ModalHeaderSection } from "./index";
import { InputFeedback, PeopleSelect } from "../forms";
import { EmailRegex } from "../../helpers/stringFormatter";

const Wrapper = styled(Modal)``;

const WrapperDiv = styled(FormGroup)`
  .invalid-feedback {
    display: block;
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
  };

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

  const toggle = () => {
    dispatch(clearModal({ type: type }));
  };

  const handleClose = () => {
    toggle();
  };

  const handleInputNameChange = (e) => {
    setInputNameValue(e.target.value);
  };

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
    createTeam(payload, cb);
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
    updateTeam(payload, cb);
  };

  const handleConfirm = () => {
    toggle();
    if (mode === "create") handleCreateTeam();
    else handleUpdateTeam();
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

  return (
    <Wrapper ref={refs.main} isOpen={true} toggle={toggle} centered onOpened={onOpened} className={"single-input-modal"}>
      <ModalHeaderSection toggle={toggle}>{mode === "create" ? dictionary.createNewTeam : dictionary.updateTeam}</ModalHeaderSection>
      <ModalBody>
        <Label className={"modal-info mb-3"}>{dictionary.teamDescription}</Label>
        <WrapperDiv>
          <Label className={"modal-label"}>{dictionary.teamName}</Label>
          <div className="d-flex align-items-center mb-2">
            <Input valid={valid.isValid} invalid={valid.isValid === false} innerRef={inputRef} autoFocus defaultValue={mode === "create" ? "" : team.name} onChange={handleInputNameChange} />
          </div>
          <InputFeedback valid={valid.isValid}>{valid.feedback}</InputFeedback>
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
