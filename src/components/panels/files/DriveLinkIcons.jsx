import React from "react";
import { SvgIconFeather } from "../../common/SvgIcon";

const DriveLinkIcons = (props) => {
  const { type } = props;
  if (type.includes("document")) {
    return <SvgIconFeather icon="gdoc" />;
  } else if (type.includes("form")) {
    return <SvgIconFeather icon="gforms" />;
  } else if (type.includes("google_folder")) {
    return <SvgIconFeather icon="google-drive" />;
  } else if (type.includes("spreadsheet")) {
    return <SvgIconFeather icon="gsheet" />;
  } else if (type.includes("word")) {
    return <SvgIconFeather icon="office-word" />;
  } else if (type.includes("excel")) {
    return <SvgIconFeather icon="office-excel" />;
  } else if (type.includes("ppt")) {
    return <SvgIconFeather icon="office-ppt" />;
  } else if (type.includes("office_folder")) {
    return <SvgIconFeather icon="office-one-drive" />;
  } else if (type.includes("dropbox")) {
    return <SvgIconFeather icon="dropbox" />;
  } else if (type.includes("file")) {
    return <i className="fa fa-file-o text-info" />;
  } else {
    return <i className="fa fa-file-o text-info" />;
  }
};

export default DriveLinkIcons;
