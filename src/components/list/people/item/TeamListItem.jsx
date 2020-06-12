import React from "react";
import styled from "styled-components";
import {Avatar} from "../../../common";
import {MoreOptions} from "../../../panels/common";

const Wrapper = styled.li`
    > .more-options svg {
        width: auto;
    }
`;

const TeamListItem = (props) => {

    const {className = "", member, parentRef} = props;

    return (
        <Wrapper className={`team-list-item list-group-item d-flex align-items-center p-l-r-0 ${className}`}>
            <MoreOptions moreButton="more-vertical" scrollRef={parentRef}>
                <div>Role</div>
                <div>Remove</div>
            </MoreOptions>
            <div>
                <Avatar id={member.id} name={member.name} imageLink={member.profile_image_link} partialName={member.partial_name}/>
            </div>
            <div>
                <h6 className="m-b-0">{member.name}</h6>
                {/* <small className="text-muted">{member.role.name}</small> */}
            </div>
            {/* <div className="ml-auto">
                <span className="badge badge-success mr-2 d-sm-inline d-none">Completed</span>
            </div> */}
        </Wrapper>
    );
};

export default React.memo(TeamListItem);