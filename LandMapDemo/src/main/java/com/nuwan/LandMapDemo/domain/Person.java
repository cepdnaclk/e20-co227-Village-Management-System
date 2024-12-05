package com.nuwan.LandMapDemo.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Person {

    @Id
    private String id;

    private String name;

    private String occupation;

    private LocalDate dob;

    private String phoneNumber;

    private Gender gender;

    private String behavior;

    private String health;

    private String religion;

    private String nation;

    private double income;

    @ManyToMany
    @JoinTable(
            joinColumns = @JoinColumn(name = "person_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "fund_id", referencedColumnName = "id")
    )
    private List<PersonFund> funds;

    @ManyToOne
    @JoinColumn(name = "house_id")
    private House house;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.MERGE)
    private List<Land> lands;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL)
    List<Complain> complains;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL)
    List<Request> requests;

    public enum Gender {MALE, FEMALE}

}
