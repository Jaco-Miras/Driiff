import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { updateWorkspacePostFilterSort } from "../../../redux/actions/workspaceActions";

const Wrapper = styled.div`
  a {
    cursor: pointer;
  }
`;
const StyledIcon = styled(SvgIconFeather)`
  width: 1em;
  vertical-align: bottom;
  margin-right: 40px;

  &:hover {
    color: #000000;
  }
`;
const PostList = (props) => {
  const { className = "", workspace, postLists, onGoBack, postListTag, postActions } = props;
  const [selectedFilter, setSelectedFilter] = useState(null);
  const { showModal } = postActions;
  const dispatch = useDispatch();

  const handleClickFilter = (e) => {
    e.persist();
    let payload = {
      topic_id: workspace.id,
      tag: null,
      postListTag: e.target.dataset.id,
      filter: null,
    };

    dispatch(updateWorkspacePostFilterSort(payload));
    onGoBack();
    document.body.classList.remove("mobile-modal-open");
  };

  const handleEditArchivePostList = (e, data) => {
    e.stopPropagation();
    showModal("edit_post_list", data);
  };

  const handleHover = (e, data) => {
    setSelectedFilter(data.id);
  };

  return (
    <Wrapper className={`post-filter-item list-group list-group-flush ${className}`}>
      {postLists &&
        postLists.map((list) => {
          return (
            <a
              className={`list-group-item d-flex align-items-center ${postListTag && parseInt(postListTag) === list.id ? "active" : ""}`}
              data-value={list.name.toLowerCase()}
              data-id={list.id}
              key={list.id}
              onClick={(e) => handleClickFilter(e)}
              onMouseOver={(e) => handleHover(e, list)}
              onMouseLeave={(e) => setSelectedFilter(null)}
            >
              <span className="text-primary fa fa-circle mr-2" />
              {list.name}
              {(selectedFilter && selectedFilter === list.id && (
                <span className="small ml-auto" onClick={(e) => handleEditArchivePostList(e, list)}>
                  <StyledIcon className="mr-0 small" icon="edit-3" />
                </span>
              )) || <span className="small ml-auto">{list.total_post_connected > 0 ? list.total_post_connected : ""}</span>}
            </a>
          );
        })}
    </Wrapper>
  );
};

export default React.memo(PostList);
