import React from "react";
import FilePill from "../../list/chat/Files/FilePill";
import styled from "styled-components";

const Wrapper = styled.div`
    video {
        max-width: 100%;
        max-height: 250px;
    }
`;

const PostVideos = (props) => {
    const { files } = props;

    const videos = files.filter((f) => f.type.toLowerCase().includes("video"));

    const handlePreviewFile = (e, file) => {
        e.stopPropagation();
    };
    
    if (!videos.length) return null;

    return (
        <Wrapper className={"d-flex align-items-center"}>
            {
                videos.map((video) => {
                    return (
                        <FilePill cbFilePreview={handlePreviewFile} file={video} data-file-type={video.type} />
                    )
                })
            }
        </Wrapper>
    );
};

export default PostVideos;