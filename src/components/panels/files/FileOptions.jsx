import React, {useState} from "react";
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

    const {className = "", file, scrollRef} = props;

    const [showMoreOptions, setShowMoreOptions] = useState(false);

    const handleViewDetail = () => {

    };

    const handleFavorite = () => {

    };

    const handleShare = () => {

    };

    const handleDownload = () => {

    };

    const handleMoveTo = () => {

    };

    const handleRename = () => {

    };

    const handleDelete = () => {

    };

    return (
        <Wrapper
            className={`file-options ${className}`}
            moreButton="more-vertical"
            file={file} scrollRef={scrollRef}>
            <div onClick={handleViewDetail}>View Details</div>
            <div onClick={handleFavorite}>Un/Favorite</div>
            <div onClick={handleShare}>Share</div>
            <div onClick={handleDownload}>Download</div>
            <div onClick={handleMoveTo}>Move to</div>
            <div onClick={handleRename}>Rename</div>
            <div onClick={handleDelete}>Delete</div>
        </Wrapper>
    );
};

export default React.memo(FileOptions);