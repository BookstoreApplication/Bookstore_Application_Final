package com.incedo.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class BookPatchDTO {

    @NotBlank(message = "Title must not be blank")
    private String title;

    @NotBlank(message = "Author must not be blank")
    private String author;

    @NotBlank(message = "Category must not be blank")
    private String category;

    @Positive(message = "Price must be greater than zero")
    private BigDecimal price;

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

	public BookPatchDTO(@NotBlank(message = "Title must not be blank") String title,
			@NotBlank(message = "Author must not be blank") String author,
			@NotBlank(message = "Category must not be blank") String category,
			@Positive(message = "Price must be greater than zero") BigDecimal price) {
		super();
		this.title = title;
		this.author = author;
		this.category = category;
		this.price = price;
	}

	public BookPatchDTO() {
		super();
	}

    // getters and setters
    
    
}
