import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {getChannel, getLastVisitedChannel, setSelectedChannel} from "../../redux/actions/chatActions";

const useLoadLastVisitedChannel = (props) => {
    //const { history} = props
    const {path, params} = props.match;
    const dispatch = useDispatch();

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
                    dispatch(setSelectedChannel(activeChannel));
                }),
            );
        };
        if (path === "/chat/:cid" || path === "/chat/:cid/mid") {
            loadSelectedChannel({channel_id: params.cid});
        } else {
            dispatch(
                getLastVisitedChannel({}, (err, res) => {
                    loadSelectedChannel({channel_id: res.data.code});
                    //history.push(`/chat/${res.data.code}`);
                }),
            );
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

};

export default useLoadLastVisitedChannel;