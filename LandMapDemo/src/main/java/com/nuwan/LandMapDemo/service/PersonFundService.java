package com.nuwan.LandMapDemo.service;

import com.nuwan.LandMapDemo.dto.PersonFundDTO;
import jakarta.transaction.Transactional;

import java.util.List;

public interface PersonFundService {
    @Transactional
    PersonFundDTO createPersonFund(PersonFundDTO personFundDTO);

    @Transactional
    PersonFundDTO updatePersonFund(Long id, PersonFundDTO personFundDTO);

    @Transactional
    void deletePersonFund(Long id);

    PersonFundDTO getPersonFund(Long id);

    List<PersonFundDTO> getAllPersonFunds();
}
