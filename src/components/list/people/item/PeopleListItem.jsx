import React from "react";
import styled from "styled-components";
import {Avatar, SvgIconFeather} from "../../../common";

const Wrapper = styled.div`
    .avatar {
        cursor: pointer;
        cursor: hand;
        height: 2.5rem!important;
        width: 2.5rem!important;
    }
    .user-name {
        cursor: pointer;
        cursor: hand;
    }
    .feather-message-circle {
        cursor: pointer;
        cursor: hand;
        &:hover {
            color: #7a1b8b;
        }
    }
    > .col-12 {
       padding: 0;
    }
`;

const PeopleListItem = (props) => {

    const {
        className = "",
        onNameClick = null,
        onChatClick = null,
        user,
    } = props;

    const handleOnNameClick = () => {
        if (onNameClick)
            onNameClick(user);
    };

    const handleOnChatClick = () => {
        if (onChatClick)
            onChatClick(user);
    };

    return (
        <Wrapper className={`workspace-user-item-list col-12 col-md-6 ${className}`}>
            <div className="col-12">
                <div className="card border" key={user.id}>
                    <div className="card-body">
                        <div
                            className="d-flex align-items-center">
                            <div className="pr-3">
                                <Avatar id={user.id} name={user.name}
                                        onClick={handleOnNameClick}
                                        noDefaultClick={true}
                                        imageLink={user.profile_image_link}/>
                            </div>
                            <div>
                                <h6 className="user-name mb-1 " onClick={handleOnNameClick}>{user.name}</h6>
                                <span className="small text-muted">
                                    {
                                        user.role !== null &&
                                        <>{user.role.display_name}</>
                                    }
                                </span>
                            </div>
                            {
                                onChatClick !== null &&
                                <div className="text-right ml-auto">
                                    <SvgIconFeather onClick={handleOnChatClick} icon="message-circle"/>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(PeopleListItem);