import { useEffect, useState } from "react";
import { $_GET, isIPAddress } from "../../helpers/commonFunctions";
import useDriffActions from "./useDriffActions";
import { getCurrentDriffUrl } from "../../helpers/slugHelper";

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

  const updateFaviconState = (isActive = false) => {
    let driffUrl = getCurrentDriffUrl();
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = isActive ? `${driffUrl}/assets/icons/favicon-active.png` : `${driffUrl}/assets/icons/favicon.png`;
    document.getElementsByTagName('head')[0].appendChild(link);
  };

  useEffect(() => {
    if (init)
      return;

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
    updateFaviconState
  };
};

export default useDriff;
