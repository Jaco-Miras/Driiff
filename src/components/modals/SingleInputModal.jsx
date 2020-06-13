import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {FormGroup, Input, Modal, ModalBody, ModalFooter} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import {useFocusInput} from "../hooks";
import {ModalHeaderSection} from "./index";


const Wrapper = styled(Modal)`
`;

const WrapperDiv = styled(FormGroup)`
`;

const SingleInputModal = (props) => {

    const {
        className = "",
        title,
        type,
        defaultValue,
        onPrimaryAction,
        onChange,
        onClose = () => {},
        labelClose = "Close",
        labelPrimaryAction = "Save",
        ...otherProps
    } = props;

    const [focus, setFocus] = useState(null);
    const dispatch = useDispatch();
    const refs = {
        main: useRef(null),
        name: useRef(null),
    };

    const toggle = () => {
        dispatch(
            clearModal({type: type}),
        );
    };

    const handleClose = () => {
        onClose();
        toggle();
    };

    const handleInputRef = useCallback((e) => {
        setFocus(e);
    }, []);

    useEffect(() => {
        if (focus) {
            focus.focus();
        }
    }, [focus]);

    useFocusInput(focus);

    return (
        <Wrapper ref={refs.main} isOpen={true} toggle={toggle} centered
                 className={`single-input-modal ${className}`} {...otherProps}>
            <ModalHeaderSection toggle={toggle}>{title}</ModalHeaderSection>
            <ModalBody>
                <WrapperDiv>
                    <Input
                        innerRef={handleInputRef}
                        autoFocus
                        defaultValue={defaultValue}
                        onChange={onChange}
                    />
                </WrapperDiv>
            </ModalBody>
            <ModalFooter>
                <button
                    type="button" className="btn btn-secondary" data-dismiss="modal"
                    onClick={handleClose}>{labelClose}</button>
                <button
                    type="button" className="btn btn-primary"
                    onClick={onPrimaryAction}>{labelPrimaryAction}</button>
            </ModalFooter>
        </Wrapper>
    );
};

export default React.memo(SingleInputModal);