package com.incedo.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.incedo.dto.BookResponseDTO;

@FeignClient(name = "book-service") // Name of the service in Eureka/Registry
public interface BookClient {

    @GetMapping("/api/books/user-only/{id}")
    BookResponseDTO getBookById(@PathVariable("id") Long id);
    
    @PutMapping("/api/books/user-only/{id}/reduce-stock")
    void reduceStock(@PathVariable("id") Long id, @RequestParam("quantity") Integer quantity);
}
