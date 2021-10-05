import { useDispatch } from "react-redux";
import { getTeams, postTeam, putTeam, deleteTeam } from "../../redux/actions/userAction";

const useTeamActions = () => {
  const dispatch = useDispatch();

  const fetchTeams = (payload, callback) => {
    dispatch(getTeams(payload, callback));
  };

  const createTeam = (payload, callback) => {
    dispatch(postTeam(payload, callback));
  };

  const updateTeam = (payload, callback) => {
    dispatch(putTeam(payload, callback));
  };
  const removeTeam = (payload, callback) => {
    dispatch(deleteTeam(payload, callback));
  };

  return {
    fetchTeams,
    createTeam,
    updateTeam,
    removeTeam,
  };
};

export default useTeamActions;
