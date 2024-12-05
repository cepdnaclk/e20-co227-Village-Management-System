package com.nuwan.LandMapDemo.utils;

import com.nuwan.LandMapDemo.domain.Complain;
import com.nuwan.LandMapDemo.domain.Land;
import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.domain.PersonFund;
import com.nuwan.LandMapDemo.dto.PersonDTO;

import java.util.stream.Collectors;

public class PersonUtils {
    public static PersonDTO toDTO(Person person) {
        PersonDTO personDTO = new PersonDTO();
        personDTO.setId(person.getId());
        personDTO.setName(person.getName());
        personDTO.setOccupation(person.getOccupation());
        personDTO.setDob(person.getDob());
        personDTO.setPhoneNumber(person.getPhoneNumber());
        personDTO.setIncome(person.getIncome());

        if (person.getHouse() != null) personDTO.setHouse(person.getHouse().getId());

        personDTO.setLands(person.getLands()
                .stream()
                .map(Land::getId)
                .collect(Collectors.toList()));

        personDTO.setFunds(person.getFunds()
                .stream()
                .map(PersonFund::getId)
                .collect(Collectors.toList()));

        personDTO.setComplains(person.getComplains()
                .stream()
                .map(Complain::getId)
                .collect(Collectors.toList()));

        return personDTO;
    }
}
