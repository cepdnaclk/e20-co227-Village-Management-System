package com.nuwan.LandMapDemo.repository;

import com.nuwan.LandMapDemo.domain.House;
import com.nuwan.LandMapDemo.domain.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonRepository extends JpaRepository<Person, String> {

    @Query("SELECT p FROM Person p WHERE " +
            "(:pattern IS NULL OR LOWER(p.id) LIKE LOWER(CONCAT('%', :pattern, '%')) OR " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :pattern, '%')))")
    List<Person> searchPersons(@Param("pattern") String pattern);

    List<Person> findByHouseId(String id);

}
