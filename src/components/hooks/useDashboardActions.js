import { useDispatch } from "react-redux";
import { getCompanyDashboardMembers, getCompanyDashboardRecentPosts, getCompanyDashboardTimeline } from "../../redux/actions/driffActions";

const useDashboardActions = () => {
  const dispatch = useDispatch();

  const fetchCompanyTimeline = (payload, callback = () => {}) => {
    dispatch(getCompanyDashboardTimeline(payload, callback));
  };

  const fetchCompanyRecentPosts = (payload, callback = () => {}) => {
    dispatch(getCompanyDashboardRecentPosts(payload, callback));
  };

  const fetchCompanyMembers = (payload, callback = () => {}) => {
    dispatch(getCompanyDashboardMembers(payload, callback));
  };

  return {
    fetchCompanyTimeline,
    fetchCompanyRecentPosts,
    fetchCompanyMembers,
  };
};

export default useDashboardActions;
