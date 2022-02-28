import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { useWIPActions } from "../../hooks";

const WIPDetailWrapper = styled.div`
  min-height: 240px;
  .card-body {
    padding: 1rem 1.5rem;
  }
`;

const MainHeader = styled.div`
  .feather-eye-off {
    position: relative;
    top: -1px;
    margin-right: 0.25rem;
    width: 12px;
  }
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

const MainBody = styled.div`
  display: flex;
  flex-grow: 1;
  width: 100%;
  flex-flow: column;
`;

const GalleryViewPlaceholder = (props) => {
  const wipActions = useWIPActions();
  const handleGoBack = () => {
    wipActions.goBack();
  };

  return (
    <div className="card card-body app-content-body">
      <WIPDetailWrapper className="fadeBottom">
        <MainHeader className="card-header d-flex justify-content-between">
          <div className="d-flex flex-column align-items-start">
            <div className="d-flex align-items-center">
              <div>
                <Icon className="close mr-2" icon="arrow-left" width="24" height="24" onClick={handleGoBack} />
              </div>
            </div>
          </div>
          <div></div>
        </MainHeader>
        <MainBody></MainBody>
      </WIPDetailWrapper>
    </div>
  );
};

export default GalleryViewPlaceholder;
