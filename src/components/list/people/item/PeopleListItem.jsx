import React from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather, Badge } from "../../../common";

const Wrapper = styled.div`
  .avatar {
    cursor: pointer;
    cursor: hand;
    height: 2.5rem !important;
    width: 2.5rem !important;
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
  const { className = "", loggedUser, onNameClick = null, onChatClick = null, user } = props;

  const handleOnNameClick = () => {
    if (onNameClick) onNameClick(user);
  };

  const handleOnChatClick = () => {
    if (onChatClick) onChatClick(user);
  };

  return (
    <Wrapper className={`workspace-user-item-list col-12 col-md-6 ${className}`}>
      <div className="col-12">
        <div className="card border" key={user.id}>
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="pr-3">
                <Avatar id={user.id} name={user.name} onClick={handleOnNameClick} noDefaultClick={true} imageLink={user.profile_image_link} />
              </div>
              <div>
                {
                  user.hasOwnProperty("has_accepted") && !user.has_accepted ? (
                    <h6 className="user-name mb-1 ">
                      {user.email} <Badge label={"Invited"}/>
                    </h6>
                  )
                  :
                  <h6 className="user-name mb-1 " onClick={handleOnNameClick}>
                    {user.name} {user.type === "external" && <Badge label={"External"}/>}
                  </h6>
                }
                {
                  user.role && <span className="small text-muted">{user.role !== null && <>{user.role.display_name}</>}</span>
                }
              </div>
              {onChatClick !== null && loggedUser.id !== user.id && (
                <div className="text-right ml-auto">
                  <SvgIconFeather onClick={handleOnChatClick} icon="message-circle" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(PeopleListItem);
