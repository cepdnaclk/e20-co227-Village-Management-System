package com.nuwan.LandMapDemo.utils;

import com.nuwan.LandMapDemo.domain.PersonRelationship;
import com.nuwan.LandMapDemo.dto.PersonRelationshipDTO;

public class PersonRelationshipUtils {
    public static PersonRelationshipDTO toDTO(PersonRelationship relationship) {
        if (relationship == null) return null;
        
        PersonRelationshipDTO dto = new PersonRelationshipDTO();
        dto.setId(relationship.getId());
        dto.setPerson1Id(relationship.getPerson1().getId());
        dto.setPerson1Name(relationship.getPerson1().getName());
        dto.setPerson2Id(relationship.getPerson2().getId());
        dto.setPerson2Name(relationship.getPerson2().getName());
        dto.setRelationshipType(relationship.getRelationshipType());
        return dto;
    }
}

