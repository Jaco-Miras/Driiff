import React from "react";
import { SvgIconFeather } from "../../common/SvgIcon";

const DriveLinkIcons = (props) => {
  const { type } = props;
  if (type.includes("document")) {
    return <SvgIconFeather icon="gdoc" viewBox={"0 0 48 48"} stroke={"none"} height={48} width={48} />;
  } else if (type.includes("form")) {
    return <SvgIconFeather icon="gforms" viewBox={"0 0 48 48"} stroke={"none"} height={48} width={48} />;
  } else if (type.includes("google_folder")) {
    return <SvgIconFeather icon="google-drive" viewBox={"0 0 48 48"} stroke={"none"} height={48} width={48} />;
  } else if (type.includes("spreadsheet")) {
    return <SvgIconFeather icon="gsheet" viewBox={"0 0 48 48"} stroke={"none"} height={48} width={48} />;
  } else if (type.includes("word")) {
    return <SvgIconFeather icon="office-word" viewBox={"0 0 48 48"} stroke={"none"} height={48} width={48} />;
  } else if (type.includes("excel")) {
    return <SvgIconFeather icon="office-excel" viewBox={"0 0 48 48"} stroke={"none"} height={48} width={48} />;
  } else if (type.includes("ppt")) {
    return <SvgIconFeather icon="office-ppt" viewBox={"0 0 48 48"} stroke={"none"} height={48} width={48} />;
  } else if (type.includes("office_folder")) {
    return <SvgIconFeather icon="office-one-drive" viewBox={"0 0 48 48"} stroke={"none"} height={48} width={48} />;
  } else if (type.includes("dropbox")) {
    return <SvgIconFeather icon="dropbox" viewBox={"0 0 48 48"} stroke={"none"} height={48} width={48} />;
  } else if (type.includes("file")) {
    return <i className="fa fa-file-o text-info" />;
  } else {
    return <i className="fa fa-file-o text-info" />;
  }
};

export default DriveLinkIcons;
