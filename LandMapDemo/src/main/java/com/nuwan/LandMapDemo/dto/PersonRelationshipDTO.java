package com.nuwan.LandMapDemo.dto;

import com.nuwan.LandMapDemo.domain.PersonRelationship;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PersonRelationshipDTO {
    private Long id;
    private String person1Id;
    private String person1Name;
    private String person2Id;
    private String person2Name;
    private PersonRelationship.RelationshipType relationshipType;
}

