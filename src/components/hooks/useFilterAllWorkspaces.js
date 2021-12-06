import { useSelector } from "react-redux";

const useFilterAllWorkspaces = (props) => {
  const search = useSelector((state) => state.workspaces.search);
  const user = useSelector((state) => state.session.user);
  const { results, filterBy, value, filterByFolder } = search;
  const filteredResults = results
    .filter((ws) => {
      if (filterByFolder) {
        return value !== "" ? ws.topic.name.toLowerCase().includes(value.toLowerCase()) && filterByFolder.workspaces.some((w) => w.id === ws.topic.id) : filterByFolder.workspaces.some((w) => w.id === ws.topic.id);
      } else {
        if (filterBy === "all" || filterBy === "new") {
          return value !== "" ? ws.topic.name.toLowerCase().includes(value.toLowerCase()) : true;
        } else if (filterBy === "member") {
          const workspaceMembers = ws.members
            .map((m) => {
              if (m.member_ids) {
                return m.member_ids;
              } else return m.id;
            })
            .flat();

          const uniqueMembers = [...new Set(workspaceMembers)];
          const isMember = uniqueMembers.some((id) => id === user.id);
          return value !== "" ? ws.topic.name.toLowerCase().includes(value.toLowerCase()) && isMember : isMember;
        } else if (filterBy === "nonMember") {
          const workspaceMembers = ws.members
            .map((m) => {
              if (m.member_ids) {
                return m.member_ids;
              } else return m.id;
            })
            .flat();

          const uniqueMembers = [...new Set(workspaceMembers)];
          const isMember = uniqueMembers.some((id) => id === user.id);
          return value !== "" ? ws.topic.name.toLowerCase().includes(value.toLowerCase()) && !isMember : !isMember;
        } else if (filterBy === "favourites") {
          return value !== "" ? ws.topic.name.toLowerCase().includes(value.toLowerCase()) && ws.topic.is_favourite : ws.topic.is_favourite;
        } else if (filterBy === "external") {
          return value !== "" ? ws.topic.name.toLowerCase().includes(value.toLowerCase()) && ws.topic.is_shared : ws.topic.is_shared;
        } else if (filterBy === "private") {
          return value !== "" ? ws.topic.name.toLowerCase().includes(value.toLowerCase()) && ws.topic.is_locked : ws.topic.is_locked;
        } else if (filterBy === "archived") {
          return value !== "" ? ws.topic.name.toLowerCase().includes(value.toLowerCase()) && ws.topic.is_archive : ws.topic.is_archive;
        }
      }
    })
    .sort((a, b) => b.topic.created_at.timestamp - a.topic.created_at.timestamp);
  return {
    search,
    filteredResults: filterBy === "new" ? filteredResults.slice(0, search.counters.new) : filteredResults,
  };
};

export default useFilterAllWorkspaces;
