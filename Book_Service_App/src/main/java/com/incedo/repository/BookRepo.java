package com.incedo.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.incedo.entity.Book;

@Repository
public interface BookRepo extends JpaRepository<Book, Long> {

    Optional<Book> findByIsbn(String isbn);

    List<Book> findByCategory(String category);

    List<Book> findByTitleContainingIgnoreCase(String title);
    
    // price filter(range of price)
    List<Book> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
}
