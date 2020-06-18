import React from "react";
import styled from "styled-components";
import {FileAttachments, SvgIconFeather} from "../../common";

const Wrapper = styled.div`
    border-left: 5px solid #822492;
    text-align: left;
    
    .feather-edit {
        cursor: pointer;
        cursor: hand;
        
        &:hover {
            color: #972c86;
        }
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

const DashboardDescription = styled.div`
    img {
        max-width: 100%;
        max-height: 250px;
    }
`;

const DashboardAboutWorkspace = (props) => {

    const {className = "", onEditClick, workspace} = props;

    return (
        <Wrapper className={`dashboard-about-workspace card ${className}`}>
            <div className="card-body">
                <h5 className="card-title">About this workspace <SvgIconFeather icon="edit" onClick={onEditClick}/></h5>
                {
                    workspace && 
                    <DashboardDescription dangerouslySetInnerHTML={{__html: workspace.description}}/>
                }
                {
                    workspace && workspace.primary_files && workspace.primary_files.length > 0 &&
                    <>
                    <hr/>
                    <span>File attachments:</span>
                    <FileAttachments attachedFiles={workspace.primary_files} workspace={workspace} type="workspace"/>
                    </>
                }
            </div>
        </Wrapper>
    );
};

export default React.memo(DashboardAboutWorkspace);