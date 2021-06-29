import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../common";
import store from "../../redux/store/configStore";

const Wrapper = styled.div`
  cursor: pointer;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.125);
  background-color: rgba(255,255,225,0.1);
  border-radius: 6px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #F8F8F8;
  color: #696969 !important;
  a {
    text-decoration: none;
    color: #696969 !important;
    &.gdrive-link {
      display: flex;
    }
    
    span {
      &.link {
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: calc(100% - 140px);
        overflow: hidden;
        display: inline-block;
        margin-right: 0.1rem;
        padding: 0;
        line-height: 1.8;
        position: relative;
      } 
      &.preview-text { 
        font-weight: bold;       
        color: #696969 !important;
      }     
    }
  }
`;

const GoogleDriveLink = (props) => {

  const {className = "", link} = props;
  const googleDriveApiFiles = store.getState().files.googleDriveApiFiles;

  const googleDriveFileUrlPattern = /^(https:\/\/(drive|docs)\.google\.com\/)(file|spreadsheets|document|presentation|forms)\/d\/([^\/]+)\/.*$/;
  const fileId = link.match(googleDriveFileUrlPattern)[4];

  let file = googleDriveApiFiles[fileId];
  let retrieve = 0;
  if (file) {
    retrieve = 1;
  }

  return (
    <Wrapper className={`google-drive dropdown ${className}`}>
      <SvgIconFeather className="mr-2" icon="gdrive" viewBox="0 0 512 512" height="20" width="15" fill="#696969"
                      opacity=".8"/><a data-google-file-id={fileId} data-google-link-retrieve={retrieve}
                                       href={link} data-href-link={link} target="_blank" className="gdrive-link">
      {
        typeof file !== "undefined" ?
          <>{file.title}</>
          :
          <><span className="preview-text"/></>
      }
    </a>
    </Wrapper>
  );
};

export default GoogleDriveLink;
