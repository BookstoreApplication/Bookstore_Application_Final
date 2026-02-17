package com.incedo.dto;

public class OrderItemDTO {
	private String bookId;
	private Integer quantity;

	public OrderItemDTO() {
		super();
	}

	public OrderItemDTO(String bookId, Integer quantity) {
		super();
		this.bookId = bookId;
		this.quantity = quantity;
	}

	public String getBookId() {
		return bookId;
	}

	public void setBookId(String bookId) {
		this.bookId = bookId;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

}
