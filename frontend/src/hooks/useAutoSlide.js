import { useEffect } from "react";

export default function useAutoSlide(action, delay = 3500) {
  useEffect(() => {
    const timer = setTimeout(() => {
      action();
    }, delay);

    return () => clearTimeout(timer);
  }, [action, delay]);
}
