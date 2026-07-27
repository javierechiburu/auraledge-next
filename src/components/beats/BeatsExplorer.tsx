"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import { Product } from "@/lib/types";
import { CATEGORIES, categoryBySlug, slugOfCategory } from "@/lib/categories";
import BeatsFilters, { SortOption } from "./BeatsFilters";
import BeatsGrid from "./BeatsGrid";

function uniqueValues(products: Product[], key: "tag" | "badge"): string[] {
  return Array.from(
    new Set(products.map((p) => p[key]).filter((v): v is string => Boolean(v))),
  );
}

export default function BeatsExplorer({ products }: { products: Product[] }) {
  const priceBounds = useMemo(() => {
    const prices = products.map((p) => p.price);
    return {
      min: prices.length ? Math.floor(Math.min(...prices)) : 0,
      max: prices.length ? Math.ceil(Math.max(...prices)) : 0,
    };
  }, [products]);

  const tags = useMemo(() => uniqueValues(products, "tag"), [products]);
  const badges = useMemo(() => uniqueValues(products, "badge"), [products]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    priceBounds.min,
    priceBounds.max,
  ]);
  const [sort, setSort] = useState<SortOption>("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Categoría seleccionada (label) o null = "Todas".
  const [category, setCategory] = useState<string | null>(null);

  // Lee ?categoria=<slug> de la URL al montar.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("plantilla");
    const cat = categoryBySlug(slug);
    if (cat) setCategory(cat.label);
  }, []);

  function selectCategory(label: string | null) {
    setCategory(label);
    const url = new URL(window.location.href);
    const slug = slugOfCategory(label);
    if (slug) url.searchParams.set("plantilla", slug);
    else url.searchParams.delete("plantilla");
    window.history.replaceState({}, "", url.toString());
  }

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (selectedTags.length && !(p.tag && selectedTags.includes(p.tag)))
        return false;
      if (
        selectedBadges.length &&
        !(p.badge && selectedBadges.includes(p.badge))
      )
        return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });

    if (sort === "price-asc")
      result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc")
      result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "best-value")
      result = [...result].sort(
        (a, b) => Number(b.bestValue) - Number(a.bestValue),
      );

    return result;
  }, [products, category, selectedTags, selectedBadges, priceRange, sort]);

  function resetFilters() {
    setSelectedTags([]);
    setSelectedBadges([]);
    setPriceRange([priceBounds.min, priceBounds.max]);
    setSort("relevance");
  }

  const filters = (
    <BeatsFilters
      tags={tags}
      badges={badges}
      priceBounds={priceBounds}
      priceRange={priceRange}
      selectedTags={selectedTags}
      selectedBadges={selectedBadges}
      sort={sort}
      onTagsChange={setSelectedTags}
      onBadgesChange={setSelectedBadges}
      onPriceRangeChange={setPriceRange}
      onSortChange={setSort}
      onReset={resetFilters}
    />
  );

  const tabClass = (activeTab: boolean) =>
    `border px-4 py-2 text-sm font-medium transition-colors ${
      activeTab
        ? "border-accent bg-accent text-black"
        : "border-line text-muted hover:border-white/25 hover:text-ink"
    }`;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20">
      {/* Barra de PLANTILLAS (aparte de la "Categoría" de los filtros) */}
      <div className="mb-8 border-b border-line pb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
          Plantillas
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => selectCategory(null)} className={tabClass(category === null)}>
            Todas
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => selectCategory(c.label)}
              className={tabClass(category === c.label)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Botón de filtros (solo mobile) */}
      <div className="mb-5 lg:hidden">
        <button
          onClick={() => setFiltersOpen(true)}
          className="inline-flex items-center gap-2 border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-white/25"
        >
          <Filter size={16} className="text-accent" /> Filtros
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Fondo del drawer (mobile) */}
        <div
          onClick={() => setFiltersOpen(false)}
          className={`fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
            filtersOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
        />

        {/* Filtros: drawer lateral en mobile, sidebar en desktop */}
        <div
          className={`fixed inset-y-0 left-0 z-[80] w-[86vw] max-w-[330px] overflow-y-auto bg-bg p-5 transition-transform duration-300 lg:static lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:p-0 lg:transition-none ${
            filtersOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-3 flex justify-end lg:hidden">
            <button
              onClick={() => setFiltersOpen(false)}
              aria-label="Cerrar filtros"
              className="grid h-8 w-8 place-items-center text-muted transition-colors hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
          {filters}
        </div>

        <BeatsGrid products={filtered} total={products.length} />
      </div>
    </div>
  );
}
