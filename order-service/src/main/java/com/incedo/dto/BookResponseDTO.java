package com.incedo.dto;

import java.math.BigDecimal;

public class BookResponseDTO {

	// to string
	@Override
	public String toString() {
		return "BookResponseDTO [id=" + id + ", title=" + title + ", author=" + author + ", isbn=" + isbn
				+ ", category=" + category + ", price=" + price + ", stockQuantity=" + stockQuantity + ", getId()="
				+ getId() + ", getTitle()=" + getTitle() + ", getAuthor()=" + getAuthor() + ", getIsbn()=" + getIsbn()
				+ ", getCategory()=" + getCategory() + ", getPrice()=" + getPrice() + ", getStockQuantity()="
				+ getStockQuantity() + ", getClass()=" + getClass() + ", hashCode()=" + hashCode() + ", toString()="
				+ super.toString() + "]";
	}

	public BookResponseDTO() {
		super();
	}

	// parameterized constructor
	public BookResponseDTO(Long id, String title, String author, String isbn, String category, BigDecimal price,
			Integer stockQuantity) {
		super();
		this.id = id;
		this.title = title;
		this.author = author;
		this.isbn = isbn;
		this.category = category;
		this.price = price;
		this.stockQuantity = stockQuantity;
	}

	// getters and setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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

	private Long id;
	private String title;
	private String author;
	private String isbn;
	private String category;
	private BigDecimal price;
	private Integer stockQuantity;

}
