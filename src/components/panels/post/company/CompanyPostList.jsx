import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../../common";
import { usePostActions } from "../../../hooks";
// import { useSelector } from "react-redux";
// import { find } from "lodash";

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

const CompanyPostList = (props) => {
  const { className = "", postLists, tag, postListTag, onGoBack } = props;
  const [selectedFilter, setSelectedFilter] = useState(null);
  const { setCompanyFilterPosts, showModal } = usePostActions();

  const handleClickFilter = useCallback((e) => {
    let payload = {
      tag: null,
      postListTag: e.target.dataset.id,
      filter: null,
    };
    if (tag === e.target.dataset.id) {
      payload = {
        ...payload,
        tag: null,
        filter: "all",
      };
    }
    setCompanyFilterPosts(payload);
    onGoBack();
    document.body.classList.remove("mobile-modal-open");
  }, []);

  const handleEditArchivePostList = useCallback((e, data) => {
    e.stopPropagation();
    showModal("edit_post_list", data);
  });

  const handleHover = useCallback(
    (e, data) => {
      setSelectedFilter(data.id);
    },
    [selectedFilter]
  );

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

export default React.memo(CompanyPostList);
