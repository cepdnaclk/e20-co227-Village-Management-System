package com.nuwan.LandMapDemo.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PersonRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "person1_id", nullable = false)
    private Person person1;

    @ManyToOne
    @JoinColumn(name = "person2_id", nullable = false)
    private Person person2;

    @Enumerated(EnumType.STRING)
    private RelationshipType relationshipType;

    public enum RelationshipType {
        FATHER,
        MOTHER,
        SON,
        DAUGHTER,
        HUSBAND,
        WIFE,
        BROTHER,
        SISTER,
        GRANDFATHER,
        GRANDMOTHER,
        GRANDSON,
        GRANDDAUGHTER,
        UNCLE,
        AUNT,
        NEPHEW,
        NIECE,
        COUSIN,
        FATHER_IN_LAW,
        MOTHER_IN_LAW,
        SON_IN_LAW,
        DAUGHTER_IN_LAW,
        OTHER
    }
}

