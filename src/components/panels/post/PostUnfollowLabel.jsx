import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Avatar } from "../../common";
import { useTranslationActions, useOutsideClick } from "../../hooks";

const Wrapper = styled.div`
    display: flex;
    align-items-center;
    justify-content: flex-end;
    padding: 0.5rem 1.5rem;

    .user-reads-container {
      cursor: pointer;
    }

`;

const PostUnfollowLabel = (props) => {
  const { user_unfollow } = props;
  const [show, setShow] = useState(false);
  const wrapperRef = useRef();

  const { _t } = useTranslationActions();
  const dictionary = {
    usersUnfollowed: _t("POST.USERS_UNFOLLOWED", "Unfollowed by ::user_count:: user/s", {
      user_count: user_unfollow.length,
    }),
  };

  const close = () => {
    setShow(false);
  };

  useOutsideClick(wrapperRef, close, show);

  return (
    <Wrapper className="text-muted">
      <div
        ref={wrapperRef}
        className="user-reads-container read-by"
        onClick={() => {
          setShow(!show);
        }}
      >
        <span className="no-readers">{dictionary.usersUnfollowed}</span>
        <span className="hover read-users-container" style={{ opacity: show ? 1 : 0, maxHeight: show ? 175 : 0 }}>
          {user_unfollow.map((u) => {
            return (
              <span key={u.id}>
                <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_link} id={u.id} /> <span className="name">{u.name}</span>
              </span>
            );
          })}
        </span>
      </div>
    </Wrapper>
  );
};

export default PostUnfollowLabel;
