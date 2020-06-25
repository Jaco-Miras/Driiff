import "cropperjs/dist/cropper.css";
import React, {useState} from "react";
import Cropper from "react-cropper";
import {useDispatch} from "react-redux";
import {Modal} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import {ModalHeaderSection} from "./index";

const CropperFooter = styled.div`
    padding: 10px;
    background: #f4f4f4;
    text-align: center;
    width: 100%;
    cursor: pointer;
`;

const FileCropUploadModal = props => {

    const {type, imageFile, handleSubmit} = props.data;

    const dispatch = useDispatch();

    const [modal, setModal] = useState(true);

    const refs = {
        cropper: useState(null),
    };

    const toggle = () => {
        setModal(!modal);

        dispatch(
            clearModal({type: type}),
        );
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
        <Modal isOpen={modal} toggle={toggle} centered>
            <ModalHeaderSection toggle={toggle}>Crop Image</ModalHeaderSection>
            <Cropper
                style={{height: 320, width: "100%"}}
                aspectRatio={1}
                guides={false}
                src={URL.createObjectURL(imageFile)}
                ref={refs.cropper}
            />
            <CropperFooter onClick={handleCropImage}>
                Save
            </CropperFooter>
        </Modal>
    );
};

export default React.memo(FileCropUploadModal);