import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { Avatar, SvgIconFeather } from "../../common";
import { addToModals } from "../../../redux/actions/globalActions";
import { useAdminActions, useToaster } from "../../hooks";
import { DropDocument } from "../../dropzone/DropDocument";

const BotAvatarTitle = styled.div`
  display: flex;
  align-items: center;
`;

const BotTitleChannels = styled.div`
  display: flex;
  flex-flow: column;
  h5 {
    margin: 0;
  }
`;

const GrippBotCard = (props) => {
  const { bot, dictionary } = props;

  const iconDropZone = useRef(null);
  const dispatch = useDispatch();
  const toaster = useToaster();

  const [showIconDropzone, setShowIconDropzone] = useState(false);
  const { uploadUserBotIcon } = useAdminActions();

  const handleUploadIcon = (file, fileUrl) => {
    // uploadUserBotIcon({ id: bot.id, imageFile: file }, (err, res) => {
    //   if (err) return;
    //   toaster.success("Uploaded icon success!");
    // });
  };

  const dropIconAction = (uploadedFiles) => {
    if (uploadedFiles.length === 0) {
      toaster.error("File type not allowed. Please use an image file.");
    } else if (uploadedFiles.length > 1) {
      toaster.warning("Multiple files detected. First selected image will be used.");
    }

    let modal = {
      type: "file_crop_upload",
      imageFile: uploadedFiles[0],
      mode: "profile",
      handleSubmit: handleUploadIcon,
    };

    dispatch(
      addToModals(modal, () => {
        handleHideIconDropzone();
      })
    );
  };

  const handleOpenDropzone = () => {
    if (iconDropZone.current) iconDropZone.current.open();
  };

  const handleHideIconDropzone = () => {
    setShowIconDropzone(false);
  };

  const handleUpdateBot = () => {
    let modal = {
      type: "update_bot",
      item: bot,
      mode: "gripp",
    };

    dispatch(addToModals(modal));
  };

  return (
    <div className="col-12 col-md-6" key={bot.id}>
      <div className="card border">
        <div className="card-body admin-bot-card">
          <DropDocument
            acceptType="imageOnly"
            hide={!showIconDropzone}
            ref={iconDropZone}
            onDragLeave={handleHideIconDropzone}
            onDrop={({ acceptedFiles }) => {
              dropIconAction(acceptedFiles);
            }}
            onCancel={handleHideIconDropzone}
          />
          <BotAvatarTitle className="mb-2">
            <div className="mr-1">
              <Avatar isBot={true} imageLink={bot.image_path} name={bot.name} noDefaultClick={true} showSlider={false} forceThumbnail={false} />
            </div>
            <BotTitleChannels>
              <h5>{bot.name}</h5>
              <span>{bot.channel_connected.length} Channels connected</span>
            </BotTitleChannels>
          </BotAvatarTitle>
          <div>
            {/* <button className="btn btn-danger mr-2" onClick={handleDeleteBot}>
              <SvgIconFeather icon="x" />
            </button> */}
            <button className="btn btn-primary mr-2" onClick={handleUpdateBot}>
              <SvgIconFeather icon="edit" />
            </button>
            <button className="btn btn-info mr-2" onClick={handleOpenDropzone}>
              <SvgIconFeather icon="upload" />
            </button>
            {/* <button className="btn btn-light mr-2" onClick={handleCopyLink}>
              <SvgIconFeather icon="link" />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default GrippBotCard;
