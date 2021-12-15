import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { useTranslationActions } from "../../hooks";
import WIPItem from "./WIPItem";

const Wrapper = styled.div`
  background: none;
  box-shadow: none;
`;

const PostsBtnWrapper = styled.div`
  margin-bottom: 10px;
  .btn {
    margin-left: 10px;
  }
`;

const PendingWIPContainer = styled.div`
  li {
    border-radius: 0 !important;
  }
`;

const WIPContainer = styled.div`
  li {
    border-radius: 0 !important;
    background-color: #fafafa !important;
    .dark & {
      background-color: hsla(0, 0%, 100%, 0.0784313725490196) !important;
    }
  }
`;

const PendingWIPHeader = styled.li`
  border-radius: 6px 6px 0 0 !important;
  border-bottom: 1px solid #ebebeb;
  // border-bottom: ${(props) => (props.showPosts ? "0" : "1px solid #ebebeb")};
  .badge-light {
    background: rgb(175, 184, 189, 0.2);
    .dark & {
      color: #fff;
    }
  }
`;

const ReadPostsHeader = styled.li`
  border-radius: ${(props) => (props.showPosts ? "0" : "0 0 6px 6px !important")};
  border-bottom: ${(props) => (props.showPosts ? "0" : "1px solid #ebebeb")};
  .badge-light {
    background: rgb(175, 184, 189, 0.2);
    .dark & {
      color: #fff;
    }
  }
`;

const EmptyState = styled.div`
  margin: 0;
  width: 100%;
  text-align: center;
  margin: auto;
  text-align: center;
  padding: 2rem;
  border: 1px solid #ebebeb;
  border-top: none;

  svg {
    display: block;
    margin: 0 auto;
  }

  h3 {
    font-size: 16px;
  }
  h5 {
    margin-bottom: 0;
    font-size: 14px;
  }

  button {
    width: auto !important;
    margin: 2rem auto;
  }
`;

