import React, {useState} from "react";
import styled from "styled-components";
import {UserListPopUp} from "../../common";

const SeenIndicatorContainer = styled.div`
    // position: absolute;
    // right: ${props => props.isAuthor ? "0" : "unset"};
    // left: ${props => props.isAuthor ? "unset" : "5px"};
    //top: 100%;
    text-align: ${props => props.isAuthor ? "right" : "left"};
    z-index: 2;
    font-size: .7em;
    cursor: pointer;
    padding: 0 5px;
    //bottom: -15px;
`;
const StyledUserListPopUp = styled(UserListPopUp)`
    position: absolute;
    bottom: 100%;
    max-width: 250px;
    left: ${props => props.isAuthor ? "unset" : "5px"};
    right: ${props => props.isAuthor ? "5px" : "unset"};
    ul {
        max-height: 250px;
    }
`;

const SeenIndicator = props => {
    const {isPersonal, seenMembers, isAuthor} = props;
    const [showUsersPopUp, setShowUsersPopUp] = useState(false);

    const handleShowSeenUsers = () => setShowUsersPopUp(!showUsersPopUp);

    return (
        <SeenIndicatorContainer {...props}>
            {isPersonal && "seen"}
            {!isPersonal && seenMembers.length === 1 && `seen by ${seenMembers.map(m => m.first_name).slice(0, 1).toString()}`}
            {
                !isPersonal && seenMembers.length > 1 &&
                <React.Fragment>
                    seen by {seenMembers.map(m => m.first_name).slice(0, 1).toString()} and
                    <span onClick={handleShowSeenUsers}> more</span>
                </React.Fragment>
            }
            {
                !isPersonal && seenMembers.length > 1 && showUsersPopUp &&
                <StyledUserListPopUp
                    className={"chat-seen-list"}
                    users={seenMembers}
                    isAuthor={isAuthor}
                    onShowList={handleShowSeenUsers}
                />
            }
        </SeenIndicatorContainer>
    );
};

export default SeenIndicator;