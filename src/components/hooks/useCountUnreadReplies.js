import {useSelector} from "react-redux";

const useCountUnreadReplies = props => {

    const channel = useSelector(state => state.chat.selectedChannel);

    let unreadReplyCount = 0;
    if (channel !== null && channel.replies && channel.replies.length) {
        unreadReplyCount = channel.replies.filter(r => !r.is_read).length;
    }

    return unreadReplyCount;
};

export default useCountUnreadReplies;