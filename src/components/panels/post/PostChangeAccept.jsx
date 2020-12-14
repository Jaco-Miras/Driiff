import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
`
const ApprovedText = styled.div`
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
    const { fromNow, user, approving, usersApproval, dictionary, handleApprove, handleRequestChange } = props;

    const userApproved = usersApproval.find((u) => u.ip_address !== null && u.is_approved);
    const userRequestChange = usersApproval.find((u) => u.ip_address !== null && !u.is_approved);

    return (
        <Wrapper className="mb-3">
            {
                (usersApproval.filter((u) => u.ip_address === null).length === usersApproval.length)  && 
                usersApproval.some((u) => u.id === user.id) &&
                <div className="d-flex align-items-center mt-3">
                    <button className="btn btn-outline-primary mr-3" onClick={handleRequestChange}>{dictionary.requestChange}  {approving.change && <span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"/>}</button>
                    <button className="btn btn-primary" onClick={handleApprove}>{dictionary.accept} {approving.approve && <span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"/>}</button>
                </div>
            }
            {
                userApproved &&
                <ApprovedText>
                {userApproved.name} {dictionary.hasAcceptedProposal} <span className="text-muted approve-ip">{fromNow(userApproved.created_at.timestamp)} - {userApproved.ip_address}</span>
                </ApprovedText>
            }
            {
                userRequestChange &&
                <ApprovedText>
                {userRequestChange.name} {dictionary.hasRequestedChange} <span className="text-muted approve-ip">{fromNow(userRequestChange.created_at.timestamp)} - {userRequestChange.ip_address}</span>
                </ApprovedText>
            }
        </Wrapper>
    )
};

export default PostChangeAccept;