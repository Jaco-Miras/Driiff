import React from "react";
import GrippBotCard from "./GrippBotCard";
import { useTranslationActions } from "../../hooks";

const GrippBots = (props) => {
  const { bots } = props;
  const { _t } = useTranslationActions();
  const dictionary = {
    adminBotLabel: _t("ADMIN.AUTOMATION_LABEL_ADMIN_BOT", "Admin bot"),
    deleteBotBody: _t("MODAL.DELETE_BOT_CONFIRMATION", "Are you sure you want to delete this bot?"),
    buttonCancel: _t("BUTTON.CANCEL", "Cancel"),
    buttonRemove: _t("BUTTON.REMOVE", "Remove"),
    uploadSuccess: _t("TOAST.UPLOAD_ICON_SUCCESS", "Uploaded icon success!"),
    channelsConnected: _t("LABEL.CHANNELS_CONNECTED", "Channels connected"),
    fileTypeError: _t("TOAST.FILE_TYPE_ERROR", "File type not allowed. Please use an image file."),
    multipleFileError: _t("TOAST.MULTIPLE_FILE_ERROR", "Multiple files detected. First selected image will be used."),
    createBot: _t("ADMIN.CREATE_BOT_BTN", "Create new bot"),
  };
  return (
    <div className="row">
      {bots.length > 0 &&
        bots.map((bot) => {
          return <GrippBotCard key={bot.id} bot={bot} dictionary={dictionary} />;
        })}
    </div>
  );
};

export default GrippBots;
