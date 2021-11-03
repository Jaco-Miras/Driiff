import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { FormGroup, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
//import {useFocusInput} from "../hooks";
import { ModalHeaderSection } from "./index";

const Wrapper = styled(Modal)``;

const WrapperDiv = styled(FormGroup)``;

const SingleInputModal = (props) => {
  const { className = "", title, type, defaultValue = "", preInputLabel = "", label = "", postInputLabel = "", onPrimaryAction, onChange, onClose = () => {}, labelClose = "Close", labelPrimaryAction = "Save", ...otherProps } = props;

  const dispatch = useDispatch();
  const refs = {
    main: useRef(null),
    name: useRef(null),
  };

  const [inputValue, setInputValue] = useState(defaultValue);

  const toggle = () => {
    dispatch(clearModal({ type: type }));
  };

  const handleClose = () => {
    onClose();
    toggle();
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onChange(e);
  };

  const handleConfirm = () => {
    onPrimaryAction();
    toggle();
  };

  const inputRef = useRef();

  const onOpened = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Wrapper ref={refs.main} isOpen={true} toggle={toggle} centered onOpened={onOpened} className={`single-input-modal ${className}`} {...otherProps}>
      <ModalHeaderSection toggle={toggle}>{title}</ModalHeaderSection>
      <ModalBody>
        {preInputLabel !== "" && <Label className={"modal-info mb-3"}>{preInputLabel}</Label>}
        <WrapperDiv>
          {label !== "" && <Label className={"modal-label"}>{label}</Label>}
          <Input innerRef={inputRef} autoFocus defaultValue={defaultValue} onChange={handleInputChange} />
          {postInputLabel}
        </WrapperDiv>
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={handleClose}>
          {labelClose}
        </button>
        <button disabled={inputValue.trim() === ""} type="button" className="btn btn-primary" onClick={handleConfirm}>
          {labelPrimaryAction}
        </button>
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(SingleInputModal);
