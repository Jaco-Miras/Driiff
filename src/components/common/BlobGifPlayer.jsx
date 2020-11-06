import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GifPlayer from "react-gif-player";
import "react-gif-player/src/GifPlayer.scss";
import { useFiles } from "../hooks";

const BlobGifPlayerWrapper = styled(GifPlayer)`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25em solid #7a1b8b;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  opacity: 0.8;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const BlobGifPlayer = (props) => {
  const { className = "", autoPlay = true, id, src, ...otherProps } = props;

  const { gifBlobs, actions: { setGifSrc } } = useFiles();
  const [blobSrc, setBlobSrc] = useState(gifBlobs[id]);

  useEffect(() => {
    if (!blobSrc) {
      fetch(src)
        .then(function (response) {
          return response.blob();
        })
        .then(function (data) {
          const imgObj = URL.createObjectURL(data);
          setBlobSrc(imgObj);
          setGifSrc({
            id: id,
            src: imgObj
          });
        }, function (err) {
          console.log(err, 'error');
        });
    }
  }, []);

  return <GifPlayer className={"blob-gif-player gif-player"} gif={blobSrc} autoplay={autoPlay} {...otherProps} />;
};

export default React.memo(BlobGifPlayer);
