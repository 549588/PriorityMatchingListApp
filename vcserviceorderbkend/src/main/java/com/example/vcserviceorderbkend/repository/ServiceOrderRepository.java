package com.example.vcserviceorderbkend.repository;

import com.example.vcserviceorderbkend.entity.ServiceOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Integer> {

    @Query(value = "SELECT MAX(so.serviceorderid) FROM serviceorder so", nativeQuery = true)
    Optional<Integer> findMaxServiceOrderId();
}
