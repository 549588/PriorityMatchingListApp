package com.example.vcserviceorderbkend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity(name = "serviceorderskills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceOrderSkills {
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "soskillid")
    private Integer soSkillId; // Primary key with identity generation
    /* 
    @ManyToOne
    @JoinColumn(name = "serviceorderid", referencedColumnName = "serviceOrderId")
    private ServiceOrder serviceOrder; // Many-to-one relationship with ServiceOrder
    */
    //@OneToMany(mappedBy = "serviceOrderSkills")
    @ManyToOne
    @JoinColumn(name = "skillid", nullable = false)
    private Skill skill;
    //private List<Skill> skills; // One-to-many relationship with Skill
    @ManyToOne
    @JoinColumn(name = "serviceorderid", nullable = false)
    private ServiceOrder serviceOrder;
    @Column(name = "mandatory")
    private Integer mandatory;
    @Column(name = "skilllevel")
    private Integer skillLevel;
}