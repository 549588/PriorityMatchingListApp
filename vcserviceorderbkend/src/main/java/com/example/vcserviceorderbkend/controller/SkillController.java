package com.example.vcserviceorderbkend.controller;

import com.example.vcserviceorderbkend.dto.EmployeeDTO;
import com.example.vcserviceorderbkend.dto.SkillDTO;
import com.example.vcserviceorderbkend.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @GetMapping("/all")
    public ResponseEntity<Object> getAllSkills() {
        try {
            List<SkillDTO> skills = skillService.getAllSkills();
            return ResponseEntity.ok(skills);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("An error occurred while retrieving skills: " + e.getMessage());
        }
    }
}
