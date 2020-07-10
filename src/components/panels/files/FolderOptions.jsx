import React from "react";
import styled from "styled-components";
import {useToaster} from "../../hooks";
import {MoreOptions} from "../../panels/common";

const Wrapper = styled(MoreOptions)`
    .more-options-tooltip {
        position: absolute;
        font-size: .835rem;
        width: 150px;
        
        &.orientation-top {
            top: calc(100% - 25px);
            bottom: auto;
        }
        &.orientation-bottom {
            top: calc(100% - 25px);
            bottom: auto;
        }
        &.orientation-left {
            right: calc(100% + 5px);
            left: auto;
        }
        &.orientation-right {
            left: calc(100% + 25px);
            right: auto;
        }
    }
`;

const FolderOptions = props => {

    const {className = "", folder, scrollRef = null, actions, isMember, history, params, handleAddEditFolder} = props;
    const toaster = useToaster();

    // const handleViewDetail = () => {
    // };

    const handleRename = () => {
        if (isMember) {
            handleAddEditFolder(folder, "edit");
        } else {
            toaster.warning("You are not a member of this workspace.");
        }
    };

    const handleDelete = () => {
        if (isMember) {
            let cb = (err, res) => {
                if (err) return;
    
                if (res) {
                    let pathname = history.location.pathname.split("/folder/")[0];
                    history.push(pathname);
                }
            };
            actions.removeFolder(folder, params.workspaceId, cb);
        } else {
            toaster.warning("You are not a member of this workspace.");
        }
    };

    return (
        <Wrapper
            className={`file-options ${className}`}
            moreButton="more-vertical"
            folder={folder} scrollRef={scrollRef}>
            {/* <div onClick={handleViewDetail}>View Details</div> */}
            <div onClick={handleRename}>Rename</div>
            <div onClick={handleDelete}>Remove</div>
        </Wrapper>
    );
};

export default React.memo(FolderOptions);