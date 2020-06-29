import {useSelector} from "react-redux";

const useSortWorkspaces = props => {

    const workspaces = useSelector(state => state.workspaces.workspaces);
    const {active_topic} = useSelector(state => state.settings.user.GENERAL_SETTINGS);

    let sortedWorkspaces = Object.values(workspaces).sort((a,b) => {
        return a.name.localeCompare(b.name);
    })
    return sortedWorkspaces;
};

export default useSortWorkspaces;