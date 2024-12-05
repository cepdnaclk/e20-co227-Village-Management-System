package com.nuwan.LandMapDemo.service.impl;

import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.domain.PersonFund;
import com.nuwan.LandMapDemo.dto.PersonFundDTO;
import com.nuwan.LandMapDemo.repository.PersonFundRepository;
import com.nuwan.LandMapDemo.repository.PersonRepository;
import com.nuwan.LandMapDemo.service.PersonFundService;
import com.nuwan.LandMapDemo.utils.PersonFundUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class PersonFundServiceImpl implements PersonFundService {

    private final PersonFundRepository personFundRepository;
    private final PersonRepository personRepository;

    @Override
    @Transactional
    public PersonFundDTO createPersonFund(PersonFundDTO personFundDTO) {
        PersonFund personFund = new PersonFund();
        System.out.println(personFund);
        personFund.setName(personFundDTO.getName());
        personFund.setAmount(personFundDTO.getAmount());

        PersonFund savedPersonFund = personFundRepository.save(personFund);

        if (personFundDTO.getPersons() != null) {
            for (String personId : personFundDTO.getPersons()) {
                Person person = personRepository.findById(personId)
                        .orElseThrow(() -> new RuntimeException("Person not found with id: " + personId));
                personFund.getPersons().add(person);
                person.getFunds().add(personFund);
                personRepository.save(person);
            }
            personFundRepository.save(personFund);
        }

        return PersonFundUtils.toDTO(savedPersonFund);
    }

    @Override
    @Transactional
    public PersonFundDTO updatePersonFund(Long id, PersonFundDTO personFundDTO) {
        PersonFund personFund = personFundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        personFund.setName(personFundDTO.getName());
        personFund.setAmount(personFundDTO.getAmount());

        // Save updated fund details
        personFundRepository.save(personFund);

        if (personFundDTO.getPersons() != null) {
            for (String personId : personFundDTO.getPersons()) {
                Person person = personRepository.findById(personId)
                        .orElseThrow(() -> new RuntimeException("Person not found with id: " + personId));

                // Check if the person is already associated with the fund
                if (!personFund.getPersons().contains(person)) {
                    personFund.getPersons().add(person);
                    person.getFunds().add(personFund);
                    personRepository.save(person);
                }
            }
            // Save the updated fund only if changes were made
            personFundRepository.save(personFund);
        }

        return PersonFundUtils.toDTO(personFund);
    }

    private void linkPersonsToFund(PersonFund personFund, List<String> personIds) {
        if (personIds != null) {
            System.out.println("funds: " + personFund.getPersons());
            for (String personId : personIds) {
                Person person = personRepository.findById(personId)
                        .orElseThrow(() -> new RuntimeException("Person not found with id: " + personId));
                person.getFunds().add(personFund);
                personFund.getPersons().add(person);
                personRepository.save(person);
            }
        }
        personFundRepository.save(personFund);
    }

    @Override
    @Transactional
    public void deletePersonFund(Long id) {
        PersonFund personFund = personFundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        // Unlink the fund from associated persons
        if (personFund.getPersons() != null) {
            for (Person person : personFund.getPersons()) {
                person.getFunds().remove(personFund);
                personRepository.save(person);
            }
        }

        personFundRepository.delete(personFund);
    }

    @Override
    public PersonFundDTO getPersonFund(Long id) {
        PersonFund personFund = personFundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        return PersonFundUtils.toDTO(personFund);
    }

    @Override
    public List<PersonFundDTO> getAllPersonFunds() {
        List<PersonFund> personFunds = personFundRepository.findAll();
        return personFunds.stream()
                .map(PersonFundUtils::toDTO)
                .toList();
    }


}
