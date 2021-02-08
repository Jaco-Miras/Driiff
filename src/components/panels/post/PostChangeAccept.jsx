import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useTranslation } from "../../hooks";
import { Avatar, SvgIconFeather } from "../../common";

const Wrapper = styled.div``;
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

const Icon = styled(SvgIconFeather)`
  width: 16px;

  &.close {
    cursor: pointer;
  }
`;

const PostChangeAccept = (props) => {
  const { fromNow, user, approving, usersApproval, handleApprove = () => {}, handleRequestChange = () => {}, postBody = false, post, isMultipleApprovers } = props;

  const users = useSelector((state) => state.users.users);
  const { _t } = useTranslation();
  const dictionary = {
    comment: _t("NOTIFICATION.COMMENT_POPUP", "Made a comment in ::title::", { title: "" }),
    requestChange: _t("POST.REQUEST_CHANGE", "Request for change"),
    hasRequestedChange: _t("POST.HAS_REQUESTED_CHANGE", "has requested a change."),
    accept: _t("POST.ACCEPT", "Accept"),
    hasAcceptedProposal: _t("POST.HAS_ACCEPTED_PROPOSAL", "has accepted the proposal."),
    askForChange: _t("POST.ASK_FOR_CHANGE", "asked ::author:: for a change", { author: post.author.name }),
  };
  const userApproved = usersApproval.find((u) => u.ip_address !== null && u.is_approved);
  const userRequestChange = usersApproval.find((u) => u.ip_address !== null && !u.is_approved);
  const isApprover = usersApproval.some((ua) => ua.id === user.id);
  const usersApproved = usersApproval.filter((u) => u.ip_address !== null && u.is_approved);
  const usersDisagreed = usersApproval.filter((u) => u.ip_address !== null && !u.is_approved);
  const userApprovedIds = usersApproved.map((ua) => ua.id);
  const agreedUsers = Object.values(users).filter((u) => userApprovedIds.some((id) => id === u.id));
  const userDisagreedIds = usersDisagreed.map((ua) => ua.id);
  const disagreedUsers = Object.values(users).filter((u) => userDisagreedIds.some((id) => id === u.id));
  const hasAnswered = usersApproval.some((ua) => ua.id === user.id && ua.ip_address !== null);

  return (
    <Wrapper className="mb-3">
      {!postBody && !hasAnswered && isApprover && (
        <div className="d-flex align-items-center mt-3">
          <button className="btn btn-outline-primary mr-3" onClick={handleRequestChange}>
            {dictionary.requestChange} {approving.change && <span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true" />}
          </button>
          <button className="btn btn-primary" onClick={handleApprove}>
            {dictionary.accept} {approving.approve && <span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true" />}
          </button>
        </div>
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
        <div className="readers-container">
          {usersApproved.length > 0 && (
            <div className="user-reads-container read-by">
              {userApprovedIds.some((id) => id === user.id) && (
                <span className="mr-2">
                  <Icon className="mr-2" icon="check" /> I've agreed to this
                </span>
              )}
              <span className="no-readers">Agreed by {usersApproved.length} users</span>
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
          <br />
          {usersDisagreed.length > 0 && (
            <div className="user-reads-container read-by">
              {userDisagreedIds.some((id) => id === user.id) && (
                <span className="mr-2">
                  <Icon className="mr-2" icon="check" /> I've disagreed to this
                </span>
              )}
              <span className="no-readers">Disagreed by {usersDisagreed.length} users</span>
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
        </div>
      )}
    </Wrapper>
  );
};

export default PostChangeAccept;
