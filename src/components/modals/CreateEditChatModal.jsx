import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormFeedback, Label, Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import Select, {components} from "react-select";
import { clearModal } from "../../redux/actions/globalActions";
import Avatar from "../common/Avatar";

const CreateEditChatModal = props => {

    const type = "chat_create_edit"
    const mode = "edit"
    //const { type, mode } = props.data;

    const dispatch = useDispatch();
    const [modal, setModal] = useState(true);
    const users = useSelector(state => state.users.mentions);
    const [selectedUsers, setSelectedUsers] = useState([])

    const toggle = () => {
        setModal(!modal);
        dispatch(
            clearModal({type: type}),
        );
    };

    const handleConfirm = () => {
        toggle();
    };

    const WrapperDiv = styled.div`
        display: flex;
        align-items: center;
        margin: 10px 0;
        label {
            white-space: nowrap;
            margin: 0 20px 0 0;
            min-width: 90px;
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

    const SelectOption = styled.div`
        display: flex;
        flex-flow: row;
        align-items: center;
        padding-left: 5px;
        :hover{
            background: #DEEBFF;
        }
    `;

    const StyledAvatar = styled(Avatar)`
        height: 1.6rem!important;
        width: 1.6rem!important;
        min-width: 1.6rem;
        min-height: 1.6rem;
        margin: 5px;
    `;

    const Option = props => {
        return (
            <SelectOption>
                {
                    props.data &&
                    <StyledAvatar
                        className="react-select-avatar"
                        key={props.data.id}
                        profileImageLink={props.data.profile_image_link}
                        name={props.data.name}
                        partialName={props.data.partial_name}
                    />
                }
                <components.Option {...props}></components.Option>
            </SelectOption>
        );
    };
    const MultiValueContainer = ({children, selectProps, ...props}) => {
        let newChildren = children.map((c,i) => {
            if (i === 0) {
                return {
                    ...c,
                    props: {
                        ...c.props,
                        children: props.data.first_name
                    }
                }
            } else return c
        })
        return (
            <components.MultiValueContainer {...props}>
                {
                    props.data && selectProps.inputValue === "" &&
                    <StyledAvatar
                        className="react-select-avatar"
                        key={props.data.id}
                        profileImageLink={props.data.profile_image_link}
                        name={props.data.name}
                        partialName={props.data.partial_name}
                    />
                }
                {newChildren}
            </components.MultiValueContainer>
        );
    };

    const options = Object.values(users).map(u => {
        return {
            ...u,
            value: u.id,
            label: u.name
        }
    })

    const handleSelect = e => {
        console.log(e)
        setSelectedUsers(e)
    }

    return (
        <Modal isOpen={modal} toggle={toggle} centered size={"md"}>
            <ModalHeader toggle={toggle}>{mode === "edit" ? "Edit chat" : "New group chat"}</ModalHeader>
            <ModalBody>
                <WrapperDiv>
                    <Label for="chat">Chat title</Label>
                    <Input valid />
                    {/* <FormFeedback>Sweet! that name is available</FormFeedback> */}
                </WrapperDiv>
                <WrapperDiv>
                    <Label for="chat">People</Label>
                    <Select
                        className={"react-select-container"}
                        classNamePrefix={"react-select"}
                        isMulti={true}
                        isClearable={false}
                        components={{Option, MultiValueContainer}}
                        options={options}
                        value={selectedUsers}
                        onChange={handleSelect}
                    />
                </WrapperDiv>
                <WrapperDiv>
                    <Button color="primary" onClick={handleConfirm}>{mode === "edit" ? "Update chat" : "Create chat"}</Button>
                </WrapperDiv>
            </ModalBody>
        </Modal>
    );
};

export default React.memo(CreateEditChatModal);