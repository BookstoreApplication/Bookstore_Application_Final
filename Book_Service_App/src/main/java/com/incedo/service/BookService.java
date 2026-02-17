package com.incedo.service;

import java.math.BigDecimal;
import java.util.List;

import com.incedo.dto.BookPatchDTO;
import com.incedo.dto.BookRequestDTO;
import com.incedo.dto.BookResponseDTO;

public interface BookService {

    BookResponseDTO createBook(BookRequestDTO bookRequestDTO);

    BookResponseDTO getBookById(Long id);

    List<BookResponseDTO> getAllBooks();

    BookResponseDTO updateBook(Long id, BookRequestDTO bookRequestDTO);

    void deleteBook(Long id);
    
    // for patch api
    BookResponseDTO patchBook(Long id, BookPatchDTO patchDTO);


    List<BookResponseDTO> getBooksByCategory(String category);
    
    List<BookResponseDTO> getBooksByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
    
    
    // update stock
    void reduceStock(Long id, Integer quantity);
}
