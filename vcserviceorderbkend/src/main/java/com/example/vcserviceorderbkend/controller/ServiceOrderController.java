package com.example.vcserviceorderbkend.controller;

import com.example.vcserviceorderbkend.dto.ServiceOrderDTO;
import com.example.vcserviceorderbkend.service.ServiceOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/serviceorders")
public class ServiceOrderController {

    @Autowired
    private ServiceOrderService serviceOrderService;

    /**
     * Endpoint to create a new service order.
     *
     * @param serviceOrderDTO the service order data transfer object
     * @return ResponseEntity with success message or error message
     */
    @PostMapping
    public ResponseEntity<String> createServiceOrder(@RequestBody ServiceOrderDTO serviceOrderDTO) {
        try {
            System.out.println("Received Service Order: " + serviceOrderDTO);
            boolean isSaved = serviceOrderService.saveServiceOrder(serviceOrderDTO);
            if (isSaved) {
                // Return success message
                return ResponseEntity.ok("Service order created successfully");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to create service order");
            }
        } catch (Exception e) {
            // Handle any unexpected exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while creating the service order: " + e.getMessage());
        }
    }
 

}
