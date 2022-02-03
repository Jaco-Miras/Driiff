import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Avatar } from "../../common";
import { useTranslationActions } from "../../hooks";

const Wrapper = styled.div`
  .user-reads-container {
    position: relative;
    display: inline-flex;
    margin-right: 0.5rem;

    .not-read-users-container,
    .read-users-container {
      transition: all 0.5s ease;
      position: absolute;
      right: 0;
      bottom: 30px;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      background-color: #fff;
      overflow: auto;
      opacity: 0;
      max-height: 0;

      &:hover {
        opacity: 1;
        max-height: 175px;
      }

      .dark & {
        background-color: #25282c;
        border: 1px solid #25282c;
      }

      > span {
        padding: 0.5rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .avatar {
          img {
            min-width: 2.3rem;
          }
        }

        .name {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }
      }
    }
  }

  .user-reads-container {
    span.not-readers:hover ~ span.not-read-users-container,
    span.no-readers:hover ~ span.read-users-container {
      opacity: 1;
      max-height: 175px;
    }
  }
`;

const ApprovalBadgeWrapper = styled.div`
  text-align: right;
  display: flex;
  justify-content: center;
  .read-users-container .name {
    color: #212529;
    .dark & {
      color: #fff;
    }
  }
`;

const PostApprovalLabels = (props) => {
  const { post } = props;
  const { _t } = useTranslationActions();
  const user = useSelector((state) => state.session.user);
  const users = useSelector((state) => state.users.users);
  const usersApproval = post.users_approval;
  const isMultipleApprovers = post.users_approval.length > 1;
  const userApproved = usersApproval.find((u) => u.ip_address !== null && u.is_approved);
  const userRequestChange = usersApproval.find((u) => u.ip_address !== null && !u.is_approved);
  const isApprover = usersApproval.some((ua) => ua.id === user.id);
  const usersApproved = usersApproval.filter((u) => u.ip_address !== null && u.is_approved);
  const usersDisagreed = usersApproval.filter((u) => u.ip_address !== null && !u.is_approved);
  const usersPending = usersApproval.filter((u) => u.ip_address === null);
  const userApprovedIds = usersApproved.map((ua) => ua.id);
  const agreedUsers = Object.values(users).filter((u) => userApprovedIds.some((id) => id === u.id));
  const userDisagreedIds = usersDisagreed.map((ua) => ua.id);
  const disagreedUsers = Object.values(users).filter((u) => userDisagreedIds.some((id) => id === u.id));
  const userPendingIds = usersPending.map((ua) => ua.id);
  const pendingUsers = Object.values(users).filter((u) => userPendingIds.some((id) => id === u.id));
  const hasAnswered = usersApproval.some((ua) => ua.id === user.id && ua.ip_address !== null);
  const allUsersAgreed = usersApproval.filter((u) => u.ip_address !== null && u.is_approved).length === usersApproval.length;
  //if (!isApprover || !hasAnswered) return null;
  if (usersPending.length === usersApproval.length) return null;
  return (
    <Wrapper>
      {isMultipleApprovers && (
        <ApprovalBadgeWrapper className="readers-container">
          {disagreedUsers.length > 0 && (
            <div className="user-reads-container read-by badge badge-danger">
              <span className="no-readers">{_t("POST.PERSON_DISAGREED", "::count:: person disagreed", { count: usersDisagreed.length })}</span>
              <span className="hover read-users-container">
                {disagreedUsers.map((u) => {
                  return (
                    <span key={u.id}>
                      <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_link} id={u.id} /> <span className="name">{u.name}</span>
                    </span>
                  );
                })}
              </span>
            </div>
          )}
          {pendingUsers.length > 0 && (
            <div className="user-reads-container read-by badge badge-warning">
              <span className="no-readers">{_t("POST.PERSON_PENDING", "::count:: person pending", { count: pendingUsers.length })}</span>
              <span className="hover read-users-container">
                {pendingUsers.map((u) => {
                  return (
                    <span key={u.id}>
                      <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_link} id={u.id} /> <span className="name">{u.name}</span>
                    </span>
                  );
                })}
              </span>
            </div>
          )}
          {agreedUsers.length > 0 && (
            <div className="user-reads-container read-by badge badge-success">
              <span className="no-readers">{_t("POST.PERSON_APPROVED", "::count:: person approved", { count: usersApproved.length })}</span>
              <span className="hover read-users-container">
                {agreedUsers.map((u) => {
                  return (
                    <span key={u.id}>
                      <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_link} id={u.id} /> <span className="name">{u.name}</span>
                    </span>
                  );
                })}
              </span>
            </div>
          )}
        </ApprovalBadgeWrapper>
      )}
    </Wrapper>
  );
};

export default PostApprovalLabels;
