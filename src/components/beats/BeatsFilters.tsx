"use client";

export type SortOption = "relevance" | "price-asc" | "price-desc" | "best-value";

interface PriceBounds {
  min: number;
  max: number;
}

interface BeatsFiltersProps {
  tags: string[];
  badges: string[];
  priceBounds: PriceBounds;
  priceRange: [number, number];
  selectedTags: string[];
  selectedBadges: string[];
  sort: SortOption;
  onTagsChange: (tags: string[]) => void;
  onBadgesChange: (badges: string[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function BeatsFilters({
  tags,
  badges,
  priceBounds,
  priceRange,
  selectedTags,
  selectedBadges,
  sort,
  onTagsChange,
  onBadgesChange,
  onPriceRangeChange,
  onSortChange,
  onReset,
}: BeatsFiltersProps) {
  return (
    <aside className="h-fit space-y-7 rounded-[22px] border-2 border-amber/50 bg-black p-6 lg:sticky lg:top-28">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg normal-case">Filtros</h2>
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer text-xs text-muted transition-colors hover:text-brand"
        >
          Limpiar
        </button>
      </div>

      <div>
        <label htmlFor="sort" className="mb-2 block text-sm font-semibold text-ink">
          Ordenar por
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full rounded-xl border border-amber/30 bg-black px-3 py-2.5 text-sm text-ink"
        >
          <option value="relevance">Relevancia</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="best-value">Destacados primero</option>
        </select>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Precio</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            aria-label="Precio mínimo"
            min={priceBounds.min}
            max={priceRange[1]}
            value={priceRange[0]}
            onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
            className="w-full rounded-xl border border-amber/30 bg-black px-3 py-2 text-sm text-ink"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            aria-label="Precio máximo"
            min={priceRange[0]}
            max={priceBounds.max}
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
            className="w-full rounded-xl border border-amber/30 bg-black px-3 py-2 text-sm text-ink"
          />
        </div>
        <input
          type="range"
          aria-label="Precio máximo"
          min={priceBounds.min}
          max={priceBounds.max}
          value={priceRange[1]}
          onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
          className="mt-3 w-full accent-amber"
        />
      </div>

      {tags.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-ink">Categoría</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagsChange(toggle(selectedTags, tag))}
                className={`chip cursor-pointer border-amber/30 bg-black transition-colors ${
                  selectedTags.includes(tag) ? "border-amber bg-amber/10 text-amber" : ""
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {badges.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-ink">Promoción</h3>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <button
                key={badge}
                type="button"
                onClick={() => onBadgesChange(toggle(selectedBadges, badge))}
                className={`chip cursor-pointer border-amber/30 bg-black transition-colors ${
                  selectedBadges.includes(badge) ? "border-amber bg-amber/10 text-amber" : ""
                }`}
              >
                {badge}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
