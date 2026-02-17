package com.incedo.service;

import java.util.List;

import com.incedo.DTO.LoginRequestDTO;
import com.incedo.DTO.RegisterRequestDTO;
import com.incedo.entity.User;

public interface UserService {

    User register(RegisterRequestDTO request);

    String login(LoginRequestDTO request);

    User getUserByEmail(String email);

    List<User> getAllUsers();
}
