package com.nuwan.LandMapDemo.utils;

import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.domain.PersonFund;
import com.nuwan.LandMapDemo.dto.PersonFundDTO;

import java.util.stream.Collectors;

public class PersonFundUtils {

    public static PersonFundDTO toDTO(PersonFund personFund) {
        PersonFundDTO personFundDTO = new PersonFundDTO();
        personFundDTO.setId(personFund.getId());
        personFundDTO.setName(personFund.getName());
        personFundDTO.setAmount(personFund.getAmount());
        personFundDTO.setUpdatedTime(personFund.getUpdatedTime());

        personFundDTO.setPersons(personFund.getPersons()
                .stream()
                .map(Person::getId)
                .collect(Collectors.toList()));

        return personFundDTO;
    }

}
