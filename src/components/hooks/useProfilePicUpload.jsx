import React, { useRef } from "react";
import useSettings from "./useSettings";
import useToaster from "./useToaster";
import { useDispatch, useSelector } from "react-redux";
import { addToModals } from "../../redux/actions/globalActions";
import useUserActions from "./useUserActions";
import useTimeFormat from "./useTimeFormat";
import useTodoActions from "./useTodoActions";
import moment from "moment";
import { DropDocument } from "../dropzone/DropDocument";
import useTranslationActions from "./useTranslationActions";

const useProfilePicUpload = () => {
  const refs = {
    dropZoneRef: useRef(null),
  };

  const { setGeneralSetting } = useSettings();
  const { updateProfileImage } = useUserActions();
  const { localizeDate, todoFormat } = useTimeFormat();
  const { _t } = useTranslationActions();
  const { create: createTodo } = useTodoActions();
  const user = useSelector((state) => state.session.user);

  const toaster = useToaster();
  const dispatch = useDispatch();

  const dictionary = {
    uploadModalHeaderText: _t("UPLOAD_MODAL.HEADER", "Upload profile picture?"),
    uploadModalSubmitText: _t("UPLOAD_MODAL.SUBMIT", "Yes"),
    uploadModalCancelText: _t("UPLOAD_MODAL.CANCEL", "Cancel"),
    uploadModalBodyText: _t("UPLOAD_MODAL.BODY", "You don't have profile picture just yet, upload one right now?"),
    uploadModalErrorFileType: _t("UPLOAD_MODAL.FILE_NOT_ALLOWED", "File type not allowed. Please use an image file."),
    multipleFileDetected: _t("UPLOAD_MODAL.MULTI_FILE_DETECTED", "Multiple files detected. First selected image will be used."),
    unableToUpdate: _t("UPLOAD_MODAL.UNABLE_TO_UPDATE", "Unable to update profile picture."),
    uploadProfileTitle: _t("UPLOAD_MODAL.UPLOAD_PROFILE_TITLE", "Upload Profile Picture"),
    reminderSetTo: _t("UPLOAD_MODAL.REMINDER_SET_TO", "Upload Profile Picture Reminder set to"),
  };

  const uploadModal = (cb) => {
    let payload = {
      type: "upload-profile-pic",
      headerText: dictionary.uploadModalHeaderText,
      submitText: dictionary.uploadModalSubmitText,
      cancelText: dictionary.uploadModalCancelText,
      bodyText: dictionary.uploadModalBodyText,
      actions: {
        onSubmit: uploadProfilePicHandler,
        onCancel: cancelUploadProfilePic,
      },
    };
    dispatch(addToModals(payload));
    if (cb) {
      cb();
    }
  };

  const dropAction = (uploadedFiles) => {
    if (uploadedFiles.length === 0) {
      toaster.error(dictionary.uploadModalErrorFileType);
    } else if (uploadedFiles.length > 1) {
      toaster.warning(dictionary.multipleFileDetected);
    }

    let modal = {
      type: "file_crop_upload",
      imageFile: uploadedFiles[0],
      mode: "profile",
      handleSubmit: handleUseProfilePic,
    };

    dispatch(addToModals(modal));
  };

  const handleUseProfilePic = (file) => {
    updateProfileImage(user, file, (err, res) => {
      if (err) {
        toaster.error(dictionary.unableToUpdate);
      }
      setGeneralSetting({ first_login: false });
    });
  };

  const uploadProfilePicHandler = () => {
    refs.dropZoneRef.current.open();
  };
  const cancelUploadProfilePic = () => {
    setGeneralSetting({ userCanceledProfileUpload: true });
    const remind_time = localizeDate(moment().add(3, "d"), "YYYY-MM-DD HH:mm:ss");

    createTodo(
      {
        title: dictionary.uploadProfileTitle,
        set_time: remind_time,
      },
      (err, result) => {
        const reminder = todoFormat(result.data.remind_at.timestamp);
        toaster.success(`${dictionary.reminderSetTo} ${reminder}`);
      }
    );
  };

  const renderDropDocument = () => {
    return (
      <DropDocument
        acceptType="imageOnly"
        hide
        ref={refs.dropZoneRef}
        onDrop={({ acceptedFiles }) => {
          dropAction(acceptedFiles);
        }}
      />
    );
  };

  return {
    renderDropDocument,
    uploadModal,
  };
};

export default useProfilePicUpload;

// loom vidoe remove this https://www.loom.com/share/2e6fdfc2c22b4a89a48d4ff961593a05
