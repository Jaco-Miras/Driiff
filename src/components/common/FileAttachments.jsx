import React from "react";
import styled from "styled-components";
import {SvgIconFeather} from "./index";

const Attachments = styled.div`
`;

const AttachmentIcon = styled(SvgIconFeather)`
    width: 1rem;
    height: 1rem;
    margin-right: 5px;
`

const FileAttachments = props => {

    const {attachedFiles} = props;
    
    return (
        <Attachments>
            <ul>
                {
                    attachedFiles.map((f,i) => {
                        return <li key={i}><AttachmentIcon icon="paperclip"/>{f.name}</li>
                    })
                }
            </ul>
        </Attachments>
    )
};

export default FileAttachments;