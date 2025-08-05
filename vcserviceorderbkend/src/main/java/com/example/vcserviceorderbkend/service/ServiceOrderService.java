package com.example.vcserviceorderbkend.service;

import com.example.vcserviceorderbkend.dto.ServiceOrderDTO;
import com.example.vcserviceorderbkend.entity.ServiceOrder;
import com.example.vcserviceorderbkend.entity.ServiceOrderSkills;
import com.example.vcserviceorderbkend.entity.Skill;
import com.example.vcserviceorderbkend.repository.ServiceOrderRepository;
import com.example.vcserviceorderbkend.repository.ServiceOrderSkillsRepository;
import com.example.vcserviceorderbkend.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class ServiceOrderService {

    @Autowired
    private ServiceOrderRepository serviceOrderRepository;

    @Autowired
    private ServiceOrderSkillsRepository serviceOrderSkillsRepository;

    @Autowired
    private SkillRepository skillRepository;

    public boolean saveServiceOrder(ServiceOrderDTO serviceOrderDTO) throws Exception {
        try {
            // Parse and save ServiceOrder
            ServiceOrder serviceOrder = new ServiceOrder();
            serviceOrder.setAccountName(serviceOrderDTO.getAccountName());
            serviceOrder.setLocation(serviceOrderDTO.getLocation());
            serviceOrder.setCcaRole(serviceOrderDTO.getCcaRole());
            serviceOrder.setHiringManager(serviceOrderDTO.getHiringManager()!= null
                    && !serviceOrderDTO.getHiringManager().isEmpty()
                    ? Integer.valueOf(serviceOrderDTO.getHiringManager()): null);

            //long datetime = serviceOrderDTO.getRequiredFrom() != null ? serviceOrderDTO.getRequiredFrom().toEpochDay(): 0;
            serviceOrder.setRequiredFrom(serviceOrderDTO.getRequiredFrom() != null ?
                    Date.valueOf(serviceOrderDTO.getRequiredFrom()) : null);
            serviceOrder.setClientEvaluation(serviceOrderDTO.isClientEval() ? "Yes" : "No");
            serviceOrder.setSoState(serviceOrderDTO.getSoState());
            serviceOrder.setAssignedToResource(serviceOrderDTO.getAssignedToResource()!= null
                    && !serviceOrderDTO.getAssignedToResource().isEmpty()
                    ? Integer.valueOf(serviceOrderDTO.getAssignedToResource()): null);
            serviceOrder.setGrade(serviceOrderDTO.getGrade());
            Integer soId = serviceOrderRepository.findMaxServiceOrderId().orElse(1);
            serviceOrder.setServiceOrderId(soId+1);
            serviceOrderRepository.save(serviceOrder);

            // Parse and save Skills
            serviceOrderDTO.getSkills().forEach(skillDTO -> {
                
                Skill skill = skillRepository.findById(skillDTO.getSkillId()).orElseThrow();
                //skill.setSkillName(skillDTO.getSkillDetails().split("-")[0]);

                //skill.setSkillDescription(skillDTO.getSkillDetails().split("-")[1]);
                //skill.setServiceOrderSkills(serviceOrderSkills);
                //Integer sid = skillRepository.findMaxSkillId().orElse(1);
                //skill.setSkillId(sid+1);
                //skill = skillRepository.save(skill);

                ServiceOrderSkills serviceOrderSkills = new ServiceOrderSkills();
                serviceOrderSkills.setServiceOrder(serviceOrder);
                serviceOrderSkills.setSkill(skill);
                serviceOrderSkills.setMandatory(skillDTO.getMandatory() != null && skillDTO.getMandatory().equalsIgnoreCase("yes") ? 1 : 0);
                serviceOrderSkills.setSkillLevel(skillDTO.getSkillLevel());
                //serviceOrderSkills = serviceOrderSkillsRepository.save(serviceOrderSkills);

                Integer sosId = serviceOrderSkillsRepository.findMaxServiceOrderSkillsId().orElse(1);
                serviceOrderSkills.setSoSkillId(sosId+1);
                serviceOrderSkills = serviceOrderSkillsRepository.save(serviceOrderSkills);

            });

            // Parse and save ServiceOrderSkills
            
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }
}