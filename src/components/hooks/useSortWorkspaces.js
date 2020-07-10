import {useSelector} from "react-redux";

const useSortWorkspaces = () => {

    const workspaces = useSelector(state => state.workspaces.workspaces);
    //const {active_topic} = useSelector(state => state.settings.user.GENERAL_SETTINGS);

    return Object.values(workspaces).sort((a, b) => {
        if (a.type !== b.type) {
            if (a.type === "FOLDER")
                return -1;
            if (b.type === "FOLDER")
                return 1;
        }

        /*let compare = b.updated_at.timestamp - a.updated_at.timestamp;
        if (compare !== 0)
            return compare;*/

        return a.name.localeCompare(b.name);
    });
};

export default useSortWorkspaces;