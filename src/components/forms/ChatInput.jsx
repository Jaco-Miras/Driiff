import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import QuillEditor from './QuillEditor';
import useQuillModules from '../hooks/useQuillModules';
import {toastr} from "react-redux-toastr";
import {localizeDate} from "../../helpers/momentFormatJS";
import {createChatMessage, updateChatMessage, addChatMessage } from '../../redux/actions/chatActions';

const StyledQuillEditor = styled(QuillEditor)`
    &.chat-input {
        border: 1px solid #afb8bd;
        border-radius: 5px;
        max-height: 130px;
        overflow: auto;
        overflow-x: hidden;
    }
    .ql-toolbar {
        display: none;
    }
    .ql-editor {
        padding: 5px;
    }
    .ql-container {
        border: none;
    }
`;
/***  Commented out code are to be visited/refactored ***/
const ChatInput = props => {

    const dispatch = useDispatch();
    const reactQuillRef = useRef();
    const selectedChannel = useSelector(state => state.chat.selectedChannel)
    const slugs = useSelector(state => state.global.slugs)
    const user = useSelector(state => state.session.user)

    const [text, setText] = useState('')
    const [textOnly, setTextOnly] = useState('')
    const [quillContents, setQuillContents] = useState([])
    const [mounted, setMounted] = useState(false)
    const [mentionedUserIds, setMentionedUserIds] = useState([])
    const [ignoredMentionedUserIds, setIgnoredMentionedUserIds] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [editMessage, setEditMessage] = useState(null)
    
    const handleSubmit = () => {
        
        //let specialCommands = ["/sound-on", "/sound-off"];
        // if (specialCommands.includes(textOnly.trim())) {
        //     setText("")
        //     setTextOnly("")
        //     reactQuillRef.getEditor().setContents([]);
        //     reactQuillRef.getEditor().setText("");

        //     switch (textOnly.trim()) {
        //         case "/sound-on":
        //         case "/sound-off": {
        //             let payload = {
        //                 disable_sound: textOnly.trim() === "/sound-on" ? "0" : "1",
        //             };
        //             this.props.updateSettingsAction(payload, (err, res) => {
        //                 this.props.updateUserSettingsAction(payload);
        //                 toastr.success("Chat Notification",
        //                     `Successfully turned ${textOnly.trim() === "/sound-on" ? "on" : "off"}`);
        //             });
        //             break;
        //         }
        //         default: {
        //         }
        //     }
        //     return;
        // }

        let timestamp = Math.floor(Date.now() / 1000);
        let mention_ids = [];
        let haveGif = false;
        let reference_id = require("shortid").generate();
        let allIds = selectedChannel.members.map(m => m.id)

        if (quillContents.ops && quillContents.ops.length > 0) {

            let mentionIds = quillContents.ops.filter(id => {
                return id.insert.mention ? id : null;
            }).map(mid => Number(mid.insert.mention.id));

            mention_ids = [...new Set(mentionIds)];

            if (mention_ids.includes(NaN)) {
                if (allIds.length) {
                    mention_ids = [...new Set([...mention_ids.filter(id => !isNaN(id)), ...allIds])];
                } else {
                    //remove the nan in mention ids
                    mention_ids = mention_ids.filter(id => !isNaN(id));
                }
            }
            quillContents.ops.forEach(op => {
                if (op.insert.image) {
                    haveGif = true;
                }
            });
        }

        if ( textOnly.trim() === "" && mention_ids.length === 0 && !haveGif ) return;
        
        let payload = {
            channel_id: selectedChannel.id,
            body: text,
            mention_ids: mention_ids,
            file_ids: [],
            reference_id: reference_id,
            reference_title: selectedChannel.type === "DIRECT" && selectedChannel.members.length === 2
                ? `${user.first_name} in a direct message` : selectedChannel.title,
            topic_id: selectedChannel.is_shared ? selectedChannel.entity_id : null,
            is_shared: selectedChannel.is_shared ? selectedChannel.entity_id : null,
            token: slugs.length && slugs.filter(s => s.slug_name === selectedChannel.slug_owner).length ?
                slugs.filter(s => s.slug_name === selectedChannel.slug_owner)[0].access_token : null,
            slug: slugs.length && slugs.filter(s => s.slug_name === selectedChannel.slug_owner).length ?
                slugs.filter(s => s.slug_name === selectedChannel.slug_owner)[0].slug_name : null,
        };

        //revisit store to redux
        // if (this.props.replyQuote) {
        //     payload.quote = {
        //         id: this.props.replyQuote.id,
        //         body: this.props.replyQuote.body,
        //         user_id: this.props.replyQuote.user.id,
        //         user: this.props.replyQuote.user,
        //         files: this.props.replyQuote.files,
        //     };
        // }

        let obj = {
            message: text,
            body: text,
            mention_ids: mention_ids,
            user: user,
            original_body: text,
            is_read: true,
            editable: 1,
            files: [],
            is_archive: 0,
            is_completed: true,
            is_transferred: false,
            is_deleted: 0,
            created_at: {
                timestamp: timestamp,
            },
            updated_at: {
                timestamp: timestamp,
            },
            channel_id: selectedChannel.id,
            reactions: [],
            id: reference_id,
            reference_id: reference_id,
            //quote: this.props.replyQuote ? payload.quote : null,
            quote: null,
            unfurls: [],
            g_date: localizeDate(timestamp, "YYYY-MM-DD"),
        };

        // if (this.props.onCreateChannel) {
        //     this.props.onCreateChannel(obj, payload);
        //     return;
        // }
        // this.props.onClearQuote();

        if (!editMode) {
            dispatch(addChatMessage(obj))
        }
        if (reactQuillRef.current){
            reactQuillRef.current.getEditor().setContents([]);
            // reactQuillRef.current.getEditor().setText('');
        }

        if (editMode) {
            let payloadEdit = {
                ...payload,
                message_id: editMessage.id,
                reply_id: editMessage.id,
            };
            // if (this.props.replyQuote) {
            //     payload.quote = this.props.replyQuote.ref_quote;
            // }
            dispatch(
                updateChatMessage(payloadEdit, (err, data) => {
                    // if (this.props.cbOnUpdate) {
                    //     this.props.cbOnUpdate(payloadEdit);
                    // }
                    // if (!err) {
                    //     this.setState({lastReplyId: ""});
                    //     this.handleEditReplyClose();
                    // }
                })
            );
        } else {
            dispatch(
                createChatMessage(payload, (err, data) => {
                // if (this.props.cbOnCreate) {
                //     this.props.cbOnCreate();
                // }
                })
            );
        }
        setTextOnly("")
        setText("")
        
        // this.setState({
        //     text: "",
        //     lastReplyId: timestamp,
        //     files: [],
        //     file_ids: [],
        //     post_file_ids: [],
        //     showEmojiPicker: false,
        //     showGifPicker: false,
        // }, () => {
        //     if (this.props.channelDrafts[this.props.channelId]) {
        //         this.props.deleteChannelDraftAction(this.props.channelDrafts[this.props.channelId], (err, res) => {
        //             this.props.deleteSelectedChannelDraftAction({
        //                 channel_id: this.props.channelId,
        //             });
        //         });
        //     }
        // });
    }

    const handleQuillChange = (content, delta, source, editor) => {

        if (selectedChannel === null) return
        const textOnly = editor.getText(content);

        setText(content)
        setTextOnly(textOnly)
        setQuillContents(editor.getContents())

        if (editor.getContents().ops && editor.getContents().ops.length) {
            handleMentionUser(editor.getContents().ops.filter(m => m.insert.mention).map(i => i.insert.mention.id));
        }

            
        let channel = null;
        if (selectedChannel.is_shared) {
            if (window[selectedChannel.slug_owner]) {
                channel = window[selectedChannel.slug_owner].private(selectedChannel.slug_owner + `.App.Channel.${selectedChannel.id}`);
                channel.whisper("typing", {
                    user: user,
                    typing: true,
                    channel_id: selectedChannel.id,
                });
            }
        } else {
            channel = window.Echo.private(localStorage.getItem("slug") + `.App.Channel.${selectedChannel.id}`);
            channel.whisper("typing", {
                user: user,
                typing: true,
                channel_id: selectedChannel.id,
            });
        }

        // if (this.props.cbOnChange) {
        //     this.props.cbOnChange(reactQuillRef);
        // }
    };

   const handleMentionUser = mention_ids => {
        mention_ids = mention_ids.map(id => parseInt(id)).filter(id => !isNaN(id));
        if (mention_ids.length) {
            //check for recipients/type
            if (selectedChannel.type === "PERSONAL_BOT") return;
            let ignoreIds = [user.id, ...selectedChannel.members.map(m => m.id), ...ignoredMentionedUserIds];
            let userIds = mention_ids.filter(id => {
                let userFound = false;
                ignoreIds.forEach(pid => {
                    if (pid === parseInt(id)) {
                        userFound = true;
                        return
                    }
                });
                return !userFound;
            });
            setMentionedUserIds(userIds.length ? userIds.map(id => parseInt(id)) : [])
        } else {
            setIgnoredMentionedUserIds([])
            setMentionedUserIds([])
        }
    };
    
    const [modules] = useQuillModules('chat', handleSubmit)

    return (
        <StyledQuillEditor 
            className={'chat-input'} 
            modules={modules}
            ref={reactQuillRef}
            onChange={handleQuillChange}
        />
    )
}

export default ChatInput