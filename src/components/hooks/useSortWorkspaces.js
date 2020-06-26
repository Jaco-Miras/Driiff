import {useSelector} from "react-redux";

const useSortWorkspaces = props => {

    const workspaces = useSelector(state => state.workspaces.workspaces);
    const {active_topic} = useSelector(state => state.settings.user.GENERAL_SETTINGS);

    let sortedWorkspaces = Object.values(workspaces).sort((a,b) => {
        if (active_topic) {
            if (active_topic.workspace) {
                if (a.id === active_topic.workspace.id) return -1
                if (b.id === active_topic.workspace.id) return 1
            } else {
                if (a.id === active_topic.topic.id) return -1
                if (b.id === active_topic.topic.id) return 1
            }
        }
        return a.name.localeCompare(b.name);
    })
    return sortedWorkspaces;
};

export default useSortWorkspaces;