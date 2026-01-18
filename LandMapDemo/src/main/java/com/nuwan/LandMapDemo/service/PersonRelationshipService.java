package com.nuwan.LandMapDemo.service;

import com.nuwan.LandMapDemo.dto.PersonRelationshipDTO;

import java.util.List;

public interface PersonRelationshipService {
    PersonRelationshipDTO createRelationship(PersonRelationshipDTO relationshipDTO);
    List<PersonRelationshipDTO> getRelationshipsByPersonId(String personId);
    PersonRelationshipDTO getRelationshipById(Long id);
    boolean deleteRelationship(Long id);
    PersonRelationshipDTO updateRelationship(Long id, PersonRelationshipDTO relationshipDTO);
    List<PersonRelationshipDTO> findRelationshipBetweenPersons(String person1Id, String person2Id);
}

