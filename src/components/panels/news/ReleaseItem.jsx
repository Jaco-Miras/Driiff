import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import quillHelper from "../../../helpers/quillHelper";

const Wrapper = styled.div`
  margin-bottom: 2rem;
  .date-edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .title {
    font-weight: bold;
    font-size: 1.1rem;
  }
  .feather-pencil {
    cursor: pointer;
    display: none;
  }
  .text-muted,
  .description {
    font-size: 0.8rem;
  }
  :hover {
    .feather-pencil {
      display: block;
    }
  }
`;

const ReleaseItem = (props) => {
  const { item, fromNow, openModal, isAuthorizedUser } = props;

  return (
    <Wrapper>
      <div className="date-edit">
        <span className="text-muted">
          {fromNow(item.created_at.timestamp)} &nbsp; {item?.draft_type && <i>draft</i>}
        </span>
        {isAuthorizedUser && <SvgIconFeather icon="pencil" height={12} width={12} onClick={() => openModal(item)} />}
      </div>
      <div className="title">{item.action_text}</div>
      <p className="description" dangerouslySetInnerHTML={{ __html: quillHelper.parseEmoji(item.body) }}></p>
    </Wrapper>
  );
};

export default React.memo(ReleaseItem);
