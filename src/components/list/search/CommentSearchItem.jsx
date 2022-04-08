import React from "react";
import styled from "styled-components";
import { Avatar } from "../../common";

const Wrapper = styled.li`
  display: flex;
  width: 100%;
  p {
    margin: 0;
  }
`;

const ResultContent = styled.div`
  img {
    max-height: 200px;
    padding: 20px;
    margin-top: 20px;
    float: right;
  }
  p {
    display: none;
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5) {
      display: block;
    }
  }
`;

const CommentSearchItem = (props) => {
  const { comment, redirect } = props;
  const { data } = comment;

  const handleRedirect = () => {
    if (data === null) return;
    if (data.workspaces.length) {
      let workspace = {
        id: data.workspaces[0].topic.id,
        name: data.workspaces[0].topic.name,
        folder_id: data.workspaces[0].workspace ? data.workspaces[0].workspace.id : null,
        folder_name: data.workspaces[0].workspace ? data.workspaces[0].workspace.name : null,
      };
      redirect.toPost({ workspace: workspace, post: data.post }, { focusOnMessage: data.comment.id });
    } else {
      redirect.toPost({ workspace: null, post: data.post }, { focusOnMessage: data.comment.id });
    }
  };

  return (
    <Wrapper className="list-group-item p-l-0 p-r-0" onClick={handleRedirect}>
      {data !== null && (
        <>
          <div>
            <Avatar id={data.comment.author.id} name={data.comment.author.name} imageLink={data.comment.author.profile_image_thumbnail_link} showSlider={true} />
          </div>
          <div className="ml-2">
            <p>{data.comment.author.name}</p>
            <ResultContent className="text-muted" dangerouslySetInnerHTML={{ __html: data.comment.body }}></ResultContent>
          </div>
        </>
      )}
      {data === null && (
        <div>
          <p className="text-muted" dangerouslySetInnerHTML={{ __html: comment.search_body }}></p>
        </div>
      )}
    </Wrapper>
  );
};

export default CommentSearchItem;
