import { Search, SlidersHorizontal } from "lucide-react";

const SearchFilters = ({ search, onSearchChange, genre, onGenreChange, priceRange, onPriceRangeChange, sort, onSortChange, categories = [], ranges = [] }) => {
  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-input bg-card py-3 pl-11 pr-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

        <div className="flex flex-wrap gap-2">
          {categories.map((g) => (
            <button
              key={g}
              onClick={() => onGenreChange(g)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${genre === g
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <select
            value={priceRange}
            onChange={(e) => onPriceRangeChange(Number(e.target.value))}
            className="rounded-md border border-input bg-card px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            {ranges.map((r, i) => (
              <option key={r.label} value={i}>{r.label}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-md border border-input bg-card px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            <option value="title">Sort: Title</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
