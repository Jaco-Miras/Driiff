import {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {localizeDate} from "../../helpers/momentFormatJS";
import {
    deleteChatMessage,
    getChatMessages,
    postChatMessage,
    postChatReaction,
    postChatReminder,
    putChatMessage,
    putMarkReminderComplete,
} from "../../redux/actions/chatActions";
import {useSettings} from "./index";
import useChannelActions from "./useChannelActions";


/**
 * @param channel
 * @returns {{add: (...args: any[]) => any, edit: (...args: any[]) => any, fetch: (...args: any[]) => any, react: (...args: any[]) => any, remove: (...args: any[]) => any, remind: (...args: any[]) => any, markComplete: (...args: any[]) => any}}
 */
const useChatMessageActions = (channel) => {

    const {chatSettings} = useSettings();

    const sharedSlugs = useSelector(state => state.global.slugs);

    const dispatch = useDispatch();

    const getSharedPayload = () => {
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
    };

    /**
     * @param {Object} filter
     * @param {number} [filter.skip=0]
     * @param {number} [filter.limit=20]
     * @param {function} [callback]
     */
    const fetch = useCallback((
        {skip = 0, limit = 20},
        callback = () => {}) => {

        let payload = {
            channel_id: channel.id,
            skip: skip,
            limit: limit,
            ...getSharedPayload(),
        };

        dispatch(
            getChatMessages(payload, callback),
        );
    }, [dispatch]);

    /**
     * @param {Object} message
     * @param {null|Object} [message.quote]
     * @param {function} [callback]
     */
    const create = useCallback((
        {quote = null},
        callback = () => {}) => {

        let payload = {}

        /*let payload = {
            channel_id: channel.id,
            body: text,
            mention_ids: mention_ids,
            file_ids: [],
            reference_id: reference_id,
            reference_title: channel.type === "DIRECT" && channel.members.length === 2
                             ? `${user.first_name} in a direct message` : channel.title,
            ...getSharedPayload(),
        };*/

        /*if (quote) {
            payload.quote = {
                id: quote.id,
                body: quote.body,
                user_id: quote.user.id,
                user: quote.user,
                files: quote.files,
            };
        }

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
            reactions: [],
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
     * @param {number} channelId
     * @param {string} name
     * @param {function} [callback]
     */
    const edit = useCallback((
        {},
        callback = () => {}) => {

        let payload = {};

        dispatch(
            putChatMessage(payload, callback),
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

    return {
        channelAction: useChannelActions(),
        fetch,
        create,
        edit,
        react,
        remove,
        remind,
        markComplete,
    };
};

export default useChatMessageActions;