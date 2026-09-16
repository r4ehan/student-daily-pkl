import { useEffect } from "react";

export default function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title
      ? `${title} · Student Daily PKL`
      : "Student Daily PKL";
    return () => {
      document.title = prev;
    };
  }, [title]);
}
