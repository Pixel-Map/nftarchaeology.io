import React, { createContext, useContext, useEffect, useState } from "react";
import { bySlug } from "./data";

const ArchiveContext = createContext(null);
export function ArchiveProvider({ children }) {
  const [saved, setSaved] = useState([]);
  const [compare, setCompare] = useState([]);
  const [theme, setTheme] = useState("system");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    try {
      const data = JSON.parse(
        localStorage.getItem("nft-archive:saved") || "[]",
      );
      if (Array.isArray(data)) setSaved(data.filter((id) => bySlug[id]));
      const preference = localStorage.getItem("nft-archive:theme");
      if (["light", "dark", "system"].includes(preference))
        setTheme(preference);
    } catch {
      setNotice(
        "Browser storage is unavailable. Bookmarks will last for this visit.",
      );
    }
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const toggleSaved = (slug) => {
    const next = saved.includes(slug)
      ? saved.filter((id) => id !== slug)
      : [...saved, slug];
    setSaved(next);
    try {
      localStorage.setItem("nft-archive:saved", JSON.stringify(next));
    } catch {
      setNotice(
        "Bookmark saved for this visit. Browser storage is unavailable.",
      );
    }
  };
  const toggleCompare = (slug) => {
    if (!compare.includes(slug) && compare.length >= 4) {
      setNotice("Compare up to four collections. Remove one to add another.");
      return;
    }
    setCompare(
      compare.includes(slug)
        ? compare.filter((id) => id !== slug)
        : [...compare, slug],
    );
  };
  const changeTheme = (value) => {
    setTheme(value);
    try {
      localStorage.setItem("nft-archive:theme", value);
    } catch {
      /* In-memory preference still works. */
    }
  };
  return (
    <ArchiveContext.Provider
      value={{
        saved,
        toggleSaved,
        compare,
        setCompare,
        toggleCompare,
        theme,
        changeTheme,
        notice,
        setNotice,
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
}
export const useArchive = () => useContext(ArchiveContext);
