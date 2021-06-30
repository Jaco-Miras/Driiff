import { useSelector } from "react-redux";

const useFilterAllWorkspaces = (props) => {
  const search = useSelector((state) => state.workspaces.search);
  const user = useSelector((state) => state.session.user);
  const { results, filterBy, value } = search;
  const filteredResults = results
    .filter((ws) => {
      if (filterBy === "all" || filterBy === "new") {
        return value !== "" ? ws.topic.name.includes(value) : true;
      } else if (filterBy === "member") {
        return value !== "" ? ws.topic.name.includes(value) && ws.members.some((m) => m.id === user.id) : ws.members.some((m) => m.id === user.id);
      } else if (filterBy === "nonMember") {
        return value !== "" ? ws.topic.name.includes(value) && !ws.members.some((m) => m.id === user.id) : !ws.members.some((m) => m.id === user.id);
      } else if (filterBy === "favourites") {
        return value !== "" ? ws.topic.name.includes(value) && ws.topic.is_favourite : ws.topic.is_favourite;
      } else if (filterBy === "external") {
        return value !== "" ? ws.topic.name.includes(value) && ws.topic.is_shared : ws.topic.is_shared;
      } else if (filterBy === "private") {
        return value !== "" ? ws.topic.name.includes(value) && ws.topic.is_locked : ws.topic.is_locked;
      } else if (filterBy === "archived") {
        return value !== "" ? ws.topic.name.includes(value) && ws.topic.is_archive : ws.topic.is_archive;
      }
    })
    .sort((a, b) => b.topic.created_at.timestamp - a.topic.created_at.timestamp);
  return {
    search,
    filteredResults: filterBy === "new" ? filteredResults.slice(0, search.counters.new) : filteredResults,
  };
};

export default useFilterAllWorkspaces;
