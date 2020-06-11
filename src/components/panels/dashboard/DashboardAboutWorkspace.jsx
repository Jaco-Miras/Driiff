import React from "react";
import styled from "styled-components";
import {FileAttachments, SvgIconFeather} from "../../common";

const Wrapper = styled.div`
    border-left: 5px solid #822492;
    
    .feather-edit {
        cursor: pointer;
        cursor: hand;
    }
    
    .card-title {
        position: relative;
        
        .feather-edit {
            right: 0;
            width: 16px;
            position: absolute;
        }
    }
    
    .file-attachments {
        .files {
            width:100%;
        }
    }
`;

const DashboardAboutWorkspace = (props) => {

    const {className = ""} = props;

    const attachedFiles = [
        {
            "rawFile": {},
            "type": "IMAGE",
            "id": "ggWzh1hws",
            "status": false,
            "src": "https://miro.medium.com/max/3000/1*MI686k5sDQrISBM6L8pf5A.jpeg",
            "name": "empty-sea-beach-background_74190-313.jpg"
        },
        {
            "rawFile": {},
            "type": "IMAGE",
            "id": "68ylv-PNrN",
            "status": false,
            "src": "https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg",
            "name": "2020-04-06_1843.png"
        },
        {
            "rawFile": {},
            "type": "IMAGE",
            "id": "9fj7PXIfN2",
            "status": false,
            "src": "https://mht.wtf/post/content-aware-resize/sample-image.jpeg",
            "name": "petition.png"
        }
    ];

    return (
        <Wrapper className={`dashboard-about-workspace card ${className}`}>
            <div className="card-body">
                <h5 className="card-title">About this workspace <SvgIconFeather icon="edit"/></h5>
                <p>In the section called “About this workspace”, the description is shown that is made during the
                    workspace creation process. This can also be edited, by anyone.</p>

                <p>This description can contain:</p>
                <ul>
                    <li>Text</li>
                    <li>Rich text</li>
                    <li>Bullet list</li>
                </ul>

                <p>Files (as an attachment)</p>
                <ul>
                    <li>Video</li>
                    <li>Images</li>
                    <li>Files</li>
                    <li>Behavior editing</li>
                </ul>
                <ul>
                    <li>The user selects the pencil icon</li>
                    <li>The system opens the ‘edit workspace’ option - with the cogwheel icon being active</li>
                    <li>The user can amend its changes</li>
                </ul>

                <hr/>
                File Attachments:
                <FileAttachments attachedFiles={attachedFiles}/>
            </div>
        </Wrapper>
    );
};

export default React.memo(DashboardAboutWorkspace);