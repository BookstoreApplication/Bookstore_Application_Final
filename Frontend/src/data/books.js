export const MOCK_BOOKS = [
  { id: "1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 12.99, rating: 4.5, genre: "Fiction", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop", description: "A story of the mysteriously wealthy Jay Gatsby." },
  { id: "2", title: "To Kill a Mockingbird", author: "Harper Lee", price: 14.99, rating: 4.8, genre: "Fiction", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop", description: "A gripping tale of racial injustice in the Deep South." },
  { id: "3", title: "1984", author: "George Orwell", price: 11.99, rating: 4.7, genre: "Dystopian", cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=400&fit=crop", description: "A dystopian social science fiction novel." },
  { id: "4", title: "Pride and Prejudice", author: "Jane Austen", price: 9.99, rating: 4.6, genre: "Romance", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop", description: "A romantic novel of manners." },
  { id: "5", title: "The Catcher in the Rye", author: "J.D. Salinger", price: 13.49, rating: 4.2, genre: "Fiction", cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop", description: "A story about teenage angst and alienation." },
  { id: "6", title: "Brave New World", author: "Aldous Huxley", price: 10.99, rating: 4.4, genre: "Dystopian", cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=400&fit=crop", description: "A dystopian novel set in a futuristic World State." },
  { id: "7", title: "The Hobbit", author: "J.R.R. Tolkien", price: 15.99, rating: 4.9, genre: "Fantasy", cover: "https://images.unsplash.com/photo-1518744386442-2d48ac47a7eb?w=300&h=400&fit=crop", description: "A fantasy novel about the adventures of Bilbo Baggins." },
  { id: "8", title: "Dune", author: "Frank Herbert", price: 16.99, rating: 4.7, genre: "Sci-Fi", cover: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=300&h=400&fit=crop", description: "A science fiction novel set in the distant future." },
  { id: "9", title: "Jane Eyre", author: "Charlotte Brontë", price: 8.99, rating: 4.3, genre: "Romance", cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=400&fit=crop", description: "A novel following the emotions and experiences of its eponymous heroine." },
  { id: "10", title: "The Alchemist", author: "Paulo Coelho", price: 11.49, rating: 4.5, genre: "Fiction", cover: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=300&h=400&fit=crop", description: "A philosophical story about following your dreams." },
  { id: "11", title: "Neuromancer", author: "William Gibson", price: 13.99, rating: 4.1, genre: "Sci-Fi", cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop", description: "A seminal cyberpunk novel." },
  { id: "12", title: "Wuthering Heights", author: "Emily Brontë", price: 9.49, rating: 4.3, genre: "Romance", cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=400&fit=crop", description: "A wild, passionate tale set on the Yorkshire moors." },
];

export const GENRES = ["All", "Fiction", "Dystopian", "Fantasy", "Sci-Fi", "Romance"];

export const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹10", min: 0, max: 10 },
  { label: "₹10 - ₹15", min: 10, max: 15 },
  { label: "Over ₹15", min: 15, max: Infinity },
];
