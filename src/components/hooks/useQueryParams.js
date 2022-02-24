import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const useQueryParams = () => {
  const location = useLocation();
  const history = useHistory();
  const [paramsObj, setParamsObj] = useState({});

  useEffect(() => {
    const _paramsObj = {};
    const queryParams = new URLSearchParams(location.search);
    for (const [key, value] of queryParams.entries()) {
      _paramsObj[key] = value;
    }
    setParamsObj(_paramsObj);
  }, [location.search]);

  const removeParam = useCallback(
    (key) => {
      const queryParams = new URLSearchParams(location.search);
      queryParams.delete(key);
      const _paramsObj = {};

      for (const [key, value] of queryParams.entries()) {
        _paramsObj[key] = value;
      }

      history.replace(location.pathname + queryParams.toString().length ? `?${queryParams.toString()}` : "");
      setParamsObj(_paramsObj);
    },
    [location.search]
  );

  return {
    params: Object.keys(paramsObj).length ? paramsObj : null,
    removeParam,
  };
};

export default useQueryParams;
