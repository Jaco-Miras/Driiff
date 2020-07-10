import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setBrowserTabStatus} from "../../redux/actions/globalActions";

const useVisibilityChange = props => {

    const dispatch = useDispatch();

    useEffect(() => {
        
        let visibilityChange;
        let hidden;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
            visibilityChange = "visibilitychange";
            hidden = "hidden";
        } else if (typeof document.msHidden !== "undefined") {
            visibilityChange = "msvisibilitychange";
            hidden = "msHidden";
        } else if (typeof document.webkitHidden !== "undefined") {
            visibilityChange = "webkitvisibilitychange";
            hidden = "webkitHidden";
        }
        
        const handleVisibilityChange = () => {
            if (document[hidden]) {
                dispatch(
                    setBrowserTabStatus({status: false})
                );
            } else {
                dispatch(
                    setBrowserTabStatus({status: true})
                );
            }
        };

        document.addEventListener(visibilityChange, handleVisibilityChange, false);

        return () => document.removeEventListener(visibilityChange, handleVisibilityChange, false);
    }, []);
    
};

export default useVisibilityChange;