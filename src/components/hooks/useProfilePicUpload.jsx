import React, { useRef, useEffect } from "react";
import useSettings from "./useSettings";
import useToaster from "./useToaster";
import { useDispatch, useSelector } from "react-redux";
import { addToModals } from "../../redux/actions/globalActions";
import useUserActions from "./useUserActions";
import useTimeFormat from "./useTimeFormat";
import useTodoActions from "./useTodoActions";
import moment from "moment";
import { DropDocument } from "../dropzone/DropDocument";

const useProfilePicUpload = () => {
  const refs = {
    dropZoneRef: useRef(null),
  };

  const { setGeneralSetting } = useSettings();
  const { updateProfileImage } = useUserActions();
  const { localizeDate } = useTimeFormat();
  const { create: createTodo } = useTodoActions();
  const user = useSelector((state) => state.session.user);

  const toaster = useToaster();
  const dispatch = useDispatch();

  const uploadModal = (cb) => {
    let payload = {
      type: "upload-profile-pic",
      headerText: "Upload profile picture?",
      submitText: "Yes",
      cancelText: "Cancel",
      bodyText: "You don't have profile picture just yet, upload one right now?",
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
      toaster.error("File type not allowed. Please use an image file.");
    } else if (uploadedFiles.length > 1) {
      toaster.warning("Multiple files detected. First selected image will be used.");
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
        toaster.error("Unable to update profile picture.");
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
        title: "Upload Profile Picture",
        set_time: remind_time,
      },
      () => {
        toaster.success(`Upload Profile Picture Reminder set to ${remind_time}`);
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
