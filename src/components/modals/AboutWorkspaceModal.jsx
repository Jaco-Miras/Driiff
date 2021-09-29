import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputGroup, Label, Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { Avatar } from "../common";
import { CheckBox, DescriptionInput, FolderSelect, PeopleSelect } from "../forms";
import { useTranslationActions } from "../hooks";
import { ModalHeaderSection } from "./index";
import { toggleShowAbout } from "../../redux/actions/workspaceActions";
import { sessionService } from "redux-react-session";

const WrapperDiv = styled(InputGroup)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

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
    width: calc(100% - 40px);
  }

  > .form-control:not(:first-child) {
    border-radius: 5px;
  }

  .input-feedback {
    margin-left: 130px;
    @media all and (max-width: 480px) {
      margin-left: 0;
    }
  }
  label {
    margin: 0 20px 0 0;
    min-width: 530px;
  }
  .react-select-container {
    width: 100%;
    // z-index: 2;
  }
  .react-select__multi-value__label {
    align-self: center;
  }

  &.action-wrapper {
    z-index: 0;
    margin-top: 40px;

    .action-archive-wrapper {
      display: flex;
      width: 100%;

      .btn-archive {
        display: flex;
        margin-left: auto;
        text-decoration: underline;
        color: #a7abc3;
      }
    }
    label {
      margin: 0 20px 0 0;
      min-width: 200px;
    }
  }
  &.checkboxes {
    flex-flow: row !important;
    label {
      min-width: 0;
    }
  }
  &.external-select {
    .invalid-feedback {
      display: block;
    }
    .react-select__control {
      border-color: ${(props) => (props.valid === false ? "red" : "#cccccc")}!important;
    }
  }
  .workspace-radio-input {
    display: flex;
    > div:first-child {
      margin-right: 1rem;
    }
  }
  .react-select__multi-value__remove svg {
    display: none;
  }
  .react-select__indicators {
    display: none;
  }
  .react-select__control {
    background-color: #fff;
    .dark & {
      background-color: #191c20;
    }
  }
`;

const SelectFolder = styled(FolderSelect)`
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
  .has-not-accepted .react-select__multi-value__label {
    background: #33b5e5;
    color: #fff;
  }
  @media all and (max-width: 480px) {
    width: 100%;
  }
`;

const StyledDescriptionInput = styled(DescriptionInput)`
  .description-input {
    height: ${(props) => props.height}px;
    max-height: 300px;
  }

  label {
    min-width: 100%;
    font-weight: 500;
  }

  .ql-toolbar {
    bottom: 30px;
    left: 40px;
  }

  .invalid-feedback {
    position: absolute;
    bottom: 0;
    top: auto;
  }
`;

const AboutWorkspaceModal = (props) => {
  const { type, mode } = props.data;
  const { _t } = useTranslationActions();
  const dispatch = useDispatch();

  const [modal, setModal] = useState(true);
  const [dontShowPopUp, setDontShowPopUp] = useState(false);
  const workspace = useSelector((state) => state.workspaces.activeTopic);
  const users = useSelector((state) => state.users.users);
  const externalUsers = useSelector((state) => state.users.externalUsers);
  const folders = useSelector((state) => state.workspaces.folders);
  const loggedUser = useSelector((state) => state.session.user);

  const [userOptions, setUserOptions] = useState([]);
  const [externalUserOptions, setExternalUserOptions] = useState([]);

  const dictionary = {
    externalGuest: _t("WORKSPACE.EXTERNAL_GUEST", "External guest"),
    folder: _t("LABEL.FOLDER", "Folder"),
    team: _t("LABEL.TEAM", "Team"),
    description: _t("LABEL.DESCRIPTION", "Description"),
    aboutThisWorkspace: _t("MODAL.ABOUT_THIS_WORKSPACE_HEADER", "About this workspace"),
    goToWorkspace: _t("BUTTON.GO_TO_WORKSPACE", "Go to workspace"),
    checkboxLabel: _t("CHECKBOX.DONT_SHOW_POP_UP_AGAIN", "Don't show this pop up again"),

    workspaceName: _t("WORKSPACE.WORKSPACE_NAME", "Name"),
    workspaceInfo: _t("WORKSPACE.WORKSPACE_INFO", "A workspace centers the team communication about a subject. A workspace can only be connected to one folder."),
    lockWorkspace: _t("WORKSPACE.WORKSPACE_LOCK", "Make workspace private"),
    lockWorkspaceText: _t("WORKSPACE.WORKSPACE_LOCK.DESCRIPTION", "When a workspace is private it is only visible to the members of the workspace."),
    archiveThisWorkspace: _t("WORKSPACE.WORKSPACE_ARCHIVE", "Archive this workspace"),
    unArchiveThisWorkspace: _t("WORKSPACE.WORKSPACE_UNARCHIVE", "Un-archive this workspace"),

    addToFolder: _t("CHECKBOX.ADD_TO_FOLDER", "Add to folder"),

    archiveWorkspace: _t("HEADER.ARCHIVE_WORKSPACE", "Archive workspace"),
    archive: _t("BUTTON.ARCHIVE", "Archive"),
    unArchiveWorkspace: _t("HEADER.UNARCHIVE_WORKSPACE", "Un-archive workspace"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    archiveBodyText: _t("TEXT.ARCHIVE_CONFIRMATION", "Are you sure you want to archive this workspace?"),
    unArchiveBodyText: _t("TEXT.UNARCHIVE_CONFIRMATION", "Are you sure you want to un-archive this workspace?"),
    confirm: _t("WORKSPACE.CONFIRM", "Confirm"),
    lockedWorkspace: _t("WORKSPACE.LOCKED_WORKSPACE", "Private workspace"),
    lockedWorkspaceText: _t("WORKSPACE.LOCKED_WORKSPACE_TEXT", "Only members can view and search this workspace."),
  };

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
    sessionService.saveUser({ ...loggedUser, dontShowIds: loggedUser.dontShowIds ? [...loggedUser.dontShowIds, workspace.id] : [workspace.id] });
    if (dontShowPopUp) {
      dispatch(toggleShowAbout({ id: workspace.id, show_about: false }));
    }
  };

  const folderOptions = Object.values(folders)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((ws) => {
      return {
        ...ws,
        icon: "folder",
        value: ws.id,
        label: ws.name,
      };
    });

  useEffect(() => {
    const internalUsers = Object.values(users).filter((u) => {
      return u.type === "internal" && u.active === 1 && workspace.members.some((m) => m.id === u.id);
    });
    const userOptions = internalUsers.map((u) => {
      return {
        ...u,
        value: u.id,
        label: u.name,
      };
    });
    setUserOptions(userOptions);
  }, [Object.values(users).length]);

  useEffect(() => {
    if (externalUsers.length) {
      const externalUserOptions = externalUsers
        .filter((u) => {
          return u.type === "external" && workspace.members.some((m) => m.id === u.id);
        })
        .map((u) => {
          return {
            ...u,
            value: u.id,
            label: u.has_accepted ? `${u.email} | ${u.first_name} ${u.last_name} - ${u.external_company_name}` : `${u.email} `,
            dictionary: {
              peopleExternal: _t("PEOPLE.EXTERNAL", "External"),
              peopleInvited: _t("PEOPLE.INVITED", "Invited"),
            },
          };
        });
      setExternalUserOptions(externalUserOptions);
    }
  }, [externalUsers.length]);

  const toggleCheckBox = () => {
    setDontShowPopUp(!dontShowPopUp);
  };

  return (
    <Modal isOpen={modal} toggle={toggle} centered size="lg">
      <ModalHeaderSection toggle={toggle}>{dictionary.aboutThisWorkspace}</ModalHeaderSection>
      <ModalBody>
        <WrapperDiv className={"modal-input mt-0"}>
          <div>
            <div className="d-flex justify-content-start align-items-center">
              <Avatar imageLink={workspace.team_channel ? workspace.team_channel.icon_link : null} name={workspace.name} noDefaultClick={true} forceThumbnail={false} />
              <label className={"ml-2"}>{workspace.name}</label>
            </div>
          </div>
        </WrapperDiv>
        {workspace.folder_id !== null && (
          <WrapperDiv className={"modal-input"}>
            <Label for="people">{dictionary.folder}</Label>
            <SelectFolder options={folderOptions} value={folderOptions} isMulti={false} isClearable={false} isDisabled={true} isOptionDisabled={true} />
          </WrapperDiv>
        )}
        <WrapperDiv className={"modal-input"}>
          <Label for="people">{dictionary.team}</Label>
          <SelectPeople options={userOptions} value={userOptions} isDisabled={true} isOptionDisabled={true} isClearable={false} />
        </WrapperDiv>
        {workspace.is_shared && (
          <WrapperDiv className={"modal-input external-select"}>
            <Label for="people">{dictionary.externalGuest}</Label>
            <SelectPeople options={externalUserOptions} value={externalUserOptions} isDisabled={true} isOptionDisabled={true} />
          </WrapperDiv>
        )}
        <StyledDescriptionInput
          className="modal-description"
          height={window.innerHeight - 660}
          required
          showFileButton={true}
          defaultValue={workspace.description}
          mode={mode}
          disableBodyMention={true}
          modal={"workspace"}
          mentionedUserIds={[]}
          readOnly={true}
        />
        <WrapperDiv className="action-wrapper">
          <CheckBox name="pop_up" checked={dontShowPopUp} onClick={toggleCheckBox}>
            {dictionary.checkboxLabel}
          </CheckBox>
          <button className="btn btn-primary" onClick={toggle}>
            {dictionary.goToWorkspace}
          </button>
        </WrapperDiv>
      </ModalBody>
    </Modal>
  );
};

export default React.memo(AboutWorkspaceModal);
