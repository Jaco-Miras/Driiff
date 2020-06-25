const useDebounce = (func, wait) => {

    let timeout;

    const apply = (...args) => {
        const context = this;
        if (timeout)
            clearTimeout(timeout);

        timeout = setTimeout(() => {
            timeout = null;
            func.apply(context, args);
        }, wait);
    };

    const reset = () => {
        clearTimeout(timeout);
    };

    return {
        apply,
        reset,
    };
};

export default useDebounce;