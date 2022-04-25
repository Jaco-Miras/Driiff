import React from "react";
import { Avatar } from "../../common";

const PeopleSearchItem = (props) => {
    
    const { user, redirect } = props;
    const handleRedirect = () => {
        redirect.toPeople(user);
    };

    return (
        <li className="list-group-item p-l-r-0">
            <div className="media" onClick={handleRedirect}>
                <Avatar id={user.id} name={user.name}
                        imageLink={user.profile_image_link}
                        className="mr-2"/>
                <div className="media-body">
                    <h6 className="m-0">{user.name}</h6>
                    {/* <p className="m-b-0">Designation here</p> */}
                </div>
            </div>
        </li>
    );
};

export default PeopleSearchItem;
