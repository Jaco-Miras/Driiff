import React from "react";
import styled from "styled-components";
import { Avatar } from "../../common";
import { useTranslationActions } from "../../hooks";

const Wrapper = styled.div`
    display: flex;
    align-items-center;
    justify-content: flex-end;
    padding: 0.5rem 1.5rem;
`;

const PostUnfollowLabel = (props) => {
  const { user_unfollow } = props;
  const { _t } = useTranslationActions();
  const dictionary = {
    usersUnfollowed: _t("POST.USERS_UNFOLLOWED", "Unfollowed by ::user_count:: user/s", {
      user_count: user_unfollow.length,
    }),
  };
  return (
    <Wrapper className="text-muted">
      <div className="user-reads-container read-by">
        <span className="no-readers">{dictionary.usersUnfollowed}</span>
        <span className="hover read-users-container">
          {user_unfollow.map((u) => {
            return (
              <span key={u.id}>
                <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_thumbnail_link ? u.profile_image_thumbnail_link : u.profile_image_link} id={u.id} /> <span className="name">{u.name}</span>
              </span>
            );
          })}
        </span>
      </div>
    </Wrapper>
  );
};

export default PostUnfollowLabel;
