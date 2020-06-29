import React from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {Avatar} from "../../../common";
import {MoreOptions} from "../../../panels/common";

const Wrapper = styled.li`
    &:hover {
        .more-options {
            display: flex;
        }
    }

    .more-options {
        display: none;
    }

    .avatar {
        cursor: pointer;
        cursor: hand;
    }

    .profile-name {
        cursor: pointer;
        cursor: hand;
    }

    > .more-options svg {
        width: auto;
    }
`;

const TeamListItem = (props) => {

    const {className = "", member, parentRef, onEditClick} = props;

    const history = useHistory();

    const handleClickName = () => {
        history.push(`/profile/${member.id}/${member.name}`);
    };

    console.log(member);

    return (
        <Wrapper className={`team-list-item list-group-item d-flex align-items-center p-l-r-0 justify-content-between ${className}`}>
            <div class="d-flex align-items-center">
                <div>
                    <Avatar className="mr-2" id={member.id} name={member.name} imageLink={member.profile_image_link}
                            partialName={member.partial_name}/>
                </div>
                <div>
                    <h6 className="profile-name m-b-0" onClick={handleClickName}>{member.name}</h6>
                    {
                        member.role &&
                        <small className="text-muted">{member.role.name}</small>
                    }
                </div>
            </div>
            <MoreOptions moreButton="more-vertical" scrollRef={parentRef}>
                <div>Role</div>
                <div onClick={onEditClick}>Remove</div>
            </MoreOptions>
        </Wrapper>
    );
};

export default React.memo(TeamListItem);