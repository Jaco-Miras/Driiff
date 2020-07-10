import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useIsMember = (members = []) => {
  const user = useSelector((state) => state.session.user);

  const [isMember, setIsMember] = useState(null);

  useEffect(() => {
    if (members.length > 0) {
      const checkForId = (id) => id === user.id;
      setIsMember(members.some(checkForId));
    }
  }, [members]);

  return isMember;
};

export default useIsMember;
