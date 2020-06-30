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

    const {className = "", folder, scrollRef = null, actions, isMember} = props;
    const toaster = useToaster();

    const handleViewDetail = () => {
    };

    const handleRename = () => {
        if (isMember) {
            actions.renameFile(folder);
        } else {
            toaster.warning(`You are not a member of this workspace.`,
                {position: "bottom-left"});
        }
    };

    const handleDelete = () => {
        if (isMember) {
            actions.removeFile(folder);
        } else {
            toaster.warning(`You are not a member of this workspace.`,
                {position: "bottom-left"});
        }
    };

    return (
        <Wrapper
            className={`file-options ${className}`}
            moreButton="more-vertical"
            folder={folder} scrollRef={scrollRef}>
            <div onClick={handleViewDetail}>View Details</div>
            <div onClick={handleRename}>Rename</div>
            <div onClick={handleDelete}>Remove</div>
        </Wrapper>
    );
};

export default React.memo(FolderOptions);