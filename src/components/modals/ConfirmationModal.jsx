
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import {clearModal} from "../../redux/actions/globalActions";

const ConfirmationModal = props => {
    
    const { submitText, cancelText, headerText, bodyText, type } = props.data;
    const { onSubmit } = props.data.actions;

    const dispatch = useDispatch();
    const [modal, setModal] = useState(true);
    const toggle = () => {
        setModal(!modal)
        dispatch(
            clearModal({type: type})
        );
    }
    const handleConfirm = () => {
        toggle()
        onSubmit()
    }

    return (
        <Modal isOpen={modal} toggle={toggle} centered>
            <ModalHeader toggle={toggle}>{headerText}</ModalHeader>
            <ModalBody>
                {bodyText}
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleConfirm}>{submitText}</Button>{' '}
                <Button color="secondary" onClick={toggle}>{cancelText}</Button>
            </ModalFooter>
        </Modal>
    )
}

export default React.memo(ConfirmationModal)