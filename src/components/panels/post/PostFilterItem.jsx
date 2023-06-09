import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { updateWorkspacePostFilterSort } from "../../../redux/actions/workspaceActions";
import { SvgIconFeather } from "../../common";
import { usePostActions } from "../../hooks";
import { addToWorkspacePosts } from "../../../redux/actions/postActions";

const Wrapper = styled.div`
  > span {
    cursor: pointer;
    cursor: hand;

    &.active {
      border-color: #ebebeb !important;

      &:after {
        content: "";
        width: 3px;
        height: 100%;
        background: ${(props) => props.theme.colors.primary};
        display: block;
        position: absolute;
        top: 0;
        animation: fadeIn 0.15s linear;
        left: 0;
      }
    }

    svg {
      width: 16px;
    }
  }
`;

const PostFilterItem = (props) => {
  const { className = "", workspace, filter = "all", filters, onGoBack, counters, dictionary } = props;

  const dispatch = useDispatch();
  const actions = usePostActions();
  const [fetching, setFetching] = useState(false);

  const fetchArchivePosts = () => {
    setFetching(true);
    let filterCb = (err, res) => {
      setFetching(false);
      if (err) return;
      let files = res.data.posts.map((p) => p.files);
      if (files.length) {
        files = files.flat();
      }
      dispatch(
        addToWorkspacePosts({
          slug: res.slug,
          isSharedSlug: res.isSharedSlug,
          topic_id: workspace.id,
          posts: res.data.posts,
          filter: res.data.posts,
          files,
          filters: {
            archived: {
              active: false,
              skip: res.data.next_skip,
              hasMore: res.data.total_take === res.data.posts.length,
            },
          },
        })
      );
    };

    actions.getPosts(
      {
        filters: ["post", "archived"],
        topic_id: workspace.id,
      },
      filterCb
    );
  };

  const handleClickFilter = (e) => {
    if (filters) {
      if (e.target.dataset.value === "archive" && workspace && !filters.hasOwnProperty("archived") && !fetching) {
        fetchArchivePosts();
      }
      if (e.target.dataset.value === filter) {
        onGoBack();
      } else {
        let payload = {
          topic_id: workspace.id,
          filter: e.target.dataset.value,
          tag: null,
          slug: workspace.slug,
          isSharedSlug: workspace.sharedSlug,
        };
        dispatch(updateWorkspacePostFilterSort(payload));
        onGoBack();
      }
      document.body.classList.remove("mobile-modal-open");
    }
  };

  return (
    <Wrapper className={`post-filter-item list-group list-group-flush ${className}`}>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "inbox" ? "active" : ""}`} data-value="inbox" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="inbox" />
        {dictionary.inbox}
        <span className="small ml-auto">{workspace && workspace.unread_posts > 0 && workspace.unread_posts}</span>
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "all" ? "active" : ""}`} data-value="all" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="mail" />
        {dictionary.all}
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "my_posts" ? "active" : ""}`} data-value="my_posts" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="send-post" />
        {dictionary.myPosts}
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "star" ? "active" : ""}`} data-value="star" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="star" />
        {dictionary.starred}
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "archive" ? "active" : ""}`} data-value="archive" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="clock" />
        {dictionary.archived}
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "draft" ? "active" : ""}`} data-value="draft" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="edit-3" />
        {dictionary.drafts}
        <span className="small ml-auto">{counters.drafts > 0 && counters.drafts}</span>
      </span>
    </Wrapper>
  );
};

export default React.memo(PostFilterItem);
