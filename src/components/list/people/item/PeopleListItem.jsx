import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Avatar, Badge, SvgIconFeather, ToolTip } from "../../../common";
import { MoreOptions } from "../../../panels/common";

const Wrapper = styled.div`
  .avatar {
    cursor: pointer;
    // height: 2.5rem !important;
    // width: 2.5rem !important;
  }
  .user-name {
    display: flex;
    cursor: pointer;
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
  .people-text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: ${props => props.userNameMaxWidth}px;    
  }
  .button-wrapper {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
`;

const PeopleListItem = (props) => {
  const { className = "", loggedUser, onNameClick = null, onChatClick = null, user, dictionary, showOptions = false, onUpdateRole = null, roles } = props;

  const [userNameMaxWidth, setUserNameMaxWidth] = useState(320);

  const refs = {
    cardBody: useRef(null),
    content: useRef(null)
  };

  const handleOnNameClick = () => {
    if (onNameClick) onNameClick(user);
  };

  const handleOnChatClick = () => {
    if (onChatClick) onChatClick(user);
  };

  const handleUpdateRole = (role) => {
    let payload = {
      user_id: user.id,
      role_id: roles[role]
    };
    onUpdateRole(payload);
  };

  const handleResize = () => {
    if (refs.content.current) {
      let width = refs.content.current.clientWidth - 150;

      let el = refs.content.current.querySelector(".button-wrapper");
      if (el) {
        width -= el.clientWidth;
      }

      el = refs.content.current.querySelector(".avatar");
      if (el) {
        width -= el.clientWidth;
      }

      el = refs.content.current.querySelector(".label-wrapper");
      if (el) {
        width -= el.clientWidth;
      }

      setUserNameMaxWidth(width);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);
  console.log(user);
  return (
    <Wrapper className={`workspace-user-item-list col-12 col-md-6 ${className}`} userNameMaxWidth={userNameMaxWidth}>
      <div className="col-12">
        <div className="card border" key={user.id}>
          <div className="card-body" ref={refs.cardBody}>
            <div ref={refs.content} className="d-flex align-items-center justify-content-between">
              <div className="d-flex justify-content-start align-items-center">
                <Avatar id={user.id} name={user.name ? user.name : user.email} hasAccepted={user.has_accepted}
                        onClick={handleOnNameClick} noDefaultClick={true}
                        imageLink={user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link ? user.profile_image_link : ""}/>
                <div className="user-info-wrapper ml-3">
                  {user.hasOwnProperty("has_accepted") && !user.has_accepted ? (
                    <h6 className="user-name mb-1 ">
                      <ToolTip content={user.email}>
                        <div className="mr-2 people-text-truncate">{user.email}</div>
                      </ToolTip>
                      <Badge label={dictionary.peopleInvited} badgeClassName="badge badge-info text-white"/>
                    </h6>
                  ) : (
                    <h6 className="user-name mb-1 " onClick={handleOnNameClick}>
                      <ToolTip content={user.email}>
                        <div className="mr-2">
                          {user.name}
                        </div>
                      </ToolTip>
                      <span className="label-wrapper d-inline-flex start align-items-center">
                        {user.type === "external" &&
                        <Badge label={dictionary.peopleExternal} badgeClassName="badge badge-info text-white"/>}
                        {user.active !== 1 && <Badge label="Inactive" badgeClassName="badge badge-light text-white"/>}
                      </span>
                    </h6>
                  )}
                  {user.role && <span className="small text-muted">{user.role.display_name}</span>}
                </div>
              </div>
              {onChatClick !== null && loggedUser.type !== "external" && (
                <div className="button-wrapper">
                  {user.contact && user.contact !== "" && loggedUser.id !== user.id && (
                    <a href={`tel:${user.contact.replace(/ /g, "").replace(/-/g, "")}`}>
                      <SvgIconFeather className="mr-2" icon="phone"/>
                    </a>
                  )}
                  {
                    (user.type !== "external" && loggedUser.id !== user.id && user.active === 1) &&
                    <SvgIconFeather onClick={handleOnChatClick} icon="message-circle"/>
                  }
                                    {
                    showOptions && user.type !== "external" && user.role.name !== "owner" &&
                    <MoreOptions className="ml-2" width={240} moreButton={"more-horizontal"}
                                 scrollRef={refs.cardBody.current}>
                      {user.role.name === "employee" &&
                      <div onClick={() => handleUpdateRole("admin")}>{dictionary.assignAsAdmin}</div>}
                      {user.role.name === "admin" &&
                      <div onClick={() => handleUpdateRole("employee")}>{dictionary.assignAsEmployee}</div>}
                      {/* {
                        loggedUser.role.name === "admin" && (
                          <>
                          { user.role.name === "employee" && <div onClick={() => handleUpdateRole("admin")}>Assign as administrator</div> }
                          { user.role.name === "admin" && <div onClick={() => handleUpdateRole("employee")}>Assign as employee</div> }
                          </>
                        )
                      }
                      {
                        loggedUser.role.name === "owner" && (
                          <>
                          { (user.role.name === "employee" || user.role.name === "owner") && <div onClick={() => handleUpdateRole("admin")}>Assign as administrator</div> }
                          { (user.role.name === "admin" || user.role.name === "owner") && <div onClick={() => handleUpdateRole("employee")}>Assign as employee</div> }
                          { user.role.name === "employee" && <div onClick={() => handleUpdateRole("owner")}>Assign as owner</div> }
                          </>
                        )
                      } */}
                    </MoreOptions>
                  }
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
