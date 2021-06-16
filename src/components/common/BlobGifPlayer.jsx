import React, { useEffect, useState } from "react";
//import styled from "styled-components";
import GifPlayer from "react-gif-player";
import "react-gif-player/src/GifPlayer.scss";
import { useFiles } from "../hooks";
import { FindGifRegex } from "../../helpers/stringFormatter";

// const BlobGifPlayerWrapper = styled(GifPlayer)`
//   display: inline-block;
//   width: 2rem;
//   height: 2rem;
//   vertical-align: text-bottom;
//   border: 0.25em solid #7a1b8b;
//   border-right-color: transparent;
//   border-radius: 50%;
//   animation: spin 0.75s linear infinite;
//   opacity: 0.8;
//   @keyframes spin {
//     0% {
//       transform: rotate(0deg);
//     }
//     100% {
//       transform: rotate(360deg);
//     }
//   }
// `;

const BlobGifPlayer = (props) => {
  const { body, autoPlay = true, ...otherProps } = props;

  const {
    gifBlobs,
    actions: { setGifSrc },
  } = useFiles();
  const [gifs, setGifs] = useState({});

  const fetchBlob = (gif) => {
    if (gifBlobs[gif.id]) {
      gif = {
        ...gif,
        blob: gifBlobs[gif.id],
      };
      setGifs((prevState) => ({
        ...prevState,
        [gif.id]: gif,
      }));
    } else {
      setGifSrc({
        id: gif.id,
        src: "",
      });
      fetch(gif.src)
        .then(function (response) {
          return response.blob();
        })
        .then(
          function (data) {
            const imgObj = URL.createObjectURL(data);
            setGifSrc({
              id: gif.id,
              src: imgObj,
            });
            setGifs((prevState) => ({
              ...prevState,
              [gif.id]: {
                ...gif,
                blob: imgObj,
              },
            }));
          },
          function (err) {
            console.log(err, "error");
          }
        );
    }
  };

  useEffect(() => {
    let gifUrls = body.match(FindGifRegex);
    if (gifUrls) {
      gifUrls.forEach((gifUrl) => {
        const gifLink = gifUrl.replace("&amp;rid=giphy.gif", "&rid=giphy.gif");
        const tbr = "&rid=giphy.gif";
        let cid = gifLink.substring(gifLink.indexOf("cid") + 4);
        cid = cid.substring(0, cid.length - tbr.length);

        fetchBlob({
          id: cid,
          src: gifLink,
        });
      });
    }
  }, []);

  let gifItems = Object.values(gifs);

  return (
    <>
      {!gifItems.some((g) => typeof g.blob === "undefined") &&
        gifItems.map((gif) => {
          return <GifPlayer className={"blob-gif-player gif-player"} key={gif.id} gif={gif.blob} autoplay={autoPlay} {...otherProps} />;
        })}
    </>
  );
};

export default React.memo(BlobGifPlayer);
