package com.example.vcserviceorderbkend.service;

import com.example.vcserviceorderbkend.dto.EmployeeDTO;
import com.example.vcserviceorderbkend.dto.SkillDTO;
import com.example.vcserviceorderbkend.entity.Employee;
import com.example.vcserviceorderbkend.entity.Skill;
import com.example.vcserviceorderbkend.repository.EmployeeRepository;
import com.example.vcserviceorderbkend.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    public List<SkillDTO> getAllSkills() {
        // Logic to retrieve all employees
        List<Skill> skills = skillRepository.findAll();
        return skills.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private SkillDTO convertToDTO(Skill skill) {
        SkillDTO dto = new SkillDTO();
        dto.setSkillId(skill.getSkillId());
        dto.setSkillDetails(skill.getSkillName() +  " - " + skill.getSkillDescription());
        return dto;
    }
}
