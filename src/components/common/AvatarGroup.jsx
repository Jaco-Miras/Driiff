import React from "react";
import Avatar from "./Avatar";

const AvatarGroup = (props) => {
  const { users } = props;

  return (
    <div className="mr-3">
      <div className="avatar-group">
        {users.map((u) => {
          return <Avatar key={u.id} name={u.name} imageLink={u.profile_image_link} />;
        })}
      </div>
    </div>
  );
};

export default AvatarGroup;
