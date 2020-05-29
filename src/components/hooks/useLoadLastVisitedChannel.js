import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    addToChannels,
    getChannel,
    getLastVisitedChannel,
    restoreLastVisitedChannel,
    saveLastVisitedChannel,
    setSelectedChannel,
    clearSelectedChannel
} from "../../redux/actions/chatActions";

const useLoadLastVisitedChannel = (props) => {
    const {history} = props;
    const {path, params} = props.match;
    const dispatch = useDispatch();

    const selectedChannel = useSelector(state => state.chat.selectedChannel);
    const channelsLoaded = useSelector(state => state.chat.channelsLoaded);
    const lastVisitedChannel = useSelector(state => state.chat.lastVisitedChannel);

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

        if (!channelsLoaded) {
            dispatch(clearSelectedChannel());
            dispatch(
                getLastVisitedChannel({}, (err, res) => {
                    loadSelectedChannel({channel_id: res.data.code});
                    history.push(`/chat/${res.data.code}`);
                })
            );
        } else {
            //channels already loaded then fetch the saved last visited channel
            if (lastVisitedChannel !== null) {
                dispatch(restoreLastVisitedChannel({channel_id: lastVisitedChannel.id}));
            }
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            //save the last visited channel on unmount
            dispatch(saveLastVisitedChannel(selectedChannel));
        };
    }, [selectedChannel]);

};

export default useLoadLastVisitedChannel;