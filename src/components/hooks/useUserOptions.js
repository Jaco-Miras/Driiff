import { useDispatch } from "react-redux";
import { putUserRole, updateUserType, archiveUser, unarchiveUser, activateUser, deactivateUser, deleteUser, resendInvitation, deleteInvitedUser } from "../../redux/actions/userAction";
import { addToModals } from "../../redux/actions/globalActions";

const useUserOptions = () => {
  const dispatch = useDispatch();

  const updateUserRole = (payload, callback = () => {}) => {
    dispatch(putUserRole(payload, callback));
  };

  const updateType = (payload, callback = () => {}) => {
    dispatch(updateUserType(payload, callback));
  };

  const archive = (payload, callback) => {
    dispatch(archiveUser(payload, callback));
  };

  const unarchive = (payload, callback) => {
    dispatch(unarchiveUser(payload, callback));
  };

  const showModal = (modal) => {
    dispatch(addToModals(modal));
  };

  const activate = (payload, callback) => {
    dispatch(activateUser(payload, callback));
  };

  const deactivate = (payload, callback) => {
    dispatch(deactivateUser(payload, callback));
  };

  const deleteUserAccount = (payload, callback) => {
    dispatch(deleteUser(payload, callback));
  };

  const resendInvitationEmail = (payload, callback) => {
    dispatch(resendInvitation(payload, callback));
  };

  const deleteInvitedInternalUser = (payload, callback) => {
    dispatch(deleteInvitedUser(payload, callback));
  };

  return {
    updateUserRole,
    updateType,
    archive,
    unarchive,
    showModal,
    activate,
    deactivate,
    deleteUserAccount,
    resendInvitationEmail,
    deleteInvitedInternalUser,
  };
};

export default useUserOptions;
