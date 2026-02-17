package com.incedo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.incedo.dto.PaymentDTO;
import com.incedo.dto.PaymentUpdateDTO;
import com.incedo.entity.PaymentStatus;
import com.incedo.service.PaymentService;
import com.incedo.service.PaymentServiceImpl;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
	private PaymentService paymentService;

	public PaymentController(PaymentServiceImpl paymentService) {
		this.paymentService = paymentService;
	}

	@GetMapping("/admin-only")
	public ResponseEntity<List<PaymentDTO>> getAllPayments() {
		return new ResponseEntity<List<PaymentDTO>>(paymentService.getAllPayments(), HttpStatus.OK);
	}

	@GetMapping("/admin-only/id/{id}")
	public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable("id") Long id) {
		return new ResponseEntity<PaymentDTO>(paymentService.getPaymentById(id), HttpStatus.OK);
	}

	@GetMapping("/admin-only/orderid/{orderId}")
	public ResponseEntity<List<PaymentDTO>> getPaymentByOrderId(@PathVariable("orderId") Long orderId) {
		return new ResponseEntity<List<PaymentDTO>>(paymentService.getPaymentByOrderId(orderId), HttpStatus.OK);
	}

	@GetMapping("/admin-only/status/{status}")
	public ResponseEntity<List<PaymentDTO>> getPaymentByStatus(@PathVariable("status") PaymentStatus status) {
		return new ResponseEntity<List<PaymentDTO>>(paymentService.getPaymentByStatus(status), HttpStatus.OK);
	}

	@GetMapping("/admin-only/transactionid/{tid}")
	public ResponseEntity<PaymentDTO> getPaymentByTransactionId(@PathVariable("tid") String tid) {
		return new ResponseEntity<PaymentDTO>(paymentService.getPaymentByTransactionId(tid), HttpStatus.OK);
	}

	@PostMapping("/user-only")
	public ResponseEntity<PaymentDTO> initiatePayment(@RequestBody PaymentDTO paymentDTO) {
		return new ResponseEntity<PaymentDTO>(paymentService.initiatePayment(paymentDTO), HttpStatus.CREATED);
	}

	@PatchMapping("/user-only/{id}")
	public ResponseEntity<PaymentDTO> updatePayment(@PathVariable("id") Long id,
			@RequestBody PaymentUpdateDTO paymentUpdateDTO) {
		return new ResponseEntity<PaymentDTO>(paymentService.updatePayment(id, paymentUpdateDTO), HttpStatus.OK);
	}

}
