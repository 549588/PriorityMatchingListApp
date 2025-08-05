package com.example.vcserviceorderbkend.dto;

import lombok.Data;

@Data
public class SkillDTO {
    private Integer skillId;
    private String skillDetails;
    private String mandatory;
    private Integer skillLevel;
}