"use client";

import { useEffect, useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import type { Category } from "@/lib/catalog/types";

export const sectionDomId = (categoryId: string) => `categoria-${categoryId}`;

type CategoryTabsProps = {
  categories: Category[];
  query: string;
  onQueryChange: (query: string) => void;
};

export function CategoryTabs({ categories, query, onQueryChange }: CategoryTabsProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const [searchOpen, setSearchOpen] = useState(false);
  const tabRefs = useRef(new Map<string, HTMLAnchorElement>());
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(sectionDomId(category.id)))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        setActiveId(topmost.target.id.replace(sectionDomId(""), ""));
      },
      { rootMargin: "-120px 0px -60% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [categories, query]);

  useEffect(() => {
    if (!activeId) return;
    tabRefs.current.get(activeId)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeId]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const closeSearch = () => {
    onQueryChange("");
    setSearchOpen(false);
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur-md" aria-label="Categorias">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 md:px-8">
        <button
          type="button"
          onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
          aria-label={searchOpen ? "Fechar busca" : "Buscar produto"}
          aria-expanded={searchOpen}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-lg transition hover:border-accent hover:text-accent"
        >
          {searchOpen ? <CloseIcon /> : <SearchIcon />}
        </button>

        {searchOpen ? (
          <input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar essência, carvão, rosh..."
            className="h-11 min-w-0 flex-1 rounded-full border border-line-strong bg-surface px-4 text-base placeholder:text-muted focus:border-accent focus:outline-none"
          />
        ) : (
          <ul className="no-scrollbar flex flex-1 gap-1 overflow-x-auto">
            {categories.map((category) => {
              const isActive = category.id === activeId;
              return (
                <li key={category.id} className="shrink-0">
                  <a
                    ref={(element) => {
                      if (element) tabRefs.current.set(category.id, element);
                    }}
                    href={`#${sectionDomId(category.id)}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative flex h-11 items-center px-3 font-display text-xl tracking-wider transition ${
                      isActive ? "text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {category.name}
                    <span
                      className={`absolute inset-x-3 bottom-1 h-0.5 bg-accent transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );
}
