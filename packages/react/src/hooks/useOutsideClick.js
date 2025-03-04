import { useEffect } from "react";
export function useOutsideClick(containerRef, handler, deps) {
    useEffect(function () {
        function handleClickOutside(e) {
            if (containerRef.current &&
                !containerRef.current.contains(e.target)) {
                handler();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, deps);
}