const WIPList = (props) => {
  const { actions, dictionary, filter = "all", loading, wips } = props;

  const componentIsMounted = useRef(true);

  const { _t } = useTranslationActions();

  let emptyStatesHeader = [_t("POSTS.NO_ITEMS_FOUND_HEADER_1", "WOO!"), _t("POSTS.NO_ITEMS_FOUND_HEADER_2", "Queue’s empty, time to dance!")];

  let emptyStatesText = [_t("POSTS.NO_ITEMS_FOUND_TEXT_1", "Nothing here but me… 👻"), _t("POSTS.NO_ITEMS_FOUND_TEXT_2", "Job well done!💃🕺")];

  const [inDexer, setInDexer] = useState(Math.floor(Math.random() * emptyStatesHeader.length));

  const workspace = null;
  const archivedWIPs = [];
  const pendingWIPs = Object.values(wips);
  const search = "";
  const [showWIPs, setShowWIPs] = useState({ showPending: true, showArchived: true });
  const [checkedPosts, setCheckedPosts] = useState([]);

  const handleToggleCheckbox = (postId) => {
    let checked = !checkedPosts.some((id) => id === postId);
    const postIds = checked ? [...checkedPosts, postId] : checkedPosts.filter((id) => id !== postId);
    setCheckedPosts(postIds);
  };

  const handleMarkAllAsRead = () => {
    actions.readAll({
      selected_post_ids: checkedPosts,
      topic_id: workspace.id,
    });
    setCheckedPosts([]);
    actions.getUnreadNotificationEntries({ add_unread_comment: 1 });
  };

  const handleArchiveAll = () => {
    actions.archiveAll({
      selected_post_ids: checkedPosts,
      topic_id: workspace.id,
    });
    setCheckedPosts([]);
  };

  // const handleShowPosts = (type) => {
  //   setShowWIPs({
  //     ...showPosts,
  //     [type]: !showPosts[type],
  //   });
  // };

  const handleshowPending = () => {
    setShowWIPs((prevState) => {
      return {
        ...prevState,
        showArchived: !showWIPs.showArchived,
        showPending: !showWIPs.showPending,
      };
    });
  };

  const handleShowArchived = () => {
    setShowWIPs((prevState) => {
      return {
        ...prevState,
        showArchived: !showWIPs.showArchived,
        showPending: !showWIPs.showPending,
      };
    });
  };

  //   const handleSelectAllDraft = () => {
  //     setCheckedPosts(posts.map((p) => p.id));
  //   };

  //   const handleRemoveDraft = () => {
  //     if (checkedPosts.length) {
  //       checkedPosts.forEach((id) => {
  //         let post = posts.find((p) => p.id === id);
  //         if (post) actions.archivePost(post);
  //       });
  //     }
  //   };

  useEffect(() => {
    return () => {
      componentIsMounted.current = null;
    };
  }, []);

  useEffect(() => {
    if (componentIsMounted.current) setCheckedPosts([]);
  }, [filter]);

  useEffect(() => {
    setInDexer(Math.floor(Math.random() * emptyStatesHeader.length));
  }, [showWIPs]);

  return (
    <>
      {(filter === "all" || filter === "inbox") && checkedPosts.length > 0 && (
        <PostsBtnWrapper>
          <button className="btn all-action-button" onClick={handleArchiveAll}>
            archive
          </button>
          <button className="btn all-action-button" onClick={handleMarkAllAsRead}>
            read
          </button>
        </PostsBtnWrapper>
      )}
      <Wrapper className="card card-body app-content-body mb-4 unset-flex">
        <div className="app-lists" tabIndex="1" data-loaded="0" data-loading={loading}>
          {search !== "" && (
            <>
              {wips.length === 0 ? (
                <h6 className="search-title card-title font-size-11 text-uppercase mb-4">
                  {dictionary.searchNoResult} {search}
                </h6>
              ) : wips.length === 1 ? (
                <h6 className="search-title card-title font-size-11 text-uppercase mb-4">
                  {dictionary.searchResult} {search}
                </h6>
              ) : (
                <h6 className="search-title card-title font-size-11 text-uppercase mb-4">
                  {dictionary.searchResults} {search}
                </h6>
              )}
            </>
          )}
          {filter !== "all" && (
            <ul className="list-group list-group-flush ui-sortable fadeIn">
              <div>
                {Object.values(wips).map((p) => {
                  return <WIPItem key={p.id} item={p} toggleCheckbox={handleToggleCheckbox} checked={checkedPosts.some((id) => id === p.id)} />;
                })}
              </div>
            </ul>
          )}
          {filter === "all" && search === "" && (
            <ul className="list-group list-group-flush ui-sortable fadeIn">
              <div>
                <PendingWIPHeader className={"list-group-item post-item-panel pl-3 unread-posts-header"} onClick={handleshowPending} showPosts={showWIPs.showPending}>
                  <span className="badge badge-light">
                    <SvgIconFeather icon={showWIPs.showPending ? "arrow-up" : "arrow-down"} width={16} height={16} className="mr-1" />
                    Pending
                  </span>
                </PendingWIPHeader>
              </div>
              {pendingWIPs.length > 0 && (
                <PendingWIPContainer className={`unread-posts-container collapse ${showWIPs.showPending ? "show" : ""}`} id={"unread-posts-container"} showPosts={showWIPs.showPending}>
                  {pendingWIPs.length > 0 && (
                    <WIPContainer className={`read-posts-container collapse ${showWIPs.showArchived ? "show" : ""}`} showPosts={showWIPs.showArchived}>
                      {pendingWIPs.map((p, k) => {
                        return <WIPItem key={p.id} item={p} toggleCheckbox={handleToggleCheckbox} checked={checkedPosts.some((id) => id === p.id)} />;
                      })}
                    </WIPContainer>
                  )}
                </PendingWIPContainer>
              )}
              {showWIPs.showPending && pendingWIPs.length === 0 && (
                <EmptyState>
                  <h3>{emptyStatesHeader[inDexer]}</h3>
                  <h5>{emptyStatesText[inDexer]} </h5>
                </EmptyState>
              )}
              <div>
                <ReadPostsHeader className={"list-group-item post-item-panel pl-3 other-posts-header"} onClick={handleShowArchived} showPosts={showWIPs.showArchived}>
                  <span className="badge badge-light">
                    <SvgIconFeather icon={showWIPs.showArchived ? "arrow-up" : "arrow-down"} width={16} height={16} className="mr-1" />
                    Archived
                  </span>
                </ReadPostsHeader>
              </div>
              {archivedWIPs.length > 0 && (
                <WIPContainer className={`read-posts-container collapse ${showWIPs.showArchived ? "show" : ""}`} showPosts={showWIPs.showArchived}>
                  {archivedWIPs.map((p, k) => {
                    return <WIPItem key={p.id} item={p} toggleCheckbox={handleToggleCheckbox} checked={checkedPosts.some((id) => id === p.id)} />;
                  })}
                </WIPContainer>
              )}
            </ul>
          )}
        </div>
      </Wrapper>
    </>
  );
};

export default WIPList;
