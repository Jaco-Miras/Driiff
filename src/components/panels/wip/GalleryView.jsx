import React, { useState } from "react";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { SvgIconFeather } from "../../common";
import { MoreOptions } from "../common";
import { useWIPActions } from "../../hooks";
import FileLinkView from "./FileLinkView";
import moment from "moment";
import Select from "react-select";
import { darkTheme, lightTheme } from "../../../helpers/selectTheme";
import Annotation from "react-image-annotation-with-zoom";
import { PointSelector } from "react-image-annotation-with-zoom/lib/selectors";

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
  .react-select-container {
    min-width: 130px;
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
    top: 45px;
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
  height: calc(100% - 180px);
  padding: 15px;
`;

const ImageWrapper = styled.div`
  display: flex;
  //height: 100%;
  overflow: auto;
  // img {
  //   width: 100%;
  //   height: auto;
  //   object-fit: contain;
  // }
`;

const MainFooter = styled.div`
  min-height: 130px;
  border-top: 1px solid #ebebeb;
  display: inline-flex;
  padding: 10px 20px;
  overflow: auto;
  align-items: flex-end;
  .img-card {
    cursor: pointer;
    max-height: 100px;
    max-width: 100px;
    min-height: 100px;
    min-width: 100px;
    border-radius: 6px;
    // border: 1px solid #ebebeb;
    // overflow: hidden;
    text-align: center;
    font-size: 2rem;
    justify-content: center;
    align-items: center;
    display: flex;
    img {
      width: 100px;
      height: 100px;
      border-radius: 6px;
    }
  }
`;

const ImgCard = styled.div`
  outline: ${(props) => (props.selected ? `3px solid ${props.theme.colors.primary}` : "none")};
  opacity: ${(props) => (props.selected ? "1" : ".5")};
  position: relative;
  :hover {
    opacity: 1;
  }
  ${(props) =>
    props.selected &&
    `:before {
        content: "";
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent ${props.theme.colors.primary} transparent;
        border-image: initial;
        position: absolute;
        top: -22px;
        left: 40px;
        z-index: 1;
      }`}
`;

const DownloadButton = styled.div`
  height: 36px;
  border-radius: 6px;
  border: 1px solid;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  cursor: pointer;
`;

const Container = styled.div`
  //border: solid 3px white;
  border-radius: 50%;
  box-sizing: border-box;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(0, 0, 0, 0.2), 0 5px 4px rgba(0, 0, 0, 0.4);
  height: 2rem;
  position: absolute;
  transform: translate3d(-50%, -50%, 0);
  width: 2rem;
  background: purple;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.2rem;
`;

const Point = ({ children, geometry, style }) => {
  if (!geometry) return null;

  return (
    <Container
      style={{
        top: `${geometry.y}%`,
        left: `${geometry.x}%`,
      }}
    >
      {children}
    </Container>
  );
};

function renderSelector({ annotation, active }) {
  const { geometry, selection } = annotation;
  if (!geometry) return null;

  return <Point geometry={geometry}>{selection.data.id}</Point>;
}

function renderHighlight({ annotation, active }) {
  const { geometry, data } = annotation;
  if (!geometry) return null;

  return (
    <Point geometry={geometry} key={data.id}>
      {data.id}
    </Point>
  );
}

const GalleryView = (props) => {
  const { item } = props;
  const params = useParams();
  const history = useHistory();
  const wipActions = useWIPActions();
  const user = useSelector((state) => state.session.user);
  const dark_mode = useSelector((state) => state.settings.user.GENERAL_SETTINGS.dark_mode);
  const annotation = useSelector((state) => state.wip.annotation);
  // const [annotation, setAnnotation] = useState({});
  const [annotations, setAnnotations] = useState([]);
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

  const handleSelectImage = (fid, fvid) => {
    history.push(history.location.pathname.split("/file/")[0] + `/file/${fid}/${fvid}`);
  };

  const versionOptions = mainFile.file_versions.map((f) => {
    return {
      ...f,
      value: f.id,
      label: f.version_name,
    };
  });

  const handleVersionChange = (e) => {};

  const annotationChange = (ann) => {
    // console.log(ann, "ann");
    //setAnnotation({ ...ann, selection: { ...ann.selection, showEditor: false } });
    wipActions.annotate({ ...ann, selection: { ...ann.selection, showEditor: false, data: { id: file.annotations.length + 1 } } });
  };

  const annotationSubmit = (annotation) => {
    const { geometry, data } = annotation;
    console.log(data, geometry);
    //setAnnotation({});
    wipActions.annotate({});
    setAnnotations(
      annotations.concat({
        geometry,
        data: {
          ...data,
          id: file.annotations.length + 1,
        },
      })
    );
  };

  console.log(file);

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
            <Select
              className={"react-select-container"}
              classNamePrefix="react-select"
              styles={dark_mode === "0" ? lightTheme : darkTheme}
              value={versionOptions.find((o) => o.value === file.id)}
              onChange={handleVersionChange}
              options={versionOptions}
            />
            <DownloadButton>
              <SvgIconFeather icon="download" />
            </DownloadButton>
            {item.author.id !== user.id && (
              <div>
                <StyledMoreOptions className="ml-2" width={170} moreButton={"more-horizontal"}>
                  <div>Replace current image</div>
                  <div>Upload new version</div>
                </StyledMoreOptions>
              </div>
            )}
          </div>
        </MainHeader>
        <MainBody>
          <ImageWrapper className="w-100" isFileLink={file.media_link_title !== null}>
            {file.media_link_title && <FileLinkView file={file} />}
            {/* {file.type && file.type === "image" && <img src={file.view_link} />} */}
            <Annotation
              src={file.view_link}
              alt="Two pebbles anthropomorphized holding hands"
              annotations={file.annotations}
              type={PointSelector.TYPE}
              value={annotation}
              onChange={annotationChange}
              onSubmit={annotationSubmit}
              renderSelector={renderSelector}
              renderHighlight={renderHighlight}
            />
          </ImageWrapper>
        </MainBody>
        <MainFooter>
          {item.files.map((f) => {
            return (
              <ImgCard className="img-card mr-2" key={f.id} selected={f.id === parseInt(params.wipFileId)}>
                {f.file_versions.length > 0 ? (
                  <img src={f.file_versions[0].view_link} onClick={(e) => handleSelectImage(f.id, f.file_versions[0].id)} />
                ) : (
                  <span onClick={(e) => handleSelectImage(f.id, f.link_versions[0].id)}>
                    <i class="fa fa-link"></i>
                  </span>
                )}
              </ImgCard>
            );
          })}
        </MainFooter>
      </WIPDetailWrapper>
    </Wrapper>
  );
};

export default GalleryView;
