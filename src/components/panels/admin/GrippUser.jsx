import React, { useRef } from "react";
import styled from "styled-components";
import { Avatar, Badge, SvgIconFeather, ToolTip } from "../../common";
import { MoreOptions } from "../common";

const Wrapper = styled.div`
  .avatar {
    cursor: pointer;
    min-height: 2.7rem;
    min-width: 2.7rem;
  }
  .user-name {
    display: flex;
    cursor: pointer;
    flex-flow: row wrap;
  }
  .feather-message-circle {
    cursor: pointer;
    &:hover {
      color: #7a1b8b;
    }
  }
  > .col-12 {
    padding: 0;
  }
  .card.border {
    overflow: visible;
  }
  .people-text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .button-wrapper {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  &.gripp-user .card-body {
    height: auto;
  }
`;

const GrippUser = (props) => {
  const { className = "", onNameClick = null, user, dictionary, onActivateDeactivateUser } = props;
  const refs = {
    cardBody: useRef(null),
    content: useRef(null),
  };

  const handleOnNameClick = () => {
    if (onNameClick) onNameClick(user);
  };

  const handleActivateUser = () => {
    onActivateDeactivateUser(user);
  };

  const handleDeactivateUser = () => {
    onActivateDeactivateUser(user);
  };

  return (
    <Wrapper className={`gripp-user col-12 col-md-6 ${className}`}>
      <div className="col-12">
        <div className="card border" key={user.id}>
          <div className="card-body" ref={refs.cardBody}>
            <div ref={refs.content} className="d-flex align-items-center justify-content-between">
              <div className="d-flex justify-content-start align-items-center">
                <Avatar
                  id={user.id}
                  name={user.name ? user.name : user.email}
                  hasAccepted={user.has_accepted}
                  // onClick={handleOnNameClick}
                  // noDefaultClick={true}
                  imageLink={user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link ? user.profile_image_link : ""}
                  showSlider={true}
                />
                <div className="user-info-wrapper ml-3">
                  <h6 className="user-name mb-0" onClick={handleOnNameClick}>
                    <div className="mr-2 d-flex">
                      <ToolTip content={user.email}>
                        <span className="mr-2">{user.name.trim() === "" ? user.email : user.name}</span>
                      </ToolTip>
                      {user.role && (user.role.name === "owner" || user.role.name === "admin") && (
                        <ToolTip content={"This is an administrator account"}>
                          <SvgIconFeather icon="settings" className="ml-1" width={10} height={10} />
                        </ToolTip>
                      )}
                    </div>

                    <span className="label-wrapper d-inline-flex start align-items-center">{user.active === 0 && <Badge label="Inactive" badgeClassName="badge badge-light text-white" />}</span>
                  </h6>

                  {user.designation && <span className="small text-muted">{user.designation}</span>}
                </div>
              </div>

              <div className="button-wrapper">
                <MoreOptions className="ml-2" width={240} moreButton={"more-horizontal"} scrollRef={refs.cardBody.current}>
                  {user.active === 1 && <div onClick={handleDeactivateUser}>{dictionary.deactivateUser}</div>}
                  {user.active === 0 && <div onClick={handleActivateUser}>{dictionary.activateUser}</div>}
                </MoreOptions>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default GrippUser;
