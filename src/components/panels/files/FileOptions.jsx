import React from "react";
import styled from "styled-components";
import toaster from "toasted-notes";
import {MoreOptions} from "../../panels/common";

const Wrapper = styled(MoreOptions)`
    .more-options-tooltip {
        position: absolute;
        font-size: .835rem;
        width: 150px;

        &.orientation-left {
            right: calc(100% - 10px);
        }
        &.orientation-bottom {
            top: 100%;
        }
        &.orientation-top {
            bottom: 20px;
        }
        &.orientation-right {
            right: calc(100% - 10px);
        }
    }
`;

const FileOptions = props => {

    const {className = "", file, scrollRef, actions, isMember} = props;

    //const [showMoreOptions, setShowMoreOptions] = useState(false);

    const handleViewDetail = () => {
        actions.viewFiles(file);
    };

    const handleFavorite = () => {
        actions.favorite(file);
    };

    const handleShare = () => {
        actions.copyLink(file.view_link);
    };

    const handleDownload = () => {
        actions.download(file);
    };

    const handleMoveTo = () => {
        if (isMember) {
            actions.moveFile(file);
        } else {
            toaster.notify(`You are not a member of this workspace.`,
                {position: "bottom-left"});
        }
    };

    const handleRename = () => {
        if (isMember) {
            actions.renameFile(file);
        } else {
            toaster.notify(`You are not a member of this workspace.`,
                {position: "bottom-left"});
        }
    };

    const handleDelete = () => {
        if (isMember) {
            actions.removeFile(file);
        } else {
            toaster.notify(`You are not a member of this workspace.`,
                {position: "bottom-left"});
        }
    };

    return (
        <Wrapper
            className={`file-options ${className}`}
            moreButton="more-vertical"
            file={file} scrollRef={scrollRef}>
            <div onClick={handleViewDetail}>View Details</div>
            <div onClick={handleFavorite}>{file.is_favorite ? "Unfavorite" : "Favorite"}</div>
            <div onClick={handleShare}>Share</div>
            <div onClick={handleDownload}>Download</div>
            <div onClick={handleMoveTo}>Move to</div>
            <div onClick={handleRename}>Rename</div>
            <div onClick={handleDelete}>Remove</div>
        </Wrapper>
    );
};

export default React.memo(FileOptions);