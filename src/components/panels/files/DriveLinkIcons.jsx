import React from "react";

const DriveLinkIcons = (props) => {
  const { type } = props;
  if (type.includes("word") || type.includes("document" || type.includes("form"))) {
    return <i className="fa fa-file-word-o text-info" />;
  } else if (type.includes("folder")) {
    return <i className="fa fa-folder-o text-instagram" />;
  } else if (type.includes("spreadsheet") || type.includes("excel")) {
    return <i className="fa fa-file-excel-o text-success" />;
  } else if (type.includes("ppt")) {
    return <i className="fa fa-file-powerpoint-o text-secondary" />;
  } else if (type.includes("file")) {
    return <i className="fa fa-file-o text-info" />;
  } else {
    return <i className="fa fa-file-o text-info" />;
  }
};

export default DriveLinkIcons;
