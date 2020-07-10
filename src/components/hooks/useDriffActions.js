import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { patchCheckDriff, postRegisterDriff } from "../../redux/actions/driffAction";

const useDriffActions = () => {
  const dispatch = useDispatch();

  /**
   * @param {string} driffName
   */
  const check = useCallback(
    (driffName, callback = () => {}) => {
      dispatch(patchCheckDriff(driffName, callback));
    },
    [dispatch]
  );

  /**
   * This function will call on the API to process driff registration
   *
   * @param {Object} payload
   * @param {string} payload.company_name
   * @param {string} payload.password
   * @param {string} payload.email
   * @param {string} payload.slug
   * @param {string} payload.user_name
   * @param {array} payload.invitations
   * @param {number} payload.free_account
   * @param {number} payload.topic_id
   * @param {string} payload.topic_name
   * @param {string} payload.slug_from
   * @param {string} payload.invited_by
   * @param {number} payload.invited_by_id     *
   */
  const register = useCallback(
    (payload, callback = () => {}) => {
      dispatch(postRegisterDriff(payload, callback));
    },
    [dispatch]
  );

  return {
    check,
    register,
  };
};

export default useDriffActions;
