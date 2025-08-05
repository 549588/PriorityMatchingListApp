package com.example.vcserviceorderbkend.repository;

import com.example.vcserviceorderbkend.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Integer> {
    @Query(value = "SELECT MAX(s.skillid) FROM skill s", nativeQuery = true)
    Optional<Integer> findMaxSkillId();

}
