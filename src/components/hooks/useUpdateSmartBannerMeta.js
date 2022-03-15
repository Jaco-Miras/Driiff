import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { $_GET, isIPAddress } from "../../helpers/commonFunctions";

const useUpdateSmartBannerMeta = () => {
  const history = useHistory();
  const getDriffName = () => {
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
  useEffect(() => {
    let content = `app-id=1569384828, app-argument=${process.env.REACT_APP_apiProtocol + getDriffName() + "." + process.env.REACT_APP_localDNSName}${history.location.pathname}`;
    const meta = document.querySelector("meta[name=\"apple-itunes-app\"]");
    if (meta) meta.setAttribute("content", content);
    //console.log(meta, history.location.pathname, content);
  }, [history.location.pathname]);
};

export default useUpdateSmartBannerMeta;
