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
            if (path === "/chat/:cid" || path === "/chat/:cid/mid") {
                loadSelectedChannel({channel_id: params.cid});
                history.push(`/chat/${params.cid}`);
            } else {
                dispatch(
                    getLastVisitedChannel({}, (err, res) => {
                        loadSelectedChannel({channel_id: res.data.code});
                        history.push(`/chat/${res.data.code}`);
                    }),
                );
            }
        } else {
            history.push(`/chat/${selectedChannel.code}`);
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

};

export default useLoadLastVisitedChannel;