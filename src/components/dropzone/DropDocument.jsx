import React, {forwardRef, useCallback} from "react";
import Dropzone from "react-dropzone";
import {toastr} from "react-redux-toastr";
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";
import styled from "styled-components";
import "./DropDocument.css";

const Section = styled.section`
    display: ${props => props.hide ? "none" : "block"};
    @media only screen and (max-width: 991.99px){
       display: block;
    }
`;

//const dropzoneRef = createRef();

export const DropDocument = forwardRef((props, ref) => {

    const {attachedFiles, onCancel, onDrop, noX = false, disableInput = false, openOnLoad = false, placeholderText = `Drag 'n' drop your files here.`, hide} = props;

    const cbOnDrop = useCallback(({acceptedFiles, rejectedFiles}) => {

        let toastrOption = {
            timeOut: 8000,
            icon: "error",
        };

        for (let i = 0; i < rejectedFiles.length; i++) {
            let file = rejectedFiles[i];
            toastr.error(`File ${file.name} upload failed!`, "Tip: Zip it and try again.", toastrOption);
        }

        onDrop({acceptedFiles});

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attachedFiles]);

    // useEffect(() => {
    //     if (dropzoneRef.current && openOnLoad) {
    //         dropzoneRef.current.open()
    //     }
    // }, []);

    return <Dropzone
        ref={ref}
        onDrop={(acceptedFiles, rejectedFiles) => cbOnDrop({acceptedFiles, rejectedFiles})}
        onCancel={() => onCancel()}
        onDragLeave={() => onCancel()}
        onFileDialogCancel={onCancel}
        //noX={noX}
        // openDialog={
        //     openDialog ? dropzoneRef.current ? dropzoneRef.current.open() : null : null
        // }
        hide={hide}
        openOnload={openOnLoad}
        noClick={disableInput}
        accept={[
            "image/ai", "image/bmp", "image/eps", "image/gif", "image/gpl", "image/iff", "image/jpeg", "image/jpg",
            "image/pdn", "image/png", "image/psp", "image/svg",
            ".7z", ".aac", ".ai", ".aif", ".aifc", ".aifc", ".aiff", ".aiff", ".avi", ".bmp", ".bmp", ".cab",
            ".csv", ".doc", ".docx", ".dot", ".dotx", ".eps", ".epub", ".flac", ".flv", ".gif", ".ico", ".jpg", ".mj2",
            ".mjp2", ".mkv", ".mng", ".mov", ".mp3", ".mp4", ".mpeg", ".mpp", ".mpt", ".numbers", ".odm", ".odm", ".odoc", ".odp",
            ".ods", ".odt", ".oga", ".ogg", ".otp", ".ott", ".pages", ".pdf", ".pea", ".pez", ".png", ".pot", ".pps",
            ".ppt", ".pptx", ".pptz", ".ps", ".qt", ".rar", ".raw", ".rtf", ".spx", ".stc", ".svg", ".tar", ".tgz",
            ".tif", ".tiff", ".tsv", ".txt", ".vcf", ".wav", ".webm", ".webp", ".wma", ".wmv", ".xla", ".xlc", ".xls", ".xlsx",
            ".xlt", ".xlw", ".xml", ".zip",
        ]}>
        {
            ({getRootProps, getInputProps, isDragActive}) => {
                return <Section hide={hide}>
                    <div {...getRootProps()}
                         className={`reply-document-dropdown ${isDragActive ? "show-border" : "no-border"}`}>

                        <input {...getInputProps()} />
                        <p>{placeholderText}</p>
                    </div>
                    {
                        !noX &&
                        <a
                            href="#cancel-file-input"
                            className="click-cancel-drop"
                            onClick={e => {
                                onCancel();
                            }}
                        ><i className="fa fa-times-circle fa-lg"></i></a>
                    }

                </Section>;
            }
        }
    </Dropzone>;
});