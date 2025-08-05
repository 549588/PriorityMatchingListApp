package com.example.vcserviceorderbkend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.util.Set;

@Entity(name = "serviceorder")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceOrder {
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "serviceorderid")
    private Integer serviceOrderId; // Primary key with identity generation
    @Column(name = "accountname", length = 255)
    private String accountName;
    @Column(name = "location", length = 100)
    private String location;
    @Column(name = "ccarole", length = 100)
    private String ccaRole;
    @Column(name = "hiringmanager")
    private Integer hiringManager;
    @Column(name = "requiredfrom")
    private Date requiredFrom;
    @Column(name = "clientevaluation")
    private String clientEvaluation;
    @Column(name = "sostate", length = 50)
    private String soState;
    @Column(name = "assignedtoresource")
    private Integer assignedToResource;
    @Column(name = "grade", length = 50)
    private String grade;
    @OneToMany(mappedBy = "serviceOrder")
    private Set<ServiceOrderSkills> serviceOrderSkills;
}