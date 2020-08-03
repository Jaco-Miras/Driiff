import React, {useCallback} from "react";
import {toggleLoading} from "../../redux/actions/globalActions";
import {useDispatch, useSelector} from "react-redux";

const usePageLoader = () => {

  const dispatch = useDispatch();
  const isActive = useSelector((state) => state.global.isLoading);

  const toggle = useCallback((callback = () => {
  }) => {
    dispatch(toggleLoading(!isActive, callback));
  });

  const show = useCallback((callback = () => {
  }) => {
    dispatch(toggleLoading(true, callback));
  });

  const hide = useCallback((callback = () => {
  }) => {
    dispatch(toggleLoading(false, callback));
  })


  return {
    isActive,
    toggle,
    show,
    hide
  };
};

export default usePageLoader;
