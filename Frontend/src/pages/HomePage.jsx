import { useState, useMemo, useEffect } from "react";
import { MOCK_BOOKS } from "@/data/books";
import BookCard from "@/components/BookCard";
import SearchFilters from "@/components/SearchFilters";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const ITEMS_PER_PAGE = 8;

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [priceRange, setPriceRange] = useState(0);
  const [sort, setSort] = useState("title");
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState([]);

  const [categories, setCategories] = useState(["All"]);
  const [priceRanges, setPriceRanges] = useState([{ label: "All Prices", min: 0, max: Infinity }]);

  useEffect(() => {
    // Axios returns a Promise
    axios.get("/api/books/user-only")
      .then((response) => {
        if (!Array.isArray(response.data)) {
          console.error("API Error: Expected array but got", response.data);
          return;
        }

        const updatedBooks = response.data.map((element) => ({
          ...element,
          cover: element.cover || `https://covers.openlibrary.org/b/title/${encodeURIComponent(element.title)}-M.jpg`,
          genre: element.category || "Unknown"
        }));

        setBooks(updatedBooks);

        // Dynamic Categories
        const uniqueCategories = ["All", ...new Set(updatedBooks.map(b => b.genre).filter(Boolean))];
        setCategories(uniqueCategories);

        // Dynamic Price Ranges
        const prices = updatedBooks.map(b => Number(b.price)).filter(p => !isNaN(p));
        if (prices.length > 0) {
          const min = Math.floor(Math.min(...prices));
          const max = Math.ceil(Math.max(...prices));
          const diff = max - min;
          const rangeStep = diff > 0 ? diff / 3 : 10; // Avoid divide by zero

          setPriceRanges([
            { label: "All Prices", min: 0, max: Infinity },
            { label: `₹${min} - ₹${Math.floor(min + rangeStep)}`, min: min, max: min + rangeStep },
            { label: `₹${Math.floor(min + rangeStep)} - ₹${Math.floor(min + rangeStep * 2)}`, min: min + rangeStep, max: min + rangeStep * 2 },
            { label: `₹${Math.floor(min + rangeStep * 2)} - ₹${max}`, min: min + rangeStep * 2, max: max + 0.01 } // Ensure max is included
          ]);
        }
      })
      .catch((error) => {
        console.error("BOOKS API ERROR:", error);
      });
  }, []);

  const filtered = useMemo(() => {
    let filteredBooks = [...books];

    if (search) {
      const q = search.toLowerCase();
      filteredBooks = filteredBooks.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    if (genre !== "All") filteredBooks = filteredBooks.filter((b) => b.genre === genre);

    const range = priceRanges[priceRange];
    if (range) {
      filteredBooks = filteredBooks.filter((b) => b.price >= range.min && b.price < range.max);
    }

    switch (sort) {
      case "price-asc": filteredBooks.sort((a, b) => a.price - b.price); break;
      case "price-desc": filteredBooks.sort((a, b) => b.price - a.price); break;
      case "rating": filteredBooks.sort((a, b) => b.rating - a.rating); break;
      default: filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    }
    return filteredBooks;
  }, [search, genre, priceRange, sort, books, priceRanges]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="page-container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Discover Your Next <span className="text-gradient-gold">Great Read</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
          Browse our curated collection of timeless classics and modern masterpieces.
        </p>
      </motion.div>

      <SearchFilters
        search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
        genre={genre} onGenreChange={(v) => { setGenre(v); setPage(1); }}
        priceRange={priceRange} onPriceRangeChange={(v) => { setPriceRange(v); setPage(1); }}
        sort={sort} onSortChange={(v) => { setSort(v); setPage(1); }}
        categories={categories}
        ranges={priceRanges}
      />

      {paginated.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <p className="text-lg">No books found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {paginated.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${page === i + 1
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:bg-secondary"
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
