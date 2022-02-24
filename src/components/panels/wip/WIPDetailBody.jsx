import React, { useRef } from "react";
import styled from "styled-components";
import { Avatar } from "../../common";
import { useFiles } from "../../hooks";
import quillHelper from "../../../helpers/quillHelper";
import { useDispatch, useSelector } from "react-redux";
import { setViewFiles } from "../../../redux/actions/fileActions";
import WIPDetailBodyButtons from "./WIPDetailBodyButtons";
import Proposals from "./Proposals";

const Wrapper = styled.div`
  position: relative;
  flex: unset;
  .recipients svg {
    margin: 0;
  }

  .author-avatar {
    width: 40px;
    height: 40px;
  }

  .avatar.post-author {
    min-width: 45px;
  }

  .author-name {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: rgb(80, 80, 80);
    .dark & {
      color: #c7c7c7;
    }
  }

  .recipients {
    color: #8b8b8b;
    font-size: 10px;
  }

  .ellipsis-hover {
    position: relative;
    cursor: pointer;

    &:hover {
      .recipient-names {
        opacity: 1;
        max-height: 300px;
      }
    }
  }
`;

const PostBadgeWrapper = styled.div`
  //min-width: 150px;
  margin-left: auto;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
`;

const WIPDetailBody = (props) => {
  const { item } = props;
  // const dispatch = useDispatch();

  // const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  // const wsFiles = useSelector((state) => state.files.workspaceFiles);

  const refs = {
    container: useRef(null),
    body: useRef(null),
  };

  // const {
  //   fileBlobs,
  //   actions: { setFileSrc },
  // } = useFiles();

  // const handleInlineImageClick = (e) => {
  //   let id = null;
  //   if (e.srcElement.currentSrc.startsWith("blob")) {
  //     if (e.target.dataset.id) id = e.target.dataset.id;
  //   } else {
  //     let file = item.files.find((f) => f.thumbnail_link === e.srcElement.currentSrc);
  //     if (file) id = file.id;
  //   }

  //   if (id) {
  //     dispatch(
  //       setViewFiles({
  //         file_id: parseInt(id),
  //         files: item.files,
  //       })
  //     );
  //   }
  // };

  const files = item.files;
  return (
    <Wrapper ref={refs.container} className="card-body">
      <div className="d-flex align-items-center p-l-r-0 m-b-20">
        <div className="d-flex justify-content-between align-items-center text-muted w-100">
          <div className="d-inline-flex align-items-start">
            <Avatar className="author-avatar mr-2 post-author" id={item.author.id} name={item.author.name} imageLink={item.author.profile_image_thumbnail_link ? item.author.profile_image_thumbnail_link : item.author.profile_image_link} />
            <div>
              <span className="author-name">{item.author.first_name}</span>
            </div>
          </div>
          <PostBadgeWrapper>
            <WIPDetailBodyButtons item={item} />
          </PostBadgeWrapper>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <div className="w-100 post-body-content ql-editor" ref={refs.body} dangerouslySetInnerHTML={{ __html: quillHelper.parseEmoji(item.description) }} />
      </div>
      <Proposals items={Object.values(files)} showOptions={false} />
    </Wrapper>
  );
};

export default React.memo(WIPDetailBody);
