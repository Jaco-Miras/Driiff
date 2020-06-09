import {useRef} from "react";

const useLogRenders = () => {
    const renders = useRef(0);
    console.log("renders", renders.current+= 1);
};

export default useLogRenders;