package com.incedo.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public class BookRequestDTO {

	//to string
    @Override
	public String toString() {
		return "BookRequestDTO [title=" + title + ", author=" + author + ", isbn=" + isbn + ", category=" + category
				+ ", price=" + price + ", stockQuantity=" + stockQuantity + "]";
	}
    
    //parametrized constructor
	public BookRequestDTO(String title, String author, String isbn, String category, BigDecimal price,
			Integer stockQuantity) {
		super();
		this.title = title;
		this.author = author;
		this.isbn = isbn;
		this.category = category;
		this.price = price;
		this.stockQuantity = stockQuantity;
	}
	
	public BookRequestDTO() {
		super();
	}

	// getters and setters
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	public String getIsbn() {
		return isbn;
	}
	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public Integer getStockQuantity() {
		return stockQuantity;
	}
	public void setStockQuantity(Integer stockQuantity) {
		this.stockQuantity = stockQuantity;
	}
	
	@NotBlank(message = "Title is mandatory")
	private String title;
	
	@NotBlank(message = "Author is mandatory")
    private String author;
	
	@NotBlank(message = "isbn is mandatory")
    private String isbn;
	
	@NotBlank(message = "Please mention category")
    private String category;
	
	@NotNull(message = "Price cannot be zero")
	@Positive(message = "Price must be greater than zero")
    private BigDecimal price;
	
	@NotNull(message = "Stock quantity should not be zero")
	@PositiveOrZero(message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    
}
