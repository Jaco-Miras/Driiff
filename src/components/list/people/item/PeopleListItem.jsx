import React, { useRef } from "react";
import styled from "styled-components";
import {Avatar, Badge, SvgIconFeather, ToolTip} from "../../../common";
import {MoreOptions} from "../../../panels/common";

const Wrapper = styled.div`
  .avatar {
    cursor: pointer;
    height: 2.5rem !important;
    width: 2.5rem !important;
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
    max-width: 218px;
  }
`;

const PeopleListItem = (props) => {
  const { className = "", loggedUser, onNameClick = null, onChatClick = null, user, dictionary, showOptions = false, onUpdateRole = null, roles } = props;

  const bodyRef = useRef(null);
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
    }
    onUpdateRole(payload)
  };

  return (
    <Wrapper className={`workspace-user-item-list col-12 col-md-6 ${className}`}>
      <div className="col-12">
        <div className="card border" key={user.id}>
          <div className="card-body" ref={bodyRef}>
            <div className="d-flex align-items-center">
              <div className="pr-3">
                <Avatar id={user.id} name={user.name ? user.name : user.email} hasAccepted={user.has_accepted} onClick={handleOnNameClick} noDefaultClick={true} imageLink={user.profile_image_link ? user.profile_image_link : ""} />
              </div>
              <div>
                {user.hasOwnProperty("has_accepted") && !user.has_accepted ? (
                  <h6 className="user-name mb-1 ">
                    <ToolTip content={user.email}>
                      <div className="mr-2 people-text-truncate">{user.email}</div>
                    </ToolTip>
                    <Badge label={dictionary.peopleInvited} badgeClassName="badge badge-info text-white" />
                  </h6>
                ) : (
                  <h6 className="user-name mb-1 " onClick={handleOnNameClick}>
                    <ToolTip content={user.email}>
                      <div className="mr-2">{user.name}</div>
                    </ToolTip>
                    {user.type === "external" &&
                    <Badge label={dictionary.peopleExternal} badgeClassName="badge badge-info text-white"/>}
                    {user.active !== 1 && <Badge label="Inactive" badgeClassName="badge badge-light text-white"/>}
                  </h6>
                )}
                {user.role && <span className="small text-muted">{user.role.display_name}</span>}
              </div>
              {onChatClick !== null && loggedUser.type !== "external" && (
                <div className="text-right ml-auto">
                  {
                    showOptions && user.type !== "external" && user.role.name !== "owner" &&
                    <MoreOptions className="mr-2" style={{top: "10px"}} width={240} moreButton={"more-horizontal"} scrollRef={bodyRef.current}>
                      { user.role.name === "employee" && <div onClick={() => handleUpdateRole("admin")}>{dictionary.assignAsAdmin}</div> }
                      { user.role.name === "admin" && <div onClick={() => handleUpdateRole("employee")}>{dictionary.assignAsEmployee}</div> }
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
                  {user.contact !== "" && loggedUser.id !== user.id && (
                    <a href={`tel:${user.contact.replace(/ /g, "").replace(/-/g, "")}`}>
                      <SvgIconFeather className="mr-2" icon="phone" />
                    </a>
                  )}
                  {
                    (user.type !== "external" && loggedUser.id !== user.id) && <SvgIconFeather onClick={handleOnChatClick} icon="message-circle" />
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
