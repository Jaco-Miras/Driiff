import { useDispatch } from "react-redux";
import { getTeams, postTeam, putTeam, deleteTeam, addTeamMember, removeTeamMember, createTeamChannel } from "../../redux/actions/userAction";
import { addSelectChannel } from "../../redux/actions/chatActions";

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

  const addMember = (payload, callback) => {
    dispatch(addTeamMember(payload, callback));
  };

  const removeMember = (payload, callback) => {
    dispatch(removeTeamMember(payload, callback));
  };

  const createChannel = (payload, callback) => {
    dispatch(createTeamChannel(payload, callback));
  };

  const addAndSelectChannel = (channel, callback) => {
    dispatch(addSelectChannel(channel, callback));
  };

  return {
    fetchTeams,
    createTeam,
    updateTeam,
    removeTeam,
    addMember,
    removeMember,
    createChannel,
    addAndSelectChannel,
  };
};

export default useTeamActions;
