package com.incedo.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.incedo.dto.BookPatchDTO;
import com.incedo.dto.BookRequestDTO;
import com.incedo.dto.BookResponseDTO;
import com.incedo.entity.Book;
import com.incedo.exception.BookNotFoundException;
import com.incedo.repository.BookRepo;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepo bookRepository;

    public BookServiceImpl(BookRepo bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public BookResponseDTO createBook(BookRequestDTO dto) {
        Book book = new Book();
        mapToEntity(dto, book);
        return mapToDTO(bookRepository.save(book));
    }

    @Override
    public BookResponseDTO getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found"));
        return mapToDTO(book);
    }

    @Override
    public List<BookResponseDTO> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BookResponseDTO updateBook(Long id, BookRequestDTO dto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found"));

        mapToEntity(dto, book);
        return mapToDTO(bookRepository.save(book));
    }

    @Override
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found"));
        bookRepository.delete(book);
    }

    @Override
    public List<BookResponseDTO> getBooksByCategory(String category) {
        return bookRepository.findByCategory(category)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private void mapToEntity(BookRequestDTO dto, Book book) {
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setIsbn(dto.getIsbn());
        book.setCategory(dto.getCategory());
        book.setPrice(dto.getPrice());
        book.setStockQuantity(dto.getStockQuantity());
    }

    private BookResponseDTO mapToDTO(Book book) {
        BookResponseDTO dto = new BookResponseDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setIsbn(book.getIsbn());
        dto.setCategory(book.getCategory());
        dto.setPrice(book.getPrice());
        dto.setStockQuantity(book.getStockQuantity());
        return dto;
    }
    
	/*
	 * @Override public List<BookResponseDTO> getBooksByPriceRange1(BigDecimal
	 * minPrice, BigDecimal maxPrice) {
	 * 
	 * if (minPrice == null || maxPrice == null) { throw new
	 * IllegalArgumentException("Price range values are required"); }
	 * 
	 * if (minPrice.compareTo(BigDecimal.ZERO) < 0 ||
	 * maxPrice.compareTo(BigDecimal.ZERO) < 0) { throw new
	 * IllegalArgumentException("Price cannot be negative"); }
	 * 
	 * if (minPrice.compareTo(maxPrice) > 0) { throw new
	 * IllegalArgumentException("Min price cannot be greater than max price"); }
	 * 
	 * return bookRepository.findByPriceBetween(minPrice, maxPrice) .stream()
	 * .map(this::mapToDTO) .collect(Collectors.toList()); }
	 */

    
    // price range object mapper
    @Override
    public List<BookResponseDTO> getBooksByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
    	if (minPrice == null || maxPrice == null) {
            throw new IllegalArgumentException("Price range values are required");
        }

        if (minPrice.compareTo(BigDecimal.ZERO) < 0 ||
            maxPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }

        if (minPrice.compareTo(maxPrice) > 0) {
            throw new IllegalArgumentException("Min price cannot be greater than max price");
        }
    	
    	
        return bookRepository.findByPriceBetween(minPrice, maxPrice)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

	@Override
	public BookResponseDTO patchBook(Long id, BookPatchDTO patchDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void reduceStock(Long id, Integer quantity) {
		Book book = bookRepository.findById(id).get();
		
		book.setStockQuantity(book.getStockQuantity() - quantity);
		
		bookRepository.save(book);
		
	}
}
