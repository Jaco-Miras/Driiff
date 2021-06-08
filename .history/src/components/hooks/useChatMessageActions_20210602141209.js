import React, { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { copyTextToClipboard } from "../../helpers/commonFunctions";
import { getBaseUrl } from "../../helpers/slugHelper";
import {
  addQuote,
  deleteChatMessage,
  getChatMessages,
  getChatStar,
  postChatMessage,
  postChatReaction,
  putChatMessage,
  putChatStar,
  putImportantChat,
  putMarkReminderComplete,
  setEditChatMessage,
  setLastChatVisibility,
  setEditHuddleAnswers,
  setTranslatedBody,
  setFancyLink,
} from "../../redux/actions/chatActions";
import { useToaster, useTodoActions } from "./index";
import useChannelActions from "./useChannelActions";
import { addToModals, deleteUnfurl, removeUnfurlReducer } from "../../redux/actions/globalActions";

const useChatMessageActions = () => {
  //const sharedSlugs = useSelector((state) => state.global.slugs);

  const dispatch = useDispatch();
  const toaster = useToaster();
  const todoActions = useTodoActions();

  const refs = {
    fetch: useRef(false),
  };

  // const getSharedPayload = useCallback(
  //   (channel) => {
  //     if (channel && channel.is_shared && sharedSlugs.length) {
  //       let slug = sharedSlugs.filter((s) => s.slug_name === channel.slug_owner)[0];
  //       return {
  //         is_shared_topic: 1,
  //         topic_id: channel.entity_id,
  //         is_shared: channel.entity_id,
  //         token: slug.access_token,
  //         slug: slug.slug_name,
  //       };
  //     } else {
  //       return {};
  //     }
  //   },
  //   [sharedSlugs]
  // );

  /**
   * @param {Object} channel
   * @param {Object} filter
   * @param {number} [filter.skip=0]
   * @param {number} [filter.limit=20]
   * @param {function} [callback]
   */
  const fetch = useCallback(
    (channel, { skip = 0, limit = 20 }, callback = () => {}) => {
      // if (!refs.fetch.current) {
      //   refs.fetch.current = true;
      let payload = {
        channel_id: channel.id,
        skip: skip,
        limit: limit,
        //...getSharedPayload(channel),
      };

      dispatch(
        getChatMessages(payload, (err, res) => {
          refs.fetch.current = false;
          callback(err, res);
        })
      );
      //}
    },
    [dispatch]
  );

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
  const create = useCallback(
    (channel, message, callback = () => {}) => {
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
         editable: true,
         files: [],
         is_archive: false,
         is_completed: true,
         is_transferred: false,
         is_deleted: false,
         created_at: {timestamp: timestamp},
         updated_at: {timestamp: timestamp},
         channel_id: selectedChannel.id,
         id: reference_id,
         reference_id: reference_id,
         quote: quote,
         unfurls: [],
         g_date: localizeDate(timestamp, "YYYY-MM-DD"),
         };*/

      dispatch(postChatMessage(payload, callback));
    },
    [dispatch]
  );

  /**
   * @param {Object} message
   * @param {function} [callback]
   */
  const edit = useCallback(
    (message, callback = () => {}) => {
      dispatch(putChatMessage(message, callback));
    },
    [dispatch]
  );

  /**
   * @param {number} messageId
   * @param {string} reactType
   * @param {function} [callback]
   */
  const react = useCallback(
    (messageId, reactType, callback = () => {}) => {
      dispatch(
        postChatReaction(
          {
            message_id: messageId,
            react_type: reactType,
          },
          callback
        )
      );
    },
    [dispatch]
  );

  /**
   * @param {number} messageId
   * @param {function} [callback]
   */
  const remove = useCallback(
    (messageId, callback = () => {}) => {
      dispatch(
        deleteChatMessage(
          {
            message_id: messageId,
            //...getSharedPayload(),
          },
          callback
        )
      );
    },
    [dispatch]
  );

  /**
   * @param {number} messageId
   * @param {function} [callback]
   */
  const markComplete = useCallback(
    (messageId, callback = () => {}) => {
      dispatch(
        putMarkReminderComplete(
          {
            message_id: messageId,
          },
          callback
        )
      );
    },
    [dispatch]
  );

  /**
   * @param {Object} channel
   * @param {string} body
   */
  const forward = useCallback((channel, body, callback = () => {}) => {
    let payload = {
      channel_id: channel.current.id,
      body: body,
      mention_ids: [],
      file_ids: [],
      reference_id: require("shortid").generate(),
      reference_title: channel.title,
      is_transferred: true,
    };

    dispatch(postChatMessage(payload, callback));
  });

  /**
   * Reducer
   *
   * @param {Object} message
   */
  const setQuote = (message) => {
    dispatch(addQuote(message));
  };

  /**
   * Reducer
   *
   * @param {Object} message
   */
  const setEdit = (message) => {
    dispatch(setEditChatMessage(message));
    if (message.quote && message.quote.hasOwnProperty("id")) {
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
  const clipboardLink = useCallback((channel, message) => {
    copyTextToClipboard(toaster, `${getBaseUrl()}/chat/${channel.code}/${message.code}`);
  }, []);

  /**
   * @param {number} unfurl_id
   * @param {number} channel_id
   * @param {number} message_id
   * @param {string} type
   */
  const removeUnfurl = useCallback(
    (payload) => {
      dispatch(deleteUnfurl(payload));
      dispatch(removeUnfurlReducer(payload));
    },
    [dispatch]
  );

  /**
   * @param {boolean} status
   */
  const setLastMessageVisiblility = useCallback(
    (payload) => {
      dispatch(setLastChatVisibility(payload));
    },
    [dispatch]
  );

  const remind = useCallback(
    (message, channel, callback = () => {}) => {
      const onConfirm = (payload, modalCallback = () => {}) => {
        todoActions.createForChat(message.id, payload, (err, res) => {
          if (err) {
            toaster.error("An error has occurred try again!");
          }
          if (res) {
            toaster.success(
              <>
                You will be reminded about this chat message under <b>To-dos & Reminders</b>.
              </>
            );
          }
          modalCallback(err, res);
          callback(err, res);
        });
      };
      let payload = {
        type: "todo_reminder",
        parentItem: channel,
        item: message,
        itemType: "CHAT",
        actions: {
          onSubmit: onConfirm,
        },
      };

      dispatch(addToModals(payload));
    },
    [dispatch]
  );

  /**
   * @param {chat} object
   * @param {function} [callback]
   */
  const markImportant = useCallback(
    (chat, callback = () => {}) => {
      dispatch(
        putImportantChat(
          {
            message_id: chat.id,
            is_important: chat.is_important ? 0 : 1,
          },
          callback
        )
      );
    },
    [dispatch]
  );

  /**
   * @param number messageId
   * @param {function} [callback]
   */
  const getStars = useCallback(
    (messageId, callback = () => {}) => {
      dispatch(
        getChatStar(
          {
            message_id: messageId,
          },
          callback
        )
      );
    },
    [dispatch]
  );

  /**
   * @param {object} payload
   * @parm number payload.star 1|0
   * @parm number payload.message_id chat.id
   * @param {function} [callback]
   */
  const setStar = useCallback(
    (payload, callback = () => {}) => {
      dispatch(putChatStar(payload, callback));
    },
    [dispatch]
  );

  /**
   * @param {object} payload
   * @parm number payload.message_id chat.id
   * @param {function} [callback]
   */
  const setHuddleAnswers = useCallback(
    (payload) => {
      dispatch(setEditHuddleAnswers(payload));
    },
    [dispatch]
  );

  /**
   * @param {object} payload
   * @parm number payload.message_id chat.id
   * @param {function} [callback]
   */
  const saveTranslationBody = useCallback(
    (payload) => {
      dispatch(setTranslatedBody(payload));
    },
    [dispatch]
  );

   /**
   * @param {object} payload
   * @parm number payload.message_id chat.id
   * @param {function} [callback]
   */
    const saveFancyLink = useCallback(
      (payload) => {
        dispatch(setFancyLink(payload));
      },
      [dispatch]
    );

  return {
    channelActions: useChannelActions(),
    fetch,
    create,
    edit,
    react,
    remove,
    removeUnfurl,
    remind,
    markComplete,
    forward,
    setQuote,
    setEdit,
    clipboardLink,
    setLastMessageVisiblility,
    markImportant,
    getStars,
    setStar,
    setHuddleAnswers,
    saveTranslationBody,
    saveFancyLink
  };
};

export default useChatMessageActions;
