import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { clearModal } from "../../redux/actions/globalActions";
import { FormInput } from "../forms";
import { useTranslationActions } from "../hooks";
import { ModalHeaderSection } from "./index";
import { SvgIconFeather } from "../common";
import { EmailRegex } from "../../helpers/stringFormatter";
import styled from "styled-components";

const MoreMemberButton = styled.span`
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const InvitedUsersModal = (props) => {
  const { submitText = "Submit", cancelText = "Cancel", onPrimaryAction, hasLastName = false, invitations = [], type } = props.data;

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
  const user = useSelector((state) => state.session.user);

  const dictionary = {
    closeButton: _t("BUTTON.CLOSE", "Close"),
    availableToAdmin: _t("TOOLTIP.AVAILABLE_TO_ADMIN", "This option is only available for administrators"),
    userInvitations: _t("LABEL.USER_INVITATIONS", "User invitations"),
    firstName: _t("INVITE.FIRST_NAME", "First name"),
    lastName: _t("INVITE.LAST_NAME", "Last name"),
    email: _t("INVITE.EMAIL", "Email"),
    name: _t("INVITE.NAME", "Name"),
  };

  const handleInputChange = useCallback(
    (e) => {
      e.persist();
      const id = e.currentTarget.dataset.id;
      const name = e.currentTarget.name;
      setInvitationItems((prevState) => {
        prevState[id][name] = e.target.value;
        return prevState;
      });
      setBinary((prevState) => !prevState);
    },
    [setInvitationItems, setBinary]
  );

  const handleAddItem = useCallback((e) => {
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
  }, []);

  const handleDeleteItem = useCallback(
    (e) => {
      const id = e.currentTarget.dataset.id;
      setInvitationItems((prevState) => {
        prevState.splice(id, 1);
        return prevState;
      });
      setBinary((prevState) => !prevState);
    },
    [setInvitationItems, setBinary]
  );

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
        if (invitationItems[i].first_name !== "" || invitationItems[i].last_name !== "" || invitationItems[i].email !== "") {
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
      onPrimaryAction(
        invitationItems.filter((v, i) => v.first_name !== "" && v.last_name !== "" && v.email !== ""),
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

  return (
    <Modal isOpen={modal} toggle={toggle} size={"lg"} centered>
      <ModalHeaderSection toggle={toggle} className={"invited-users-modal"}>
        {dictionary.userInvitations}
      </ModalHeaderSection>
      {(user.role.name === "owner" || user.role.name === "admin") && (
        <ModalBody>
          <table className="table table-responsive">
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
          </table>
        </ModalBody>
      )}
      {!(user.role.name === "owner" || user.role.name === "admin") && (
        <ModalBody>
          <div>{dictionary.availableToAdmin}</div>
        </ModalBody>
      )}
      {(user.role.name === "owner" || user.role.name === "admin") && (
        <ModalFooter>
          <Button color="primary" onClick={handleConfirm}>
            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
            {submitText}
          </Button>{" "}
          <Button outline color="secondary" onClick={toggle}>
            {cancelText}
          </Button>
        </ModalFooter>
      )}
      {!(user.role.name === "owner" || user.role.name === "admin") && (
        <ModalFooter>
          <Button outline color="secondary" onClick={toggle}>
            {dictionary.closeButton}
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
};

export default React.memo(InvitedUsersModal);
