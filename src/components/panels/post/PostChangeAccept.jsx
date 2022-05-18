import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useTranslationActions } from "../../hooks";
import { Avatar } from "../../common";

const Wrapper = styled.div`
  .read-users-container {
    max-width: 200px;
    text-align: left;
  }
`;
const ApprovedText = styled.div`
  .alert {
    color: #fff !important;
  }
  span.approve-ip {
    display: none;
  }
  :hover {
    span.approve-ip {
      display: block;
    }
  }
`;

// const Icon = styled(SvgIconFeather)`
//   width: 16px;

//   &.close {
//     cursor: pointer;
//   }
// `;

// const ApprovalLabelWrapper = styled.div`
//   text-align: right;
// `;

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

const PostChangeAccept = (props) => {
  const { fromNow, user, approving, usersApproval, handleApprove = () => {}, handleRequestChange = () => {}, postBody = false, post, isMultipleApprovers, isBotMessage = false } = props;

  const users = useSelector((state) => state.users.users);
  const { _t } = useTranslationActions();
  const dictionary = {
    comment: _t("NOTIFICATION.COMMENT_POPUP", "Made a comment in ::title::", { title: "" }),
    requestChange: _t("POST.REQUEST_CHANGE", "Request for change"),
    hasRequestedChange: _t("POST.HAS_REQUESTED_CHANGE", "has requested a change."),
    accept: _t("POST.ACCEPT", "Accept"),
    hasAcceptedProposal: _t("POST.HAS_ACCEPTED_PROPOSAL", "has accepted the proposal."),
    askForChange: _t("POST.ASK_FOR_CHANGE", "asked ::author:: for a change", { author: post.author.name }),
    agreedToThis: _t("POST.AGREED_TO_THIS", "I've agreed to this"),
    disagreedToThis: _t("POST.DISAGREED_TO_THIS", "I've disagreed to this"),
    agreedBy: _t("POST.AGREED_BY", "Agreed by"),
    disagreedBy: _t("POST.DISAGREED_BY", "Disagreed by"),
    agree: _t("POST.AGREE", "Agree"),
    disagree: _t("POST.DISAGREE", "Disagree"),
  };
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

  return (
    <Wrapper>
      {!postBody && !hasAnswered && isApprover && (
        <div className="d-flex align-items-center mt-3">
          <button className="btn btn-outline-primary mr-3" onClick={handleRequestChange} disabled={approving.approve}>
            {dictionary.disagree} {approving.change && <span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true" />}
          </button>
          <button className="btn btn-primary" onClick={handleApprove} disabled={approving.approve}>
            {dictionary.agree} {approving.approve && <span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true" />}
          </button>
        </div>
      )}
      {isBotMessage && (
        <ApprovedText>
          <div className={`d-flex align-items-center ${allUsersAgreed ? "justify-content-center" : ""}`}>
            <div className={`${allUsersAgreed ? "alert alert-success" : ""}`}>
              <span>{allUsersAgreed ? "Everyone agreed to this post" : "Everyone disagreed to this post"}</span>
            </div>
          </div>
        </ApprovedText>
      )}
      {usersPending && !isMultipleApprovers && (
        <ApprovalBadgeWrapper className="readers-container">
          {pendingUsers.length > 0 && (
            <div className="user-reads-container read-by badge badge-warning">
              <span className="no-readers">{_t("POST.PERSON_PENDING_SINGLE", "Waiting for approval from: ::name::", { name: pendingUsers[0].name })}</span>
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
        </ApprovalBadgeWrapper>
      )}
      {userApproved && !isMultipleApprovers && (
        <ApprovedText>
          <div className="d-flex align-items-center justify-content-center">
            <div className="alert alert-success">
              <span>
                {userApproved.name} {dictionary.hasAcceptedProposal}{" "}
              </span>
              <span className="approve-ip">
                {fromNow(userApproved.created_at.timestamp)} - {userApproved.ip_address}
              </span>
            </div>
          </div>
        </ApprovedText>
      )}
      {userRequestChange && !isMultipleApprovers && (
        <ApprovedText>
          {userRequestChange.name} {isApprover ? dictionary.askForChange : dictionary.hasRequestedChange}{" "}
          <span className="text-muted approve-ip">
            {fromNow(userRequestChange.created_at.timestamp)} - {userRequestChange.ip_address}
          </span>
        </ApprovedText>
      )}
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

export default PostChangeAccept;
