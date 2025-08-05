package com.example.vcserviceorderbkend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.vcserviceorderbkend.dto.EmployeeDTO;
import com.example.vcserviceorderbkend.entity.Employee;
import com.example.vcserviceorderbkend.repository.EmployeeRepository;

@Service
public class EmployeeService {

    // Autowire the EmployeeRepository here
    @Autowired
    private EmployeeRepository employeeRepository;

    public List<EmployeeDTO> getAllEmployees() {
        // Logic to retrieve all employees
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private EmployeeDTO convertToDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setEmployeeId(employee.getEmployeeId());
        dto.setEmployeeName(employee.getEmployeeId() + " - " + employee.getFirstName() + " " + employee.getLastName());
        return dto;
    }



}
