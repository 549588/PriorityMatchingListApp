package com.example.vcserviceorderbkend.repository;

import com.example.vcserviceorderbkend.entity.ServiceOrderSkills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceOrderSkillsRepository extends JpaRepository<ServiceOrderSkills, Integer> {

    @Query(value = "SELECT MAX(sos.soskillid) FROM serviceorderskills sos", nativeQuery = true)
    Optional<Integer> findMaxServiceOrderSkillsId();

}