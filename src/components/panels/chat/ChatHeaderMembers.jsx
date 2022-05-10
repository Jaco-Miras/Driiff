import React from "react";
import { useSelector } from "react-redux";
import { MemberLists } from "../../list/members";

const ChatHeaderMembers = (props) => {
  const { channel } = props;
  const teams = useSelector((state) => state.users.teams);
  let members = channel.members;
  if (channel.type === "TEAM" || channel.type === "DIRECT_TEAM") {
    const team = Array.from(Object.values(teams)).find((t) => t.id === channel.entity_id);
    if (team) {
      const teamAvatar = {
        id: team.id,
        name: team.name,
        members: team.members,
        icon_link: team.icon_link,
      };
      members = [teamAvatar, ...members];
    }
  } else if (channel.type === "TOPIC" && channel.team_ids && channel.team_ids.length) {
    const teamAvatars = Array.from(Object.values(teams))
      .filter((t) => channel.team_ids.some((id) => id === t.id))
      .map((team) => {
        return {
          id: team.id,
          name: team.name,
          members: team.members,
          icon_link: team.icon_link,
        };
      });
    members = [...teamAvatars, ...members];
  }
  return (
    <div className="chat-header-right">
      <ul className="nav align-items-center justify-content-end">
        {["DIRECT", "PERSONAL_BOT"].includes(channel.type) === false && (
          <li>
            <MemberLists members={members} sharedUsers={channel.slug !== undefined} />
          </li>
        )}
      </ul>
    </div>
  );
};

export default ChatHeaderMembers;
