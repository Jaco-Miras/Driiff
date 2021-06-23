import React, { forwardRef } from "react";
import Dropzone from "react-dropzone";
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";
import styled from "styled-components";
import { SvgIconFeather } from "../common";
import { useToaster, useTranslationActions } from "../hooks";
import "./DropDocument.scss";

const Section = styled.section`
  visibility: ${(props) => (props.hide ? "hidden" : "visible")};
  .reply-document-dropdown {
    opacity: ${(props) => (props.hide ? "0" : "1")};
    transition: opacity 200ms ease;
    background: rgba(255, 255, 255, 0.9);

    .dark & {
      background: rgba(25, 28, 32, 0.9);
    }
  }
  .click-cancel-drop {
    .dark & {
      background: #fff;
      color: #7a1b8b;
    }
  }
`;

const Icon = styled(SvgIconFeather)``;

export const DropDocument = forwardRef((props, ref) => {
  const { onCancel, onDrop, noX = false, disableInput = false, openOnLoad = false, hide, acceptType = "" } = props;

  const toastr = useToaster();
  const { _t } = useTranslationActions();

  let placeholderText = props.placeholderText;
  if (!placeholderText) {
    placeholderText = _t("UPLOAD.DRAG_N_DROP_YOUR_FILES", "Drag 'n' drop your files here.");
  }

  const cbOnDrop = ({ acceptedFiles, rejectedFiles }) => {
    let toastrOption = {
      timeOut: 8000,
      icon: "error",
    };

    for (let i = 0; i < acceptedFiles.length; i++) {
      let file = acceptedFiles[i];
      if (file.size === 0) {
        toastr.error(
          <span>
            File <b>{file.name}</b> upload failed!
            <br />
            Empty file detected.
          </span>,
          toastrOption
        );
        delete acceptedFiles[i];
      }
    }

    for (let i = 0; i < rejectedFiles.length; i++) {
      let file = rejectedFiles[i];
      toastr.error(
        <span>
          File <b>{file.name}</b> upload failed!
          <br />
          <b>Tip:</b> Zip it and try again.
        </span>,
        toastrOption
      );
    }

    onDrop({ acceptedFiles });
  };

  let accept = [
    "image/ai",
    "image/bmp",
    "image/eps",
    "image/gif",
    "image/gpl",
    "image/iff",
    "image/jpeg",
    "image/jpg",
    "image/pdn",
    "image/png",
    "image/psp",
    "image/svg",
    ".7z",
    ".aac",
    ".ai",
    ".aif",
    ".aifc",
    ".aifc",
    ".aiff",
    ".aiff",
    ".avi",
    ".bmp",
    ".bmp",
    ".cab",
    ".csv",
    ".doc",
    ".docx",
    ".dot",
    ".dotx",
    ".eps",
    ".epub",
    ".flac",
    ".flv",
    ".gif",
    ".ico",
    ".jpg",
    ".mj2",
    ".mjp2",
    ".mkv",
    ".mng",
    ".mov",
    ".mp3",
    ".mp4",
    ".mpeg",
    ".mpp",
    ".mpt",
    ".numbers",
    ".odm",
    ".odm",
    ".odoc",
    ".odp",
    ".ods",
    ".odt",
    ".oga",
    ".ogg",
    ".otp",
    ".ott",
    ".pages",
    ".pdf",
    ".pea",
    ".pez",
    ".png",
    ".pot",
    ".pps",
    ".ppt",
    ".pptx",
    ".pptz",
    ".ps",
    ".qt",
    ".rar",
    ".raw",
    ".rtf",
    ".spx",
    ".stc",
    ".svg",
    ".tar",
    ".tgz",
    ".tif",
    ".tiff",
    ".tsv",
    ".txt",
    ".vcf",
    ".wav",
    ".webm",
    ".webp",
    ".wma",
    ".wmv",
    ".xla",
    ".xlc",
    ".xls",
    ".xlsx",
    ".xlt",
    ".xlw",
    ".xml",
    ".zip",
  ];

  if (acceptType === "imageOnly") {
    accept = ["image/ai", "image/bmp", "image/eps", "image/gif", "image/gpl", "image/iff", "image/jpeg", "image/jpg", "image/pdn", "image/png", "image/psp", "image/svg"];
  }

  return (
    <Dropzone
      ref={ref}
      onDrop={(acceptedFiles, rejectedFiles) => cbOnDrop({ acceptedFiles, rejectedFiles })}
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
      accept={accept}
    >
      {({ getRootProps, getInputProps, isDragActive }) => {
        return (
          <Section hide={hide}>
            <div {...getRootProps()} className={`reply-document-dropdown ${isDragActive ? "show-border" : "no-border"}`}>
              <input {...getInputProps()} />

              <div className="reply-dropzone">
                <Icon icon="upload-cloud" />
                <p>{placeholderText}</p>
              </div>
            </div>
            {!noX && (
              <button aria-label="close" className="click-cancel-drop" onClick={onCancel}>
                <span aria-hidden="true">
                  <Icon icon="x" />
                </span>
              </button>
            )}
          </Section>
        );
      }}
    </Dropzone>
  );
});
