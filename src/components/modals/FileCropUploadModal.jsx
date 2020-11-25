import "cropperjs/dist/cropper.css";
import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { ModalHeaderSection } from "./index";

const Wrapper = styled(Modal)`
  &.modal-dialog {
    .modal-body {
      padding: 0;

      .cropper-view-box {
        border-radius: 50%;
      }
    }
  }
`;

const FileCropUploadModal = (props) => {
  const { type, imageFile, handleSubmit } = props.data;

  const dispatch = useDispatch();

  const [modal, setModal] = useState(true);

  const refs = {
    cropper: useRef(null),
  };

  const toggle = () => {
    setModal(!modal);

    dispatch(clearModal({ type: type }));
  };

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {
      type: mime,
      lastModified: Date.now(),
    });
  };

  const handleCropImage = () => {
    const imageSrc = refs.cropper.current.getCroppedCanvas().toDataURL("image/jpeg", 0.5);
    handleSubmit(dataURLtoFile(imageSrc, imageFile.name), imageSrc);
    toggle();
  };

  return (
      <Wrapper isOpen={modal} toggle={toggle} size={"lg"} centered>
        <ModalHeaderSection toggle={toggle}>Crop Image</ModalHeaderSection>
        <ModalBody style={{padding: 0}}>
          <Cropper style={{height: window.innerHeight - 300, width: "100%"}} aspectRatio={1} guides={false}
                   src={URL.createObjectURL(imageFile)} ref={refs.cropper}/>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleCropImage}>
            Save
          </Button>
          <Button color="secondary" onClick={toggle}>
            Discard
          </Button>
        </ModalFooter>
      </Wrapper>
  );
};

export default React.memo(FileCropUploadModal);
