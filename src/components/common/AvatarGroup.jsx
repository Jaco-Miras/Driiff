import React from "react";
import Avatar from "./Avatar";

const AvatarGroup = props => {

    const { users } = props;
    
    return (
        <div className="mr-3 d-sm-inline d-none">
            <div className="avatar-group">
                {
                    users.map(u => {
                        return <Avatar name={u.name} imageLink={u.profile_image_link} id={u.id}/>
                    })
                }
            </div>
        </div>
    )
};

export default AvatarGroup;