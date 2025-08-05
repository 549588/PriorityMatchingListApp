package com.example.vcserviceorderbkend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.vcserviceorderbkend.dto.EmployeeDTO;
import com.example.vcserviceorderbkend.service.EmployeeService;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/all")
    public ResponseEntity<Object> getAllEmployees() {
        try {
            List<EmployeeDTO> employees = employeeService.getAllEmployees();
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
            .body("An error occurred while retrieving employees: " + e.getMessage());
        }
    }

}
