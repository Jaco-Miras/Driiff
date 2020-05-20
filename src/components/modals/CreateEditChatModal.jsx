import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Select, {components} from "react-select";
import {Button, Input, InputGroup, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import styled from "styled-components";
import {editChannelDetail} from "../../redux/actions/chatActions";
import {clearModal} from "../../redux/actions/globalActions";
import {Avatar} from "../common";

const CreateEditChatModal = props => {

    const {type, mode} = props.data;

    const dispatch = useDispatch();
    const [modal, setModal] = useState(true);
    const users = useSelector(state => state.users.mentions);
    const channel = useSelector(state => state.chat.selectedChannel);
    const [selectedUsers, setSelectedUsers] = useState(channel.members.map(m => {
        return {
            ...m,
            value: m.id,
            label: m.first_name,
        };
    }));
    const [inputValue, setInputValue] = useState(channel.title);

    const toggle = () => {
        setModal(!modal);
        dispatch(
            clearModal({type: type}),
        );
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
        height: 1.6rem;
        width: 1.6rem;
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
                        imageLink={props.data.profile_image_link}
                        name={props.data.name}
                        partialName={props.data.partial_name}
                    />
                }
                <components.Option {...props}></components.Option>
            </SelectOption>
        );
    };

    const MultiValueContainer = ({children, selectProps, ...props}) => {
        let newChildren = children.map((c, i) => {
            if (i === 0) {
                return {
                    ...c,
                    props: {
                        ...c.props,
                        children: props.data.first_name,
                    },
                };
            } else return c;
        });
        return (
            <components.MultiValueContainer {...props}>
                {
                    props.data && selectProps.inputValue === "" &&
                    <StyledAvatar
                        className="react-select-avatar"
                        key={props.data.id}
                        imageLink={props.data.profile_image_link}
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
            label: u.name,
        };
    });

    const handleSelect = e => {
        setSelectedUsers(e);
    };

    const handleInputChange = e => {
        setInputValue(e.target.value);
    };

    const handleConfirm = () => {
        const removed_members = channel.members.filter(m => {
            let userFound = false;
            selectedUsers.forEach(u => {
                if (u.id === m.id) {
                    userFound = true;

                }
            });
            return !userFound;
        }).map(m => m.id);

        const added_members = selectedUsers.filter(u => {
            let userFound = false;
            channel.members.forEach(m => {
                if (m.id === u.id) {
                    userFound = true;

                }
            });
            return !userFound;
        }).map(m => m.id);

        let payload = {
            channel_name: inputValue.trim(),
            channel_id: channel.id,
            remove_member_ids: removed_members,
            add_member_ids: added_members,
        };

        dispatch(editChannelDetail(payload));
        toggle();
    };

    return (

        <Modal isOpen={modal} toggle={toggle} centered size={"md"}>
            <ModalHeader toggle={toggle}>{mode === "edit" ? "Edit chat" : "New group chat"}</ModalHeader>
            <ModalBody>
                <InputGroup>
                    <Label for="chat" style={{minWidth: "90px", margin: "0 20px 0 0", alignSelf: "center"}}>Chat
                        title</Label>
                    <Input style={{borderRadius: "5px"}} defaultValue={mode === "edit" ? channel.title : ""}
                           onChange={handleInputChange}/>
                </InputGroup>

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
                    <Button color="primary"
                            onClick={handleConfirm}>{mode === "edit" ? "Update chat" : "Create chat"}</Button>
                </WrapperDiv>
            </ModalBody>
        </Modal>
    );
};

export default CreateEditChatModal;