package com.nuwan.LandMapDemo.repository;

import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.domain.PersonRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonRelationshipRepository extends JpaRepository<PersonRelationship, Long> {
    List<PersonRelationship> findByPerson1(Person person);
    List<PersonRelationship> findByPerson2(Person person);
    
    @Query("SELECT pr FROM PersonRelationship pr WHERE pr.person1.id = :personId OR pr.person2.id = :personId")
    List<PersonRelationship> findAllRelationshipsByPersonId(@Param("personId") String personId);
    
    @Query("SELECT pr FROM PersonRelationship pr WHERE " +
           "(pr.person1.id = :person1Id AND pr.person2.id = :person2Id) OR " +
           "(pr.person1.id = :person2Id AND pr.person2.id = :person1Id)")
    List<PersonRelationship> findRelationshipBetweenPersons(@Param("person1Id") String person1Id, 
                                                             @Param("person2Id") String person2Id);
}

