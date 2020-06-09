import {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {copyTextToClipboard} from "../../helpers/commonFunctions";
import {getBaseUrl} from "../../helpers/slugHelper";
import {
    addQuote,
    deleteChatMessage,
    getChatMessages,
    postChatMessage,
    postChatReaction,
    postChatReminder,
    putChatMessage,
    putMarkReminderComplete,
    setEditChatMessage,
} from "../../redux/actions/chatActions";
import useChannelActions from "./useChannelActions";

/**
 * @returns {{channelActions: {fetchMembersById: (...args: any[]) => any, saveHistoricalPosition: (...args: any[]) => any, unArchive: (...args: any[]) => any, fetchNoChannelUsers: (...args: any[]) => any, createByUserChannel: (...args: any[]) => any, select: (...args: any[]) => any, update, unMute, markAsRead, searchExisting, pin, fetchLastVisited: (...args: any[]) => any, create: (...args: any[]) => any, fetchByCode: (...args: any[]) => any, unPin, fetchAll: (...args: any[]) => any, saveLastVisited: (...args: any[]) => any, archive: (...args: any[]) => any, mute, unHide, updateName, hide, addMembers, deleteMembers, fetch: (...args: any[]) => any, fetchDrafts: (...args: any[]) => any, markAsUnRead}, setQuote: setQuote, edit: (...args: any[]) => any, setEdit: setEdit, forward: (...args: any[]) => any, fetch: (...args: any[]) => any, create: (...args: any[]) => any, react: (...args: any[]) => any, clipboardLink: (...args: any[]) => any, remove: (...args: any[]) => any, remind: (...args: any[]) => any, markComplete: (...args: any[]) => any}}
 */
const useChatMessageActions = () => {

    const sharedSlugs = useSelector(state => state.global.slugs);

    const dispatch = useDispatch();

    const getSharedPayload = useCallback((channel) => {
        if (channel.is_shared && sharedSlugs.length) {
            let slug = sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0];
            return {
                is_shared_topic: 1,
                topic_id: channel.entity_id,
                is_shared: channel.entity_id,
                token: slug.access_token,
                slug: slug.slug_name,
            };
        } else {
            return {};
        }
    }, [sharedSlugs]);

    /**
     * @param {Object} channel
     * @param {Object} filter
     * @param {number} [filter.skip=0]
     * @param {number} [filter.limit=20]
     * @param {function} [callback]
     */
    const fetch = useCallback((
        channel,
        {skip = 0, limit = 20},
        callback = () => {}) => {

        let payload = {
            channel_id: channel.id,
            skip: skip,
            limit: limit,
            ...getSharedPayload(channel),
        };

        dispatch(
            getChatMessages(payload, callback),
        );
    }, [dispatch]);

    /**
     * @param {Object} message
     * @param {string} message.reference_id
     * @param {body} message.body
     * @param {Array} [message.mention_ids=[]]
     * @param {Array} [message.files_ids=[]]
     * @param {null|Object} [message.quote]
     * @param {null|Object} [message.quote.id]
     * @param {null|Object} [message.quote.body]
     * @param {null|Object} [message.quote.user_id]
     * @param {null|Object} [message.quote.user]
     * @param {null|Object} [message.quote.files]
     * @param {function} [callback]
     */
    const create = useCallback((
        channel,
        message,
        callback = () => {}) => {

        let payload = {};

        /*let payload = {
         channel_id: channel.id,
         reference_title: channel.type === "DIRECT" && channel.members.length === 2
         ? `${user.first_name} in a direct message` : channel.title,
         mention_ids: [],
         quote: null,
         files_ids: [],
         reactions: [],
         ...message,
         };

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
         created_at: {timestamp: timestamp},
         updated_at: {timestamp: timestamp},
         channel_id: selectedChannel.id,
         id: reference_id,
         reference_id: reference_id,
         quote: quote,
         unfurls: [],
         g_date: localizeDate(timestamp, "YYYY-MM-DD"),
         };*/

        dispatch(
            postChatMessage(payload, callback),
        );
    }, [dispatch]);

    /**
     * @param {Object} message
     * @param {function} [callback]
     */
    const edit = useCallback((
        message,
        callback = () => {}) => {

        dispatch(
            putChatMessage(message, callback),
        );
    }, [dispatch]);

    /**
     * @param {number} messageId
     * @param {string} reactType
     * @param {function} [callback]
     */
    const react = useCallback((
        messageId,
        reactType,
        callback = () => {}) => {

        dispatch(
            postChatReaction({
                message_id: messageId,
                react_type: reactType,
            }, callback),
        );
    }, [dispatch]);

    /**
     * @param {number} messageId
     * @param {function} [callback]
     */
    const remove = useCallback((
        messageId,
        callback = () => {}) => {

        dispatch(
            deleteChatMessage({
                message_id: messageId,
                ...getSharedPayload(),
            }, callback),
        );
    }, [dispatch]);

    /**
     * @param {number} messageId
     * @param {string} setTime
     * @param {function} [callback]
     */
    const remind = useCallback((
        messageId,
        setTime,
        callback = () => {}) => {

        dispatch(
            postChatReminder({
                message_id: messageId,
                set_time: setTime,
            }, callback),
        );
    }, [dispatch]);

    /**
     * @param {number} messageId
     * @param {function} [callback]
     */
    const markComplete = useCallback((
        messageId,
        callback = () => {}) => {

        dispatch(
            putMarkReminderComplete({
                message_id: messageId,
            }, callback),
        );
    }, [dispatch]);

    /**
     * @param {Object} channel
     * @param {string} body
     */
    const forward = useCallback((
        channel,
        body,
        callback = () => {},
    ) => {

        let payload = {
            channel_id: channel.current.id,
            body: body,
            mention_ids: [],
            file_ids: [],
            reference_id: require("shortid").generate(),
            reference_title: channel.title,
            is_transferred: 1,
        };

        dispatch(
            postChatMessage(payload, callback),
        );
    });

    /**
     * Reducer
     *
     * @param {Object} message
     */
    const setQuote = (message) => {
        dispatch(
            addQuote(message),
        );
    };

    /**
     * Reducer
     *
     * @param {Object} message
     */
    const setEdit = (message) => {
        dispatch(
            setEditChatMessage(message),
        );

        if (message.quote) {
            let quote = {
                ...message.quote,
                channel_id: message.channel_id,
            };
            setQuote(quote);
        }
    };

    /**
     * @param {Object} channel
     * @param {Object} message
     */
    const clipboardLink = useCallback((
        channel,
        message) => {
        copyTextToClipboard(`${getBaseUrl()}/chat/${channel.code}/${message.code}`);
    }, []);

    return {
        channelActions: useChannelActions(),
        fetch,
        create,
        edit,
        react,
        remove,
        remind,
        markComplete,
        forward,
        setQuote,
        setEdit,
        clipboardLink,
    };
};

export default useChatMessageActions;