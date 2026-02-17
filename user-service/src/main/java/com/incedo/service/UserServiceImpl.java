package com.incedo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.incedo.DTO.LoginRequestDTO;
import com.incedo.DTO.RegisterRequestDTO;
import com.incedo.entity.User;
import com.incedo.repository.UserRepository;
import com.incedo.security.JwtUtil;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Register
    @Override
    public User register(RegisterRequestDTO request) {

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        // encrypt password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    // Login
    @Override
    public String login(LoginRequestDTO request) {

    	Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return null;
        }

        User user = optionalUser.get();

        boolean valid = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!valid) {
            return null;
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole());
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
