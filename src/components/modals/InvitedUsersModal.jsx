import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import { clearModal } from "../../redux/actions/globalActions";
import { FormInput, PeopleSelect, EmailPhoneInput } from "../forms";
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
  .btn.btn-secondary:not(:disabled):not(.disabled):focus,
  .btn.btn-secondary:not(:disabled):not(.disabled):hover,
  .btn.btn-outline-secondary:not(:disabled):not(.disabled):hover,
  .btn.btn-outline-secondary:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  .btn.btn-secondary:not(:disabled):not(.disabled):focus,
  .btn.btn-secondary:not(:disabled):not(.disabled):hover,
  .btn.btn-outline-secondary:not(:disabled):not(.disabled):hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
  .dropdown-toggle,
  .dropdown-toggle:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  .email-phone-input.phone-input .input-group {
    flex-wrap: unset;
  }
  .PhoneInput input {
    padding: 0.375rem 0.75rem;
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

const SelectUserBody = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  .col-md-6 {
    flex-flow: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
`;

// const InvalidPhoneLabel = styled.label`
//   width: 100%;
//   margin-top: 0.25rem;
//   font-size: 80%;
//   color: #dc3545;
// `;

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
  const securitySettings = useSelector((state) => state.admin.security);
  const [registerMode, setRegisterMode] = useState({});
  const [countryCode, setCountryCode] = useState(null);
  const [selectType, setSelectType] = useState(null);

  const dictionary = {
    closeButton: _t("BUTTON.CLOSE", "Close"),
    availableToAdmin: _t("TOOLTIP.AVAILABLE_TO_ADMIN", "This option is only available for administrators"),
    availableToManager: _t("TOOLTIP.AVAILABLE_TO_MANAGER", "This option is only available for managers"),
    userInvitations: _t("LABEL.USER_INVITATIONS", "User invitations"),
    firstName: _t("INVITE.FIRST_NAME", "First name"),
    lastName: _t("INVITE.LAST_NAME", "Last name"),
    emailOnly: _t("INVITE.EMAIL", "Email"),
    name: _t("INVITE.NAME", "Name"),
    addUserToteams: _t("INVITE_USERS.ADD_USER_TO_TEAMS", "Add user to teams"),
    teamLabel: _t("TEAM", "Team"),
    email: _t("LOGIN.EMAIL_PHONE", "Email / Phone number"),
    guestInvitations: _t("LABEL.GUEST_INVITATIONS", "Guest invitations"),
    guestExplainerBody: _t("LABEL.GUEST_EXPLAINER_BODY", "Guests are invited via a workspace. Add a workspace and click “add guests”"),
    employee: _t("EMPLOYEE", "Employee"),
    guestAccount: _t("GUEST_ACCOUNT", "Guest account"),
    employeeExplainer: _t("INVITE.EMPLOYEE_DESCRIPTION", "Explainer text what employee account can do"),
    guestExplainer: _t("INVITE.GUEST_DESCRIPTION", "Explainer text what guest account can do"),
    selectUserType: _t("INVITE.SELECT_USER_TYPE", "Select user type"),
  };

  const teamOptions = !fromRegister
    ? Object.values(teams).map((u) => {
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

  const handleEmailNumberChange = (value, key) => {
    setInvitationItems((prevState) => {
      prevState[key].email = value;
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
        if (invitationItems[i].first_name.trim() === "" || invitationItems[i].last_name.trim() === "" || invitationItems[i].email.trim() === "" || invitationItems[i].phone_number === undefined) {
          if (typeof valid[i] === "undefined") {
            valid[i] = {};
            message[i] = {};
          }

          if (invitationItems[i].first_name.trim() === "") {
            valid[i].first_name = false;
            message[i].first_name = "First name is required.";
            isValid = false;
          } else {
            valid[i].first_name = true;
          }

          if (invitationItems[i].last_name.trim() === "") {
            valid[i].last_name = false;
            message[i].last_name = "Last name is required.";
            isValid = false;
          } else {
            valid[i].last_name = true;
          }

          if (invitationItems[i].email.trim() === "" && invitationItems[i].phone_number === undefined) {
            valid[i].email = false;
            message[i].email = "Please put email or phone number";
            isValid = false;
          } else if (invitationItems[i].email !== "" && !EmailRegex.test(invitationItems[i].email) && registerMode[i] === "email") {
            valid[i].email = false;
            message[i].email = "Email is invalid format.";
            isValid = false;
          } else if (registerMode[i] === "number" && invitationItems[i].phone_number !== undefined && !isValidPhoneNumber(invitationItems[i].phone_number)) {
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
        if (invitationItems[i].name.trim() === "" || invitationItems[i].email.trim() === "") {
          if (typeof valid[i] === "undefined") {
            valid[i] = {};
            message[i] = {};
          }

          if (invitationItems[i].name.trim() === "") {
            valid[i].name = false;
            message[i].name = "Name is required.";
            isValid = false;
          } else {
            valid[i].name = true;
          }

          if (invitationItems[i].email.trim() === "") {
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
        invitationItems.filter((v, i) => v.name !== "" && (v.email !== "" || v.phone_number !== undefined)),
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

    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((response) => {
        setCountryCode(response.country);
      })
      .catch((data, status) => {
        //console.log("Request failed");
      });
  }, []);

  const handleSelectTeam = (e, key) => {
    setInvitationItems((prevState) => {
      prevState[key]["teams"] = e === null ? [] : e;
      return prevState;
    });
  };

  // const handleChangePhoneNumber = (e, k) => {
  //   setInvitationItems((prevState) => {
  //     prevState[k]["phone_number"] = e;
  //     return prevState;
  //   });
  // };

  const handleSetRegisterMode = (mode, key) => {
    setRegisterMode((prevState) => {
      return {
        ...prevState,
        [key]: mode,
      };
    });
  };

  const handleSelectEmployee = () => setSelectType("employee");
  const handleSelectGuest = () => setSelectType("guest");

  return (
    <ModalWrapper
      isOpen={modal}
      toggle={toggle}
      size={(!fromRegister && !selectType && user.role.id <= securitySettings.invite_internal) || (!fromRegister && user.role.id > securitySettings.invite_internal) || (!fromRegister && selectType === "guest") ? "md" : "xl"}
      centered
    >
      <ModalHeaderSection toggle={toggle} className={"invited-users-modal"}>
        {!fromRegister && selectType === "guest" ? dictionary.guestInvitations : !fromRegister && !selectType && user.role.id <= securitySettings.invite_internal ? dictionary.selectUserType : dictionary.userInvitations}
      </ModalHeaderSection>
      {!fromRegister && !selectType && user.role.id <= securitySettings.invite_internal && (
        <ModalBody>
          <SelectUserBody className="row">
            <div className="col-md-6 d-flex justify-content-center">
              <button className="btn btn-primary" onClick={handleSelectEmployee}>
                {dictionary.employee}
              </button>
              <span className="mt-3">{dictionary.employeeExplainer}</span>
            </div>
            <div className="col-md-6 d-flex justify-content-center" onClick={handleSelectGuest}>
              <button className="btn btn-primary">{dictionary.guestAccount}</button>
              <span className="mt-3">{dictionary.guestExplainer}</span>
            </div>
          </SelectUserBody>
        </ModalBody>
      )}
      {!fromRegister && selectType === "guest" && (
        <>
          <ModalBody>
            <div>{dictionary.guestExplainerBody}</div>
          </ModalBody>
          <ModalFooter>
            <Button className="btn btn-outline-secondary" outline color="secondary" onClick={toggle}>
              {dictionary.closeButton}
            </Button>
          </ModalFooter>
        </>
      )}
      {(fromRegister || (!fromRegister && selectType === "employee" && user.role.id <= securitySettings.invite_internal)) && (
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
              {/* {!fromRegister && <th className="team-th">Phone number</th>} */}
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
                    <EmailPhoneInput
                      onChange={(value) => handleEmailNumberChange(value, key)}
                      name="email_phone"
                      isValid={formResponse.valid.email}
                      feedback={formResponse.message.email}
                      placeholder={dictionary.emailOnly}
                      registerMode={registerMode[key] ? registerMode[key] : "email"}
                      setRegisterMode={(mode) => handleSetRegisterMode(mode, key)}
                      value={item.email}
                      defaultCountry={countryCode}
                      autoFocus={true}
                      className={`email-phone-input ${registerMode[key] && registerMode[key] === "number" ? "phone-input" : "email-input"}`}
                    />
                    {/* <FormInput
                      data-id={key}
                      placeholder={dictionary.email}
                      name="email"
                      value={item.email}
                      type="email"
                      isValid={formResponse.valid[key] ? formResponse.valid[key].email : null}
                      feedback={formResponse.message[key] ? formResponse.message[key].email : null}
                      onChange={handleInputChange}
                    /> */}
                  </td>
                  {/* <td>
                    <PhoneInput placeholder="Enter phone number" value={item.phoneNumber} onChange={(e) => handleChangePhoneNumber(e, key)} />
                    {formResponse.valid[key] && formResponse.valid[key].phone_number === false && <InvalidPhoneLabel>{formResponse.message[key].phone_number}</InvalidPhoneLabel>}
                  </td> */}
                  {!fromRegister && user.role.id <= securitySettings.invite_internal && (
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
      {(fromRegister || (!fromRegister && selectType === "employee" && user.role.id <= securitySettings.invite_internal)) && (
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
      {!fromRegister && user.role.id > securitySettings.invite_internal && (
        <>
          <ModalBody>
            <div>{securitySettings.invite_internal === 1 ? dictionary.availableToAdmin : dictionary.availableToManager}</div>
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
