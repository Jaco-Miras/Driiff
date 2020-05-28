import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addToChannels, getChannel, getLastVisitedChannel, setSelectedChannel} from "../../redux/actions/chatActions";

const useLoadLastVisitedChannel = (props) => {
    const {history} = props;
    const {path, params} = props.match;
    const dispatch = useDispatch();

    const selectedChannel = useSelector(state => state.chat.selectedChannel);

    useEffect(() => {
        const loadSelectedChannel = channel_id => {
            dispatch(
                getChannel(channel_id, (err, res) => {
                    if (err) return;

                    let activeChannel = {
                        ...res.data,
                        selected: true,
                        replies: [],
                        skip: 0,
                        hasMore: true,
                    };
                    dispatch(addToChannels(activeChannel));
                    dispatch(setSelectedChannel(activeChannel));
                }),
            );
        };
        if (selectedChannel === null) {
            if(["/workspace/chat", "/workspace/chat/:cid", "/workspace/chat/:cid/mid"].includes(path)) {
                history.push(`/workspace/chat/${params.cid}`);
            } else if (path === "/chat/:cid" || path === "/chat/:cid/mid") {
                loadSelectedChannel({channel_id: params.cid});
                history.push(`/chat/${params.cid}`);
            } else {
                dispatch(
                    getLastVisitedChannel({}, (err, res) => {
                        loadSelectedChannel({channel_id: res.data.code});
                        if(["/workspace/chat", "/workspace/chat/:cid", "/workspace/chat/:cid/mid"].includes(path)) {
                            history.push(`/workspace/chat/${res.data.code}`);
                        } else {
                            history.push(`/chat/${res.data.code}`);
                        }
                    }),
                );
            }
        } else {
            if(["/workspace/chat", "/workspace/chat/:cid", "/workspace/chat/:cid/mid"].includes(path)) {
                history.push(`/workspace/chat/${selectedChannel.code}`);
            } else {
                history.push(`/chat/${selectedChannel.code}`);
            }
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

};

export default useLoadLastVisitedChannel;