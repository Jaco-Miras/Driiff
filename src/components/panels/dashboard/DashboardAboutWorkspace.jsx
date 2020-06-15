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

    const {className = "", onEditClick, workspace} = props;

    return (
        <Wrapper className={`dashboard-about-workspace card ${className}`}>
            <div className="card-body">
                <h5 className="card-title">About this workspace <SvgIconFeather icon="edit" onClick={onEditClick}/></h5>
                {
                    workspace && 
                    <div dangerouslySetInnerHTML={{__html: workspace.description}}/>
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