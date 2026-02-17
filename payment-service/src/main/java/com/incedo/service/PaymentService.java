package com.incedo.service;

import java.util.List;

import com.incedo.dto.PaymentDTO;
import com.incedo.dto.PaymentUpdateDTO;
import com.incedo.entity.PaymentStatus;

public interface PaymentService {
	
	public List<PaymentDTO> getAllPayments();	// get all payment data
	public PaymentDTO getPaymentById(Long id);		// get payment by id (primary key)
	public List<PaymentDTO> getPaymentByOrderId(Long orderId);	// get payments of same order id
	public List<PaymentDTO> getPaymentByStatus(PaymentStatus status);	// get payments by status
	public PaymentDTO getPaymentByTransactionId(String tid);
	
	
	public PaymentDTO initiatePayment(PaymentDTO paymentDTO);		// start a payment
	
	
	public PaymentDTO updatePayment(Long id, PaymentUpdateDTO paymentUpdateDTO);	// update payment details once initiated
}
