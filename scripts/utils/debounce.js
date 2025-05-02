export const debounce = (func, wait = 100) => {
    let timeout;
    return function debouncedFunction(...args) {
        const ctx = this;
        const later = () => {
            clearTimeout(timeout);
            func.apply(ctx, ...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    }
}