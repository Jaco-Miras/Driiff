import React, {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {Button, Modal, ModalBody, ModalFooter} from "reactstrap";
import {clearModal} from "../../redux/actions/globalActions";
import {FormInput} from "../forms";
import {useTranslation} from "../hooks";
import {ModalHeaderSection} from "./index";
import {SvgIconFeather} from "../common";
import {EmailRegex} from "../../helpers/stringFormatter";
import styled from "styled-components";

const MoreMemberButton = styled.span`
  cursor: pointer;
  cursor: hand;
  display: flex;
  justify-content: flex-start;
  align-items: center; 
`;

const InvitedUsersModal = (props) => {

  const {submitText = "Submit", cancelText = "Cancel", onPrimaryAction, invitations = [], type} = props.data;

  const [invitationItems, setInvitationItems] = useState(invitations);

  const [formResponse, setFormResponse] = useState({
    valid: {},
    message: {},
  });

  const {_t} = useTranslation();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(true);
  const [binary, setBinary] = useState(false);

  const handleInputChange = useCallback((e) => {
    e.persist();
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.name;
    setInvitationItems(prevState => {
      prevState[id][name] = e.target.value.trim();
      return prevState;
    });
    setBinary(prevState => !prevState);
  }, [setInvitationItems, setBinary]);

  const handleAddItem = useCallback((e) => {
    setInvitationItems(prevState => {
      prevState.push({
        name: "",
        email: "",
      });
      return prevState;
    });
    setBinary(prevState => !prevState);
  }, []);

  const handleDeleteItem = useCallback((e) => {
    const id = e.currentTarget.dataset.id;
    setInvitationItems(prevState => {
      prevState.splice(id, 1);
      return prevState;
    });
    setBinary(prevState => !prevState);
  }, [setInvitationItems, setBinary]);

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({type: type}));
  };

  const _validateForm = () => {
    let isValid = true;
    let valid = {};
    let message = {};
    for (let i = 0; i < invitationItems.length; i++) {
      if (invitationItems[i].name !== "" || invitationItems[i].email !== "") {
        if (typeof valid[i] === "undefined") {
          valid[i] = {};
          message[i] = {};
        }

        if (invitationItems[i].name === "") {
          valid[i].name = false
          message[i].name = `Name is required.`
          isValid = false;
        } else {
          valid[i].name = true;
        }

        if (invitationItems[i].email === "") {
          valid[i].email = false
          message[i].email = `Email is required.`
          isValid = false;
        } else if (!EmailRegex.test(invitationItems[i].email)) {
          valid[i].email = false
          message[i].email = `Email is invalid format.`
          isValid = false;
        } else {
          valid[i].email = true;
        }
      }
    }
    setFormResponse({
      valid: valid,
      message: message
    })

    return isValid;
  }

  const handleConfirm = () => {
    if (_validateForm()) {
      onPrimaryAction(invitationItems.filter((v, i) => v.name !== "" && v.email !== ""));
      toggle();
    }
  };

  useEffect(() => {
    for (let i = invitationItems.length; i < 3; i++) {
      setInvitationItems(prevState => ([
        ...prevState,
        {
          name: "",
          email: "",
        }
      ]))
    }
  }, []);

  return (
    <Modal isOpen={modal} toggle={toggle} size={"lg"} centered>
      <ModalHeaderSection toggle={toggle} className={"invited-users-modal"}>
        User invitations
      </ModalHeaderSection>
      <ModalBody>
        <table className="table table-responsive">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>
              <SvgIconFeather className="cursor-pointer" icon="circle-plus" onClick={handleAddItem}/>
            </th>
          </tr>
          {
            invitationItems.map((item, key) => {
              return (
                <tr key={key}>
                  <td>
                    <FormInput
                      data-id={key} placeholder="Name" name="name" value={item.name}
                      isValid={formResponse.valid[key] ? formResponse.valid[key].name : null}
                      feedback={formResponse.message[key] ? formResponse.message[key].name : null}
                      onChange={handleInputChange}/>
                  </td>
                  <td>
                    <FormInput
                      data-id={key} placeholder="Email" name="email" value={item.email} type="email"
                      isValid={formResponse.valid[key] ? formResponse.valid[key].email : null}
                      feedback={formResponse.message[key] ? formResponse.message[key].email : null}
                      onChange={handleInputChange}/>
                  </td>
                  <td>
                    <SvgIconFeather data-id={key} className="cursor-pointer" icon="x" onClick={handleDeleteItem}/>
                  </td>
                </tr>
              )
            })
          }
          <tr>
            <td>
              <MoreMemberButton onClick={handleAddItem}>
                <SvgIconFeather icon="plus"/> <span>Add another</span>
              </MoreMemberButton>
            </td>
          </tr>
        </table>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleConfirm}>
          {submitText}
        </Button>{" "}
        <Button outline color="secondary" onClick={toggle}>
          {cancelText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default React.memo(InvitedUsersModal);
