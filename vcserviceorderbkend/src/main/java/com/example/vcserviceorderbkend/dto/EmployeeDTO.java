package com.example.vcserviceorderbkend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDTO {

    private int employeeId;
    private String employeeName;    

}
