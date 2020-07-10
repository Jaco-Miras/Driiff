import PropTypes from "prop-types";
import React, { forwardRef } from "react";

const BadgeIcon = forwardRef((props, ref) => {
  const { className = "", value, ...otherProps } = props;

  return (
    <span ref={ref} className={"badge-growing " + className} {...otherProps}>
      <i className="badge-growing-value">{value}</i>
    </span>
  );
});

export default React.memo(BadgeIcon);

BadgeIcon.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
};

BadgeIcon.defaultProps = {
  className: "",
};
