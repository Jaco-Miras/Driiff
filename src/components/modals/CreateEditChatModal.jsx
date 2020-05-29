import lodash from "lodash";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Input, InputGroup, Label, Modal, ModalBody} from "reactstrap";
import styled from "styled-components";
import {localizeDate} from "../../helpers/momentFormatJS";
import {createNewChat, editChannelDetail, renameChannelKey, searchExistingChat} from "../../redux/actions/chatActions";
import {clearModal} from "../../redux/actions/globalActions";
import {PeopleSelect} from "../forms";
import QuillEditor from "../forms/QuillEditor";
import {useQuillModules} from "../hooks";
import {ModalHeaderSection} from "./index";

const WrapperDiv = styled(InputGroup)`
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
    .react-select__multi-value__label {
        align-self: center;
    }
`;

const SelectPeople = styled(PeopleSelect)`
    flex: 1 0 0;
    width: 1%;
`;

const StyledQuillEditor = styled(QuillEditor)`
    flex: 1 0 0;
    width: 1%;
    
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
    const [chatExists, setChatExists] = useState(false);
    const [searching, setSearching] = useState(false);

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
        } else {
            setSelectedUsers(e);
            //handleSearchExistingChat();
        }
    };

    const handleInputChange = e => {
        setInputValue(e.target.value.trim());
        //handleSearchExistingChat();
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
                channel_name: inputValue,
                channel_id: channel.id,
                remove_member_ids: removed_members,
                add_member_ids: added_members,
            };

            dispatch(editChannelDetail(payload));
        } else {

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
            if (textOnly.trim().length !== 0) {
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
        let recipient_ids = recipients
            .filter(r => r.type === "USER")
            .filter(r => {
                let userFound = false;
                selectedUsers.forEach(u => {
                    if (u.id === r.type_id) {
                        userFound = true;
                    }
                });
                return userFound;
            }).map(r => r.id);

        let payload = {
            title: inputValue,
            search_recipient_ids: recipient_ids,
        };
        if (recipient_ids.length) {
            setSearching(true);
            dispatch(
                searchExistingChat(payload, (err, res) => {
                    setSearching(false);
                    if (err) {
                        return;
                    }
                    if (res.data.channel_id) {
                        setChatExists(true);
                    } else {
                        setChatExists(false);
                    }
                }),
            );
        }
    }, 500);

    const [modules] = useQuillModules("group_chat");

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

    useEffect(() => {
        if (selectedUsers.length) {
            handleSearchExistingChat();
        }
    }, [inputValue, selectedUsers.length]);

    useEffect(() => {
        if (!searching) {
            let valid = true;
            if (inputValue === "") {
                valid = false;
            }
            if (selectedUsers.length === 0) {
                valid = false;
            }
            if (chatExists === true) {
                valid = false;
            }
            setValid(valid);
        }
    }, [inputValue, selectedUsers, chatExists, searching]);

    return (

        <Modal isOpen={modal} toggle={toggle} centered size={"md"}>
            <ModalHeaderSection toggle={toggle}>{mode === "edit" ? "Edit chat" : "New group chat"}</ModalHeaderSection>
            <ModalBody>
                <WrapperDiv>
                    <Label for="chat">Chat title</Label>
                    <Input style={{borderRadius: "5px"}}
                           defaultValue={mode === "edit" ? channel.title : ""}
                           onChange={handleInputChange}
                           valid={valid}
                    />
                </WrapperDiv>
                <WrapperDiv>
                    <Label for="people">People</Label>
                    <SelectPeople
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