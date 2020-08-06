import React, {useRef} from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../common";

const Wrapper = styled.div`
  cursor: pointer;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.125);
  background-color: rgba(255,255,225,0.1);
  border-radius: 6px;
  display: inline-block;
`;

const GoogleDriveLink = (props) => {

  const {className = "", link} = props;
  const ref = useRef(null);
  //const dispatch = useDispatch();

  const googleDriveFileUrlPattern = /^(https:\/\/drive\.google\.com\/)file\/d\/([^\/]+)\/.*$/;
  const fileId = link.match(googleDriveFileUrlPattern)[2];

  return (
    <Wrapper className={`google-drive dropdown ${className}`}>
      <SvgIconFeather className="mr-2" icon="gdrive" viewBox="0 0 512 512" height="20" width="15" fill="#fff"
                      opacity=".8"/><a data-google-file-id={fileId} data-google-link-retrieve={0}
                                       href={link} target="_blank">{link}</a>
    </Wrapper>
  );
};

export default GoogleDriveLink;
