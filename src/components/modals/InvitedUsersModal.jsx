import React, {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {Button, InputGroup, Modal, ModalBody, ModalFooter} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import {FormInput} from "../forms";
import {useTranslation} from "../hooks";
import {ModalHeaderSection} from "./index";
import {SvgIconFeather} from "../common";

const WrapperDiv = styled(InputGroup)`
  display: flex;
  align-items: center;
  margin: 20px 0;

  > .form-control:not(:first-child) {
    border-radius: 5px;
  }

  label {
    white-space: nowrap;
    margin: 0 20px 0 0;
    min-width: 109px;
  }

  .input-feedback {
    margin-left: 130px;
    @media all and (max-width: 480px) {
      margin-left: 0;
    }
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
`;

const InvitedUsersModal = (props) => {

  const {submitText = "Submit", cancelText = "Cancel", onPrimaryAction, mode, invitations = [], type} = props.data;

  const [invitationItems, setInvitationItems] = useState(invitations);

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

  const handleConfirm = () => {
    onPrimaryAction();
    toggle();
  };

  useEffect(() => {
    for (let i = invitationItems.length; i < 6; i++) {
      setInvitationItems(prevState => ([
        ...prevState,
        {
          name: "",
          email: "",
        }
      ]))
    }
  }, []);

  useEffect(() => {
    console.log(invitationItems);
  }, [invitationItems])

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
            <th>+</th>
          </tr>
          {
            invitationItems.map((item, key) => {
              return (
                <tr key={key}>
                  <td>
                    <FormInput
                      data-id={key} placeholder="Name" name="name" value={item.name}
                      onChange={handleInputChange}/>
                  </td>
                  <td>
                    <FormInput
                      data-id={key} placeholder="Email" name="email" value={item.email} type="email"
                      onChange={handleInputChange}/>
                  </td>
                  <td>
                    <SvgIconFeather data-id={key} className="cursor-pointer" icon="x" onClick={handleDeleteItem}/>
                  </td>
                </tr>
              )
            })
          }
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
