import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {getUserSettings} from "../../redux/actions/settingsActions";

const useSettings = props => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            getUserSettings(),
        );
    }, []);
};

export default useSettings;