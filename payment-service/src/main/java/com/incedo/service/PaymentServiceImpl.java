package com.incedo.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.incedo.dto.PaymentDTO;
import com.incedo.dto.PaymentUpdateDTO;
import com.incedo.entity.Payment;
import com.incedo.entity.PaymentStatus;
import com.incedo.repository.PaymentRepository;

@Service
public class PaymentServiceImpl implements PaymentService {
	private PaymentRepository paymentRepository;

	private ModelMapper modelMapper;

	public PaymentServiceImpl(PaymentRepository paymentRepository, ModelMapper modelMapper) {
		this.paymentRepository = paymentRepository;
		this.modelMapper = modelMapper;
	}

	// ========================== service methods =============================
	@Override
	public List<PaymentDTO> getAllPayments() {
		List<Payment> allPayments = paymentRepository.findAll();

		List<PaymentDTO> allPaymentsDTO = new ArrayList<>();

		for (Payment p : allPayments) {
			allPaymentsDTO.add(modelMapper.map(p, PaymentDTO.class));
		}

		return allPaymentsDTO;
	}

	@Override
	public PaymentDTO getPaymentById(Long id) {
		Payment payment = paymentRepository.findById(id).get();

		return modelMapper.map(payment, PaymentDTO.class);
	}

	@Override
	public List<PaymentDTO> getPaymentByOrderId(Long orderId) {
		List<Payment> paymentList = paymentRepository.findByOrderId(orderId);

		List<PaymentDTO> paymentDTOList = new ArrayList<>();

		for (Payment p : paymentList) {
			paymentDTOList.add(modelMapper.map(p, PaymentDTO.class));
		}

		return paymentDTOList;
	}

	@Override
	public List<PaymentDTO> getPaymentByStatus(PaymentStatus status) {
		List<Payment> paymentList = paymentRepository.findByStatus(status);

		List<PaymentDTO> paymentDTOList = new ArrayList<>();

		for (Payment p : paymentList) {
			paymentDTOList.add(modelMapper.map(p, PaymentDTO.class));
		}

		return paymentDTOList;
	}

	@Override
	public PaymentDTO getPaymentByTransactionId(String tid) {
		Payment payment = paymentRepository.findByTransactionId(tid);

		return modelMapper.map(payment, PaymentDTO.class);
	}

	@Override
	public PaymentDTO initiatePayment(PaymentDTO paymentDTO) {
		Payment payment = modelMapper.map(paymentDTO, Payment.class);

		// check for any active or successful previous payment for the orderId
		boolean hasActivePayment = paymentRepository.existsByOrderIdAndStatusNot(payment.getOrderId(),
				PaymentStatus.FAILED);

		if (hasActivePayment) {
			throw new IllegalStateException(
					"Cannot initiate new payment. An active or successful payment already exists for Order: "
							+ payment.getOrderId());
		}

		Payment initatedPayment = paymentRepository.save(payment);

		return modelMapper.map(initatedPayment, PaymentDTO.class);
	}

	@Override
	public PaymentDTO updatePayment(Long id, PaymentUpdateDTO paymentUpdateDTO) {
		Payment payment = paymentRepository.findById(id).get();

		if (paymentUpdateDTO.getStatus() != null) {
			payment.setStatus(paymentUpdateDTO.getStatus());
		}

		if (paymentUpdateDTO.getTransactionId() != null) {
			payment.setTransactionId(paymentUpdateDTO.getTransactionId());
		}

		return modelMapper.map(paymentRepository.save(payment), PaymentDTO.class);
	}
}
