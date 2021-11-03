import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormGroup, Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { useTranslationActions, useTeamActions, useToaster } from "../hooks";
import { ModalHeaderSection } from "./index";
import { PeopleSelect } from "../forms";

const Wrapper = styled(Modal)``;

const WrapperDiv = styled(FormGroup)`
  .invalid-feedback {
    display: block;
  }
`;

const SelectPeople = styled(PeopleSelect)`
  flex: 1 0 0;
  width: 1%;
`;

const AddToTeamModal = (props) => {
  const { type, user } = props.data;

  const { _t } = useTranslationActions();
  const toaster = useToaster();
  const dictionary = {
    addToTeamDescription: _t("ADD_TO_TEAM_MODAL.DESCRIPTION", "Add to team description"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    teams: _t("ADD_TO_TEAM_MODAL.TEAMS", "Teams"),
    addToTeam: _t("ADD_TO_TEAM_MODAL.HEADER_ADD_TO_TEAM", "Add to team"),
    add: _t("BUTTON.ADD_TO_Team", "Add"),
  };
  const dispatch = useDispatch();

  const { addMember } = useTeamActions();

  const refs = {
    main: useRef(null),
    name: useRef(null),
  };

  const teams = useSelector((state) => state.users.teams);
  const [selectedTeam, setSelectedTeam] = useState([]);

  const toggle = () => {
    dispatch(clearModal({ type: type }));
  };

  const handleClose = () => {
    toggle();
  };

  const handleAddToTeam = () => {
    const payload = {
      member_ids: [user.id],
      team_id: selectedTeam.id,
    };
    const cb = (err, res) => {
      if (err) return;
      toaster.success(_t("TOASTER.ADDED_TO_TEAM_SUCCESS", "Successfullly added ::userName:: to ::teamName::", { userName: user.name, teamName: selectedTeam.name }));
    };
    addMember(payload, cb);
  };

  const handleConfirm = () => {
    toggle();
    handleAddToTeam();
  };

  const inputRef = useRef();

  const onOpened = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const teamOptions = Object.values(teams)
    .filter((t) => !t.member_ids.some((id) => id === user.id))
    .map((u) => {
      return {
        ...u,
        value: u.id,
        label: u.name,
        type: "TEAM",
      };
    });

  const handleSelectTeam = (e) => {
    if (e === null) {
      setSelectedTeam([]);
    } else {
      setSelectedTeam(e);
    }
  };

  return (
    <Wrapper ref={refs.main} isOpen={true} toggle={toggle} centered onOpened={onOpened} className={"single-input-modal"}>
      <ModalHeaderSection toggle={toggle}>{dictionary.addToTeam}</ModalHeaderSection>
      <ModalBody>
        <Label className={"modal-info mb-3"}>{dictionary.addToTeamDescription}</Label>
        <WrapperDiv>
          <Label className={"modal-label"}>{dictionary.teams}</Label>
          <div className="d-flex align-items-center mb-2">
            <SelectPeople options={teamOptions} value={selectedTeam} onChange={handleSelectTeam} isSearchable isMulti={false} />
          </div>
        </WrapperDiv>
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={handleClose}>
          {dictionary.cancel}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleConfirm}>
          {dictionary.add}
        </button>
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(AddToTeamModal);
