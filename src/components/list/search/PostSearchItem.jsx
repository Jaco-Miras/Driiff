import React from "react";
import { useTimeFormat } from "../../hooks";

const PostSearchItem = (props) => {
  const { data, redirect } = props;
  const { post, workspaces } = data;
  const { localizeChatDate } = useTimeFormat();
  const handleRedirect = () => {
    let workspace = null;
    if (workspaces.length) {
      workspace = {
        id: workspaces[0].topic.id,
        name: workspaces[0].topic.name,
        folder_id: workspaces[0].workspace ? workspaces[0].workspace.id : null,
        folder_name: workspaces[0].workspace ? workspaces[0].workspace.name : null,
      };
    }

    redirect.toPost({
      post: post,
      workspace: workspace,
    });
  };
  return (
    <li className="list-group-item p-l-0 p-r-0">
      <div onClick={handleRedirect}>
        <h5>{post.title}</h5>
        {/* <p className="text-muted">post body here</p> */}
        <div className="text-muted font-size-13">
          <div>{localizeChatDate(post.created_at.timestamp)}</div>
        </div>
      </div>
    </li>
  );
};

export default PostSearchItem;
