import React from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../../common";
import { useTranslationActions } from "../../../hooks";

const Wrapper = styled.a`
  .icon {
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    &:hover {
      background: rgba(67, 67, 67, 0.125);
      svg {
        stroke: ${({ theme }) => theme.colors.primary};
      }
    }
    svg {
      width: 0;
      height: 0;
      transition: 0.3s;
    }
  }
  &:hover {
    cursor: default;
    .icon {
      svg {
        width: 24px;
        height: 24px;
      }
    }
  }
`;

const UserListItem = (props) => {
  const { _t } = useTranslationActions();

  const dictionary = {
    guestBadge: _t("IMPERSONATION_BADGE.GUEST", "Guest"),
  };

  const handleClick = (e) => {
    e.preventDefault();
    alert(JSON.stringify(props.user));
  };

  const isExternal = props.user.type === "external";
  return (
    <>
      <Wrapper href="#" className="list-group-item list-group-item-action py-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Avatar name={props.user.name} imageLink={props.user.profile_image_link} onClick={() => {}} />
          <div className="ml-3">
            <div>
              <span>{props.user.name}</span>
            </div>
            <div>
              {props.user.email} {isExternal && <span className="badge badge-warning">{dictionary.guestBadge}</span>}
            </div>
          </div>
        </div>
        <div className="icon" onClick={handleClick}>
          <SvgIconFeather icon="log-in" />
        </div>
      </Wrapper>
    </>
  );
};

export default UserListItem;
