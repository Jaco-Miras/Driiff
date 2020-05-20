import lodash from "lodash";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Select, {components} from "react-select";
import {Input, InputGroup, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import styled from "styled-components";
import {localizeDate} from "../../helpers/momentFormatJS";
import {createNewChat, editChannelDetail, renameChannelKey, searchExistingChat} from "../../redux/actions/chatActions";
import {clearModal} from "../../redux/actions/globalActions";
import {Avatar} from "../common";
import QuillEditor from "../forms/QuillEditor";
import {useQuillModules} from "../hooks";

const WrapperDiv = styled.div`
    display: flex;
    align-items: center;
    margin: 20px 0;
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
    min-width: 2rem;
    min-height: 2rem;
    margin: 5px;
    border: none;
`;

const StyledQuillEditor = styled(QuillEditor)`
    &.group-chat-input {
        border: 1px solid #afb8bd;
        border-radius: 5px;
        max-height: 130px;
        overflow: auto;
        overflow-x: hidden;
        position: static;
        width: 100%;
    }
    .ql-toolbar {
        display: none;
    }
    .ql-container {
        border: none;
    }
    .ql-editor {
        padding: 5px;
    }
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

const CreateEditChatModal = props => {

    const {type, mode} = props.data;

    const reactQuillRef = useRef();
    const dispatch = useDispatch();
    const [modal, setModal] = useState(true);
    const users = useSelector(state => state.users.mentions);
    const channel = useSelector(state => state.chat.selectedChannel);
    const user = useSelector(state => state.session.user);
    const recipients = useSelector(state => state.global.recipients);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [text, setText] = useState("");
    const [textOnly, setTextOnly] = useState("");
    const [valid, setValid] = useState(false);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (mode === "edit") {
            let currentMembers = channel.members.map(m => {
                return {
                    ...m,
                    value: m.id,
                    label: m.first_name,
                };
            });
            setSelectedUsers(currentMembers);
            setInputValue(channel.title);
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggle = () => {
        setModal(!modal);
        dispatch(
            clearModal({type: type}),
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
        if (e === null) {
            setSelectedUsers([]);
            if (mode === "new") setValid(false);
        } else setSelectedUsers(e);
    };

    const handleInputChange = e => {
        setInputValue(e.target.value);
        if (mode === "new") {
            setValid(false);
        }
    };

    const handleConfirm = () => {
        if (mode === "edit") {
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
        } else {

            if (inputValue.trim() === "" && selectedUsers.length === 0) return;

            let placeholderId = require("shortid").generate();
            let timestamp = Math.round(+new Date() / 1000);

            let message = {
                id: placeholderId,
                body: text,
                code: placeholderId,
                editable: 0,
                unfurls: [],
                quote: null,
                files: [],
                mention_html: null,
                reactions: [],
                is_deleted: 0,
                is_completed: true,
                is_transferred: false,
                is_read: true,
                channel_id: placeholderId,
                g_date: localizeDate(timestamp, "YYYY-MM-DD"),
                created_at: {
                    timestamp: timestamp,
                },
                updated_at: {
                    timestamp: timestamp,
                },
                user: user,
            };

            let channel = {
                id: placeholderId,
                entity_id: 0,
                type: "GROUP",
                title: inputValue,
                code: placeholderId,
                is_archived: 0,
                is_pinned: 0,
                is_hidden: 0,
                is_muted: 0,
                total_unread: 0,
                profile: null,
                selected: true,
                inviter: null,
                hasMore: false,
                skip: 0,
                members: [...selectedUsers, user],
                replies: [message],
                created_at: {
                    timestamp: timestamp,
                },
                updated_at: {
                    timestamp: timestamp,
                },
                last_reply: {
                    id: null,
                    body: text,
                    user: user,
                    created_at: {
                        timestamp: timestamp,
                    },
                },
                reference_id: placeholderId,
            };

            let recipient_ids = recipients.filter(r => r.type === "USER").filter(r => {
                let userFound = false;
                selectedUsers.forEach(u => {
                    if (u.id === r.type_id) {
                        userFound = true;

                    }
                });
                return userFound;
            }).map(r => r.id);

            let payload = {
                recipient_ids: recipient_ids,
                title: inputValue,
            };
            if (textOnly.trim !== "") {
                payload = {
                    ...payload,
                    message_body: text,
                };
            }

            let old_channel = channel;
            dispatch(
                createNewChat(payload, (err, res) => {
                    if (err) return;

                    let payload = {
                        ...channel,
                        id: res.data.channel.id,
                        old_id: old_channel.id,
                        code: res.data.code,
                        members: res.data.channel.members ? res.data.channel.members : channel.members,
                        profile: res.data.channel.profile,
                        type: "GROUP",
                        last_reply: res.data.channel.last_reply,
                        replies: [{
                            ...message,
                            id: res.data.last_reply.id,
                            channel_id: res.data.channel.id,
                            created_at: {
                                timestamp: message.created_at.timestamp,
                            },
                            updated_at: {
                                timestamp: message.created_at.timestamp,
                            },
                        }],
                        selected: true,
                    };

                    dispatch(
                        renameChannelKey(payload),
                    );
                }),
            );
        }

        toggle();
    };

    const handleQuillChange = (content, delta, source, editor) => {
        const textOnly = editor.getText(content);

        setText(content);
        setTextOnly(textOnly);
    };

    const handleSearchExistingChat = lodash.debounce(() => {
        let recipient_ids = recipients.filter(r => r.type === "USER").filter(r => {
            let userFound = false;
            selectedUsers.forEach(u => {
                if (u.id === r.type_id) {
                    userFound = true;

                }
            });
            return userFound;
        }).map(r => r.id);

        let payload = {
            title: inputValue.trim(),
            search_recipient_ids: recipient_ids,
        };
        if (recipient_ids.length) {
            setSearching(true);
            dispatch(
                searchExistingChat(payload, (err, res) => {
                    setSearching(false);
                    if (err) {
                        setValid(false);
                        return;
                    }
                    if (res.data.channel_id) {
                        setValid(false);
                    } else {
                        setValid(true);
                    }
                }),
            );
        }
    }, 1000);

    useEffect(() => {
        if (mode === "new") {
            if (selectedUsers.length) {
                handleSearchExistingChat();
            }
        }
    }, [handleSearchExistingChat, mode, selectedUsers.length, inputValue]);

    const [modules] = useQuillModules("group_chat");

    return (

        <Modal isOpen={modal} toggle={toggle} centered size={"md"}>
            <ModalHeader toggle={toggle}>{mode === "edit" ? "Edit chat" : "New group chat"}</ModalHeader>
            <ModalBody>
                <InputGroup>
                    <Label for="chat" style={{minWidth: "90px", margin: "0 20px 0 0", alignSelf: "center"}}>Chat
                        title</Label>
                    <Input style={{borderRadius: "5px"}}
                           defaultValue={mode === "edit" ? channel.title : ""}
                           onChange={handleInputChange}
                           valid={valid}
                    />
                </InputGroup>

                <WrapperDiv>
                    <Label for="people">People</Label>
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
                {
                    mode === "new" &&
                    <WrapperDiv>
                        <Label for="firstMessage">First message</Label>
                        <StyledQuillEditor
                            className="group-chat-input"
                            modules={modules}
                            ref={reactQuillRef}
                            onChange={handleQuillChange}
                        />
                    </WrapperDiv>
                }
                <WrapperDiv>
                    <button
                        className="btn btn-primary"
                        disabled={searching || !valid}
                        onClick={handleConfirm}>
                        {mode === "edit" ? "Update chat" : "Create chat"}
                    </button>
                </WrapperDiv>
            </ModalBody>
        </Modal>
    );
};

export default CreateEditChatModal;