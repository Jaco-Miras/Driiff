import React from "react";
import styled from "styled-components";
import { useTranslation } from "../../hooks";

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

const PostChangeAccept = (props) => {
  const { fromNow, user, approving, usersApproval, handleApprove = () => {}, handleRequestChange = () => {}, postBody = false, post } = props;

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

  return (
    <Wrapper className="mb-3">
      {!postBody && usersApproval.filter((u) => u.ip_address === null).length === usersApproval.length && usersApproval.some((u) => u.id === user.id) && (
        <div className="d-flex align-items-center mt-3">
          <button className="btn btn-outline-primary mr-3" onClick={handleRequestChange}>
            {dictionary.requestChange} {approving.change && <span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true" />}
          </button>
          <button className="btn btn-primary" onClick={handleApprove}>
            {dictionary.accept} {approving.approve && <span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true" />}
          </button>
        </div>
      )}
      {userApproved && (
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
      {userRequestChange && (
        <ApprovedText>
          {userRequestChange.name} {isApprover ? dictionary.askForChange : dictionary.hasRequestedChange}{" "}
          <span className="text-muted approve-ip">
            {fromNow(userRequestChange.created_at.timestamp)} - {userRequestChange.ip_address}
          </span>
        </ApprovedText>
      )}
    </Wrapper>
  );
};

export default PostChangeAccept;
