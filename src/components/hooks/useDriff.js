import { useEffect, useRef, useState } from "react";
import { $_GET, isIPAddress } from "../../helpers/commonFunctions";
import useDriffActions from "./useDriffActions";
import { getCurrentDriffUrl } from "../../helpers/slugHelper";
import { isIOS } from "react-device-detect";
import { useSelector } from "react-redux";

export const getDriffName = () => {
  let driff = $_GET("driff");
  if (driff) {
    return driff;
  }

  driff = localStorage.getItem("slug");
  if (driff) {
    return driff;
  }

  if (isIPAddress(window.location.hostname)) {
    return null;
  }

  if (window.location.hostname === process.env.REACT_APP_localDNSName) {
    return null;
  }

  //process slug name from host name
  let hostnameArr = window.location.hostname.split(".");
  if (hostnameArr.length >= 3) {
    return hostnameArr[0];
  } else if (hostnameArr[0] === "localhost") {
    return null;
  } else {
    return false;
  }
};

let init = false;

const useDriff = () => {
  const actions = useDriffActions();
  const [redirected, setRedirected] = useState(actions.getName());
  const [registeredDriff, setRegisteredDriff] = useState(actions.getName());
  const faviconImg = useSelector((state) => state.settings.driff.favicon);

  const driffUrl = getCurrentDriffUrl();

  const refs = {
    faviconState: useRef(false),
  };

  const updateFaviconState = (isActive = false) => {
    if (refs.faviconState.current !== isActive) {
      refs.faviconState.current = isActive;
      let link = document.querySelector("link[rel*='icon shortcut']") || document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = isActive ? `${driffUrl}/assets/icons/favicon-active.png` : `${driffUrl}/assets/icons/favicon.png`;
      if (faviconImg) {
        link.href = faviconImg;
      }

      document.getElementsByTagName("head")[0].appendChild(link);
    }
  };

  useEffect(() => {
    if (init) return;

    if (isIOS) {
      let link = document.createElement("link");
      link.href = `${driffUrl}/assets/icons/favicon.png`;
      link.rel = "apple-touch-icon";

      document.getElementsByTagName("head")[0].appendChild(link);
    }

    init = true;

    if (!registeredDriff) {
      const slug = actions.getByHostname();

      //invalid hostname
      if (slug === false) {
        setRedirected(true);

        //not localhost or IP address
      } else if (slug !== null) {
        actions.check(slug, (err, res) => {
          if (res && res.data.status) {
            actions.storeName(slug, true);
            setRegisteredDriff(slug);
          } else {
            actions.unStoreName();
            setRedirected(true);
          }
        });
      } else {
        setRedirected(false);
      }
    } else {
      actions.check(registeredDriff, (err, res) => {
        if (!(res && res.data.status)) {
          actions.unStoreName();
          setRedirected(true);
        }
      });
    }
  }, []);

  return {
    actions,
    redirected,
    registeredDriff,
    setRegisteredDriff,
    updateFaviconState,
  };
};

export default useDriff;
