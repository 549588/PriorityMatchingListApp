package com.example.vcserviceorderbkend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;

@Data
public class ServiceOrderDTO {
    private String accountName;
    private String location;
    private String hiringManager;
    private String ccaRole;
    private LocalDate requiredFrom;
    private boolean clientEval;
    private ArrayList<SkillDTO> skills;
    private String soState;
    private String assignedToResource;
    private String grade;   
}