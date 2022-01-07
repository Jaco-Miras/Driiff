import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { clearModal } from "../../redux/actions/globalActions";
import { FormInput, PeopleSelect } from "../forms";
import { useTranslationActions } from "../hooks";
import { ModalHeaderSection } from "./index";
import { SvgIconFeather } from "../common";
import { EmailRegex } from "../../helpers/stringFormatter";
import styled from "styled-components";

const ModalWrapper = styled(Modal)`
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
  .PhoneInput input {
    padding: 0.375rem 0.75rem;
    border-radius: 6px;
  }
`;
const MoreMemberButton = styled.span`
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SelectPeople = styled(PeopleSelect)`
  // flex: 1 0 0;
  // width: 1%;
`;

const StyledTable = styled.table`
  .form-group {
    margin: 0;
  }
  .team-th {
    min-width: 300px;
  }
  overflow: unset;
`;

const InvalidPhoneLabel = styled.label`
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
`;

const InvitedUsersModal = (props) => {
  const { submitText = "Submit", cancelText = "Cancel", onPrimaryAction, hasLastName = false, invitations = [], type, fromRegister } = props.data;

  const [invitationItems, setInvitationItems] = useState(invitations);

  const [formResponse, setFormResponse] = useState({
    valid: {},
    message: {},
  });

  const { _t } = useTranslationActions();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [binary, setBinary] = useState(false);
  //const [phoneNumber, setPhoneNumber] = useState();
  const user = useSelector((state) => state.session.user);
  const teams = useSelector((state) => state.users.teams);

  const dictionary = {
    closeButton: _t("BUTTON.CLOSE", "Close"),
    availableToAdmin: _t("TOOLTIP.AVAILABLE_TO_ADMIN", "This option is only available for administrators"),
    userInvitations: _t("LABEL.USER_INVITATIONS", "User invitations"),
    firstName: _t("INVITE.FIRST_NAME", "First name"),
    lastName: _t("INVITE.LAST_NAME", "Last name"),
    email: _t("INVITE.EMAIL", "Email"),
    name: _t("INVITE.NAME", "Name"),
    addUserToteams: _t("INVITE_USERS.ADD_USER_TO_TEAMS", "Add user to teams"),
    teamLabel: _t("TEAM", "Team"),
  };

  const teamOptions = !fromRegister
    ? Object.values(teams)
        .filter((t) => !t.member_ids.some((id) => id === user.id))
        .map((u) => {
          return {
            ...u,
            value: u.id,
            label: `${dictionary.teamLabel} ${u.name}`,
            useLabel: true,
            type: "TEAM",
          };
        })
    : [];

  const handleInputChange = (e) => {
    e.persist();
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.name;
    setInvitationItems((prevState) => {
      prevState[id][name] = e.target.value;
      return prevState;
    });
    setBinary((prevState) => !prevState);
  };

  const handleAddItem = (e) => {
    setInvitationItems((prevState) => {
      if (hasLastName) {
        prevState.push({
          first_name: "",
          last_name: "",
          email: "",
        });
      } else {
        prevState.push({
          name: "",
          email: "",
        });
      }
      return prevState;
    });
    setBinary((prevState) => !prevState);
  };

  const handleDeleteItem = (e) => {
    const id = e.currentTarget.dataset.id;
    setInvitationItems((prevState) => {
      prevState.splice(id, 1);
      return prevState;
    });
    setBinary((prevState) => !prevState);
  };

  const deleteItemByIndex = (index) => {
    setInvitationItems((prevState) => {
      prevState.splice(index, 1);
      return prevState;
    });
  };

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const _validateForm = () => {
    let isValid = true;
    let valid = {};
    let message = {};
    for (let i = 0; i < invitationItems.length; i++) {
      if (hasLastName) {
        if (invitationItems[i].first_name !== "" || invitationItems[i].last_name !== "" || invitationItems[i].email !== "" || invitationItems[i].phone_number !== undefined) {
          if (typeof valid[i] === "undefined") {
            valid[i] = {};
            message[i] = {};
          }

          if (invitationItems[i].first_name === "") {
            valid[i].first_name = false;
            message[i].first_name = "First name is required.";
            isValid = false;
          } else {
            valid[i].first_name = true;
          }

          if (invitationItems[i].last_name === "") {
            valid[i].last_name = false;
            message[i].last_name = "Last name is required.";
            isValid = false;
          } else {
            valid[i].last_name = true;
          }

          if (invitationItems[i].email === "" && invitationItems[i].phone_number === undefined) {
            valid[i].email = false;
            message[i].email = "Please put email or phone number";
            isValid = false;
          } else if (invitationItems[i].email !== "" && !EmailRegex.test(invitationItems[i].email)) {
            valid[i].email = false;
            message[i].email = "Email is invalid format.";
            isValid = false;
          } else if (invitationItems[i].phone_number !== undefined && !isValidPhoneNumber(invitationItems[i].phone_number)) {
            valid[i].phone_number = false;
            message[i].phone_number = "Invalid phone number";
            isValid = false;
          } else if (invitationItems[i].phone_number !== undefined && isValidPhoneNumber(invitationItems[i].phone_number)) {
            valid[i].phone_number = true;
          } else {
            valid[i].email = true;
          }
        }
      } else {
        if (invitationItems[i].name !== "" || invitationItems[i].email !== "") {
          if (typeof valid[i] === "undefined") {
            valid[i] = {};
            message[i] = {};
          }

          if (invitationItems[i].name === "") {
            valid[i].name = false;
            message[i].name = "Name is required.";
            isValid = false;
          } else {
            valid[i].name = true;
          }

          if (invitationItems[i].email === "") {
            valid[i].email = false;
            message[i].email = "Email is required.";
            isValid = false;
          } else if (!EmailRegex.test(invitationItems[i].email)) {
            valid[i].email = false;
            message[i].email = "Email is invalid format.";
            isValid = false;
          } else {
            valid[i].email = true;
          }
        }
      }
    }
    setFormResponse({
      valid: valid,
      message: message,
    });

    return isValid;
  };

  const handleConfirm = () => {
    if (!_validateForm() || loading) return;

    setLoading(true);

    if (hasLastName) {
      // console.log(
      //   "submit",
      //   invitationItems.filter((v) => v.first_name !== "" && v.last_name !== "" && (v.email !== "" || v.phone_number !== undefined))
      // );
      onPrimaryAction(
        invitationItems.filter((v) => v.first_name !== "" && v.last_name !== "" && (v.email !== "" || v.phone_number !== undefined)),
        () => {
          setLoading(false);
        },
        {
          closeModal: toggle,
          deleteItemByIndex: deleteItemByIndex,
          invitationItems: invitationItems,
        }
      );
    } else {
      onPrimaryAction(
        invitationItems.filter((v, i) => v.name !== "" && v.email !== ""),
        () => {
          setLoading(false);
        },
        {
          closeModal: toggle,
          deleteItemByIndex: deleteItemByIndex,
          invitationItems: invitationItems,
        }
      );
    }
  };

  useEffect(() => {
    for (let i = invitationItems.length; i < 3; i++) {
      let input = {};
      if (hasLastName) {
        input = {
          first_name: "",
          last_name: "",
          email: "",
          phone_number: undefined,
        };
      } else {
        input = {
          name: "",
          email: "",
        };
      }
      setInvitationItems((prevState) => [...prevState, input]);
    }
  }, []);

  const handleSelectTeam = (e, key) => {
    setInvitationItems((prevState) => {
      prevState[key]["teams"] = e === null ? [] : e;
      return prevState;
    });
  };

  const handleChangePhoneNumber = (e, k) => {
    setInvitationItems((prevState) => {
      prevState[k]["phone_number"] = e;
      return prevState;
    });
  };

  return (
    <ModalWrapper isOpen={modal} toggle={toggle} size={"xl"} centered>
      <ModalHeaderSection toggle={toggle} className={"invited-users-modal"}>
        {dictionary.userInvitations}
      </ModalHeaderSection>
      {(fromRegister || (!fromRegister && (user.role.name === "owner" || user.role.name === "admin"))) && (
        <ModalBody>
          <StyledTable className="table table-responsive">
            <tr>
              {hasLastName ? (
                <>
                  <th>{dictionary.firstName}</th>
                  <th>{dictionary.lastName}</th>
                </>
              ) : (
                <th>{dictionary.name}</th>
              )}
              <th>{dictionary.email}</th>
              {!fromRegister && <th className="team-th">Phone number</th>}
              {!fromRegister && <th className="team-th">{dictionary.addUserToteams}</th>}
              <th>
                <SvgIconFeather className="cursor-pointer" icon="circle-plus" onClick={handleAddItem} />
              </th>
            </tr>
            {invitationItems.map((item, key) => {
              return (
                <tr key={key}>
                  {hasLastName ? (
                    <>
                      <td>
                        <FormInput
                          data-id={key}
                          placeholder={dictionary.firstName}
                          name="first_name"
                          value={item.first_name}
                          isValid={formResponse.valid[key] ? formResponse.valid[key].first_name : null}
                          feedback={formResponse.message[key] ? formResponse.message[key].first_name : null}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <FormInput
                          data-id={key}
                          placeholder={dictionary.lastName}
                          name="last_name"
                          value={item.last_name}
                          isValid={formResponse.valid[key] ? formResponse.valid[key].last_name : null}
                          feedback={formResponse.message[key] ? formResponse.message[key].last_name : null}
                          onChange={handleInputChange}
                        />
                      </td>
                    </>
                  ) : (
                    <td>
                      <FormInput
                        data-id={key}
                        placeholder={dictionary.name}
                        name="name"
                        value={item.name}
                        isValid={formResponse.valid[key] ? formResponse.valid[key].name : null}
                        feedback={formResponse.message[key] ? formResponse.message[key].name : null}
                        onChange={handleInputChange}
                      />
                    </td>
                  )}
                  <td>
                    <FormInput
                      data-id={key}
                      placeholder={dictionary.email}
                      name="email"
                      value={item.email}
                      type="email"
                      isValid={formResponse.valid[key] ? formResponse.valid[key].email : null}
                      feedback={formResponse.message[key] ? formResponse.message[key].email : null}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <PhoneInput placeholder="Enter phone number" value={item.phoneNumber} onChange={(e) => handleChangePhoneNumber(e, key)} />
                    {formResponse.valid[key] && formResponse.valid[key].phone_number === false && <InvalidPhoneLabel>{formResponse.message[key].phone_number}</InvalidPhoneLabel>}
                  </td>
                  {!fromRegister && (user.role.name === "owner" || user.role.name === "admin") && (
                    <td>
                      <SelectPeople options={teamOptions} value={item.teams} onChange={(e) => handleSelectTeam(e, key)} isSearchable isMulti={true} isClearable={true} />
                    </td>
                  )}
                  <td>
                    <SvgIconFeather data-id={key} className="cursor-pointer" icon="x" onClick={handleDeleteItem} />
                  </td>
                </tr>
              );
            })}
            <tr>
              <td>
                <MoreMemberButton onClick={handleAddItem}>
                  <SvgIconFeather icon="plus" /> <span>Add another</span>
                </MoreMemberButton>
              </td>
            </tr>
          </StyledTable>
        </ModalBody>
      )}
      {(fromRegister || (!fromRegister && (user.role.name === "owner" || user.role.name === "admin"))) && (
        <ModalFooter>
          <Button className="btn btn-outline-secondary" outline color="secondary" onClick={toggle}>
            {cancelText}
          </Button>
          <Button className="btn btn-primary" color="primary" onClick={handleConfirm}>
            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
            {submitText}
          </Button>{" "}
        </ModalFooter>
      )}
      {!fromRegister && !(user.role.name === "owner" || user.role.name === "admin") && (
        <>
          <ModalBody>
            <div>{dictionary.availableToAdmin}</div>
          </ModalBody>
          <ModalFooter>
            <Button className="btn btn-outline-secondary" outline color="secondary" onClick={toggle}>
              {dictionary.closeButton}
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalWrapper>
  );
};

export default React.memo(InvitedUsersModal);
