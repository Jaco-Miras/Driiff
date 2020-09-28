import React, {useEffect, useRef} from "react";
import styled from "styled-components";

const Wrapper = styled.div`
`;

const TodosBody = (props) => {
  const {
    className = "", dropZoneRef, filter, search, files, handleAddEditFolder, actions,
    params, folders, folder, fileIds, history, subFolders, dictionary, disableOptions,
    loadMore, isLoaded
  } = props;

  const refs = {
    files: useRef(null),
    btnLoadMore: useRef(null),
  }

  const initLoading = () => {
    loadMore.files();
  }

  const handleScroll = (e) => {
    if (e.target.dataset.loading === "false") {
      if ((e.target.scrollTop + 500) >= e.target.scrollHeight - e.target.offsetHeight) {
        if (refs.btnLoadMore.current)
          refs.btnLoadMore.current.click();
      }
    }
  }

  useEffect(() => {
    if (!refs.files.current)
      return;

    let el = refs.files.current;
    if (el && el.dataset.loaded === "0") {
      initLoading();

      el.dataset.loaded = "1";
      refs.files.current.addEventListener("scroll", handleScroll, false);
    }
  }, [refs.files.current]);

  return (
    <Wrapper className={`todos-body card app-content-body ${className}`}>
      <span className="d-none" ref={refs.btnLoadMore}>Load more</span>
      <div className="card-body app-lists" data-loaded={0}>
        Todo list
      </div>
    </Wrapper>
  );
};

export default React.memo(TodosBody);
