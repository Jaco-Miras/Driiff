import React from "react";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { SvgIconFeather } from "../../common";
import { MoreOptions } from "../common";
import { useWIPActions } from "../../hooks";
import FileLinkView from "./FileLinkView";
import moment from "moment";

const Wrapper = styled.div``;
const WIPDetailWrapper = styled.div`
  min-height: 240px;
  .card-body {
    padding: 1rem 1.5rem;
  }
  flex-flow: column;
  height: 100%;
  display: flex;
`;

const MainHeader = styled.div`
  min-height: 70px;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      .post-title {
        width: 100%;
      }
    }
  }

  .company-post-detail-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .close {
    .dark & {
      color: #fff;
    }
  }

  .author-name {
    color: #a7abc3;
    font-size: 14px;
  }
  .deadline-label {
    border-radius: 6px;
    padding: 3px 5px;
    background-color: hsla(0, 0%, 82.4%, 0.2);
    font-size: 12px;
    margin-right: 3px;
    display: flex;
    align-items: center;
    font-weight: normal;
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 16px;

  &.close {
    cursor: pointer;
    width: 24px;
    height: 24px;
  }
`;

const StyledMoreOptions = styled(MoreOptions)`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  height: 36px;
  width: 40px;
  align-items: center;
  justify-content: center;
  .feather-more-horizontal {
    width: 25px;
    height: 24px;
  }
  .more-options-tooltip {
    left: auto;
    right: 0;
    top: 25px;
    width: 250px;

    svg {
      width: 14px;
    }
  }
`;

const MainBody = styled.div`
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  flex-flow: column;
  //   align-items: center;
  //   justify-content: center;
  height: calc(100% - 200px);
  padding: 15px;
`;

const ImageWrapper = styled.div`
  display: flex;
  height: 100%;
  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;

const MainFooter = styled.div`
  min-height: 100px;
  border-top: 1px solid #ebebeb;
  display: inline-flex;
  padding: 10px 20px;
  overflow: auto;
  .img-card {
    cursor: pointer;
    max-height: 100px;
    max-width: 100px;
    min-height: 100px;
    min-width: 100px;
    border-radius: 6px;
    border: 1px solid #ebebeb;
    overflow: hidden;
    text-align: center;
    font-size: 2rem;
    justify-content: center;
    align-items: center;
    display: flex;
    img {
      width: 100%;
      height: 100%;
    }
  }
`;

const GalleryView = (props) => {
  const { item } = props;
  const params = useParams();
  const history = useHistory();
  const wipActions = useWIPActions();
  const user = useSelector((state) => state.session.user);
  const handleGoBack = () => {
    wipActions.goBack();
  };
  const getPriorityColor = () => {
    if (!item) return null;
    if (item.priority === "medium") {
      return "badge-warning";
    } else if (item.priority === "high") {
      return "badge-danger";
    } else {
      return "badge-twitter";
    }
  };
  const mainFile = item.files.find((f) => f.id === parseInt(params.wipFileId));
  const file = mainFile.file_versions.length ? mainFile.file_versions[mainFile.file_versions.length - 1] : mainFile.link_versions[mainFile.link_versions.length - 1];
  console.log(file);
  const handleSelectImage = (fid, fvid) => {
    history.push(history.location.pathname.split("/file/")[0] + `/file/${fid}/${fvid}`);
  };

  return (
    <Wrapper className="card card-body app-content-body gallery-page">
      <WIPDetailWrapper className="fadeBottom">
        <MainHeader className="card-header d-flex justify-content-between">
          <div className="d-flex flex-column align-items-start">
            <div className="d-flex align-items-center">
              <div>
                <Icon className="close mr-2" icon="arrow-left" width="24" height="24" onClick={handleGoBack} />
              </div>
              <div>
                <h5 className="post-title mb-0">
                  <span>{file.media_link_title ? file.media_link_title : file.file_code}</span>
                </h5>
                <span className="d-flex">
                  <span className={`badge ${getPriorityColor()}`}>{item.priority}</span>
                  <span className="deadline-label ml-2">
                    <Icon className="mr-2" icon="calendar" />
                    {moment(item.deadline.timestamp, "X").format("DD-MM-YYYY")}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div>
            {item.author.id !== user.id && (
              <div>
                <StyledMoreOptions className="ml-2" width={170} moreButton={"more-horizontal"}></StyledMoreOptions>
              </div>
            )}
          </div>
        </MainHeader>
        <MainBody>
          <ImageWrapper className="w-100" isFileLink={file.media_link_title !== null}>
            {file.media_link_title && <FileLinkView file={file} />}
            {file.type && file.type === "image" && <img src={file.view_link} />}
          </ImageWrapper>
        </MainBody>
        <MainFooter>
          {item.files.map((f) => {
            return (
              <div className="img-card mr-2" key={f.id}>
                {f.file_versions.length > 0 ? (
                  <img src={f.file_versions[0].view_link} onClick={(e) => handleSelectImage(f.id, f.file_versions[0].id)} />
                ) : (
                  <span onClick={(e) => handleSelectImage(f.id, f.link_versions[0].id)}>
                    <i class="fa fa-link"></i>
                  </span>
                )}
              </div>
            );
          })}
        </MainFooter>
      </WIPDetailWrapper>
    </Wrapper>
  );
};

export default GalleryView;
