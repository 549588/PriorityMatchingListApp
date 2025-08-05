package com.example.vcserviceorderbkend.entity;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employeeid")
    private int employeeId; // Primary key
    @Column(name = "firstname", length = 100)
    private String firstName;
    @Column(name = "lastname", length = 100)
    private String lastName;
    @Column(name = "supervisorid")
    private Integer supervisorId;
    @Column (name="emailid", length = 255)
    private String emailId;
    @Column(name = "dateofjoin")
    private Date dateOfJoin;
    @Column(name="grade", length = 50)
    private String grade;
    @Column(name="location", length = 100)
    private String location;
    @Column(name="locationpreference", length = 255)
    private String locationpreference;
    @Column(name="availablefordeployment")
    private int availablefordeployment;



}
