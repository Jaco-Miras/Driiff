import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { clearModal } from "../../redux/actions/globalActions";
import { ModalHeaderSection } from "./index";
import { SvgIconFeather } from "../common";

const ModalWrapper = styled(Modal)`
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
const ImpersonationLoginModal = (props) => {
  const { submitText, cancelText, headerText, bodyText, type, size = "m" } = props.data;
  const { onSubmit } = props.data.actions;
  const { loading } = useSelector((state) => state.users.impersonation);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const [modal, setModal] = useState(true);

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
    // onCancel();
  };

  const handleConfirm = () => {
    onSubmit(loginForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ModalWrapper isOpen={modal} toggle={toggle} size={size} centered>
      <form>
        <ModalHeaderSection toggle={toggle}>{headerText}</ModalHeaderSection>
        <ModalBody>
          <div className="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" name="email" value={loginForm.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" name="password" value={loginForm.password} onChange={handleChange} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="btn btn-outline-secondary" outline color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button disabled={loading} className="btn btn-primary" color="primary" onClick={handleConfirm}>
            Login
          </Button>
        </ModalFooter>
      </form>
    </ModalWrapper>
  );
};

export default React.memo(ImpersonationLoginModal);
