package com.example.vcserviceorderbkend.entity;

import java.util.Set;

// Import necessary JPA and Lombok annotations
import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Skill {
    //Create a Skill entity with fields skillName and skillDesc
    //Use Lombok annotations for getters, setters, and constructors
    //Use @Entity annotation to mark it as a JPA entity
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="skillid")
    private Integer skillId; // Primary key with identity generation
    @Column(name="skillname")
    private String skillName;
    @Column(name="skilldescription")
    private String skillDescription;
    @OneToMany(mappedBy = "skill")
    //@JoinColumn(name = "soskillid")
    private Set<ServiceOrderSkills> serviceOrderSkills;
}
