import React from "react";
import styled from "styled-components";
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
    }        
`;

const FileOptions = props => {

    const {className = "", file, scrollRef, actions} = props;

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
        actions.moveFile(file);
    };

    const handleRename = () => {
        actions.renameFile(file);
    };

    const handleDelete = () => {
        actions.removeFile(file);
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
            <div onClick={handleDelete}>Delete</div>
        </Wrapper>
    );
};

export default React.memo(FileOptions);