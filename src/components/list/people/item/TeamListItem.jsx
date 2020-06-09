import React from "react";
import styled from "styled-components";
import {Avatar} from "../../../common";
import {MoreOptions} from "../../../panels/common";

const Wrapper = styled.li`
`;

const TeamListItem = (props) => {

    const {className = "", user, parentRef} = props;

    return (
        <Wrapper className={`team-list-item list-group-item d-flex align-items-center p-l-r-0 ${className}`}>
            <MoreOptions moreButton="vertical" scrollRef={parentRef}>
                <div>Remove</div>
            </MoreOptions>
            <div>
                <Avatar/>
            </div>
            <div>
                <h6 className="m-b-0">{user.name}</h6>
                <small className="text-muted">{user.role.name}</small>
            </div>
            <div className="ml-auto">
                <span className="badge badge-success mr-2 d-sm-inline d-none">Completed</span>
            </div>
        </Wrapper>
    );
};

export default React.memo(TeamListItem);