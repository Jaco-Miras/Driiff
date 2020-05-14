import React, {forwardRef, useState} from "react";
import styled from "styled-components";
import arrowDown from "../../../../assets/icon/arrow/down/r/arrow_down_r_secundary.svg";
import arrowRight from "../../../../assets/icon/arrow/right/white-arrow-right.svg";
import FilePill from "./FilePill";

const MessageFilesContainer = styled.div`
    position: relative;
    z-index: 1;
    border-radius: 10px;
    //background: ${props => props.filesLength === 1 && props.type === "chat" ? "#dedede" : "transparent"};
`;
const FilesLink = styled.div`
    margin-bottom: 0.5rem;    
`;
const FilesContainer = styled.div`
    display: flex;
    flex-flow: column;
`;

const FileShowDiv = styled.a`
    display:flex;
    align-items: center;
    :after {
        content: "";
        mask-image: ${props =>
    props.show ? `url(${arrowDown})` : `url(${arrowRight})`};
        background-color: #676767;
        mask-repeat: no-repeat;
        mask-size: 60%;
        mask-position: center;
        width: 20px;
        height: 20px;
        display: inline-block;
    }
`;

const MessageFiles = forwardRef((props, ref) => {
    const {files, chatFiles, type = "chat", ...otherProps} = props;
    const [showFiles, setShowFiles] = useState(true);
    const handleToggleShowFile = () => {
        setShowFiles(!showFiles);
    };
    //console.log(files)
    const handlePreviewFile = (e, file) => {
        e.stopPropagation();
        const isFile = (element) => {
            return element.id === file.id;
        };

        if (props.addFilesToViewAction) {
            if (chatFiles) {
                props.addFilesToViewAction({files: chatFiles, fileIndex: chatFiles.findIndex(isFile)});
            } else {
                props.addFilesToViewAction({files: files, fileIndex: files.findIndex(isFile)});
            }
        }
    };

    return <MessageFilesContainer {...otherProps} filesLength={files.length} type={type}>
        {
            files.length ?
                type === "chat" && files.length === 1 ? null
                    :
                    <FileShowDiv onClick={handleToggleShowFile} show={showFiles}>
                        {files.length > 1 ? `${files.length} files` : `1 file`}
                    </FileShowDiv>
                : null
        }
        <FilesContainer>
            {
                showFiles &&
                files.map((file, key) => {
                    if (files.length === 1 && type === "chat") {
                        return <FilePill
                            key={key}
                            cbFilePreview={handlePreviewFile}
                            file={file}
                        />;
                    } else {
                        return <FilesLink key={file.id}>
                            <FilePill
                                cbFilePreview={handlePreviewFile}
                                file={file}
                            />
                        </FilesLink>;
                    }

                })
            }
        </FilesContainer>
    </MessageFilesContainer>;
});

export default React.memo(MessageFiles);