package com.incedo.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.incedo.dto.BookPatchDTO;
import com.incedo.dto.BookRequestDTO;
import com.incedo.dto.BookResponseDTO;
import com.incedo.service.BookService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // CREATE BOOK
    @PostMapping("/admin-only")
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponseDTO createBook(@Valid @RequestBody BookRequestDTO dto) {
        return bookService.createBook(dto);
    }

    // GET BOOK BY ID
    @GetMapping("/user-only/{id}")
    public BookResponseDTO getBook(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    // GET ALL BOOKS
    @GetMapping("/user-only")
    public List<BookResponseDTO> getAllBooks() {
        return bookService.getAllBooks();
    }

    // UPDATE BOOK (FULL)
    @PutMapping("/admin-only/{id}")
    public BookResponseDTO updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookRequestDTO dto) {
        return bookService.updateBook(id, dto);
    }

    // DELETE BOOK
    @DeleteMapping("/admin-only/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

    // FILTER BY CATEGORY
    @GetMapping("/user-only/category/{category}")
    public List<BookResponseDTO> getByCategory(@PathVariable String category) {
        return bookService.getBooksByCategory(category);
    }

    // FILTER BY PRICE RANGE
    @GetMapping("/user-only/price-range")
    public List<BookResponseDTO> getBooksByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {

        return bookService.getBooksByPriceRange(minPrice, maxPrice);
    }

    // PATCH - PARTIAL UPDATE (ANY FIELD)
    @PatchMapping("/user-only/{id}")
    public BookResponseDTO patchBook(
            @PathVariable Long id,
            @Valid @RequestBody BookPatchDTO patchDTO) {

        return bookService.patchBook(id, patchDTO);
    }
    
    @PutMapping("/user-only/{id}/reduce-stock")
    public ResponseEntity<Void> reduceStock(@PathVariable Long id, @RequestParam Integer quantity) {
        bookService.reduceStock(id, quantity);
        return ResponseEntity.ok().build();
    }
}
