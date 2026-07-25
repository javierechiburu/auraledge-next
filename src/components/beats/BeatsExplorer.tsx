"use client";

import { useMemo, useState } from "react";
import { Product } from "@/lib/types";
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

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
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
  }, [products, selectedTags, selectedBadges, priceRange, sort]);

  function resetFilters() {
    setSelectedTags([]);
    setSelectedBadges([]);
    setPriceRange([priceBounds.min, priceBounds.max]);
    setSort("relevance");
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 lg:grid-cols-[280px_1fr]">
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
      <BeatsGrid products={filtered} total={products.length} />
    </div>
  );
}
