import React, { useEffect } from "react";
import GifPlayer from "react-gif-player";
import "react-gif-player/src/GifPlayer.scss";
import { FindGifRegex } from "../../helpers/stringFormatter";
import { incomingGifData } from "../../redux/actions/fileActions";
import { useSelector, useDispatch } from "react-redux";

const BlobGifPlayer = (props) => {
  const { body, autoPlay = true } = props;

  const dispatch = useDispatch();

  const gifBlobs = useSelector((state) => state.files).gifBlobs;

  const setGifSrc = (payload, callback = () => {}) => {
    dispatch(incomingGifData(payload, callback));
  };

  const fetchBlob = (gif) => {
    if (!gifBlobs[gif.id]) {
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

  let gifUrls = body.match(FindGifRegex).map((gifUrl) => {
    const gifLink = gifUrl.replace("&amp;rid=giphy.gif", "&rid=giphy.gif");
    const tbr = "&rid=giphy.gif";
    let cid = gifLink.substring(gifLink.indexOf("cid") + 4);
    cid = cid.substring(0, cid.length - tbr.length);
    return cid;
  });

  let gifItems = Object.values(gifUrls);

  return (
    <>
      {gifItems.length > 0 &&
        gifItems.map((gif, i) => {
          if (gifBlobs[gif]) {
            return <GifPlayer className={"blob-gif-player gif-player"} key={`${gif}-${i}`} gif={gifBlobs[gif]} autoplay={autoPlay} />;
          } else {
            return null;
          }
        })}
    </>
  );
};

export default React.memo(BlobGifPlayer);
