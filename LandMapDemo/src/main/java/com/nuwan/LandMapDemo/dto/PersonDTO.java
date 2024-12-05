package com.nuwan.LandMapDemo.dto;

import com.nuwan.LandMapDemo.domain.Person;
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
public class PersonDTO {

    private String id;

    private String name;

    private String occupation;

    private LocalDate dob;

    private String phoneNumber;

    private Person.Gender gender;

    private String behavior;

    private String health;

    private String religion;

    private String nation;

    private double income;

    private List<Long> funds;

    private String house;

    private List<Long> lands;

    private List<Long> complains;

}
