import { useSelector } from "react-redux";

const useIsMember = (members = []) => {
  const user = useSelector((state) => state.session.user);

  const isMember = members.length ? members.some((id) => id === user.id) : false;

  return isMember;
};

export default useIsMember;
