package com.nuwan.LandMapDemo.service.impl;

import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.domain.PersonRelationship;
import com.nuwan.LandMapDemo.dto.PersonRelationshipDTO;
import com.nuwan.LandMapDemo.repository.PersonRepository;
import com.nuwan.LandMapDemo.repository.PersonRelationshipRepository;
import com.nuwan.LandMapDemo.service.PersonRelationshipService;
import com.nuwan.LandMapDemo.utils.PersonRelationshipUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PersonRelationshipServiceImpl implements PersonRelationshipService {

    private final PersonRelationshipRepository relationshipRepository;
    private final PersonRepository personRepository;

    @Override
    @Transactional
    public PersonRelationshipDTO createRelationship(PersonRelationshipDTO relationshipDTO) {
        try {
            Optional<Person> person1Opt = personRepository.findById(relationshipDTO.getPerson1Id());
            Optional<Person> person2Opt = personRepository.findById(relationshipDTO.getPerson2Id());
            
            if (person1Opt.isEmpty() || person2Opt.isEmpty()) {
                return null;
            }
            
            PersonRelationship relationship = new PersonRelationship();
            relationship.setPerson1(person1Opt.get());
            relationship.setPerson2(person2Opt.get());
            relationship.setRelationshipType(relationshipDTO.getRelationshipType());
            
            PersonRelationship saved = relationshipRepository.save(relationship);
            return PersonRelationshipUtils.toDTO(saved);
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }

    @Override
    public List<PersonRelationshipDTO> getRelationshipsByPersonId(String personId) {
        return relationshipRepository.findAllRelationshipsByPersonId(personId)
                .stream()
                .map(PersonRelationshipUtils::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PersonRelationshipDTO getRelationshipById(Long id) {
        return relationshipRepository.findById(id)
                .map(PersonRelationshipUtils::toDTO)
                .orElse(null);
    }

    @Override
    @Transactional
    public boolean deleteRelationship(Long id) {
        try {
            relationshipRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }

    @Override
    @Transactional
    public PersonRelationshipDTO updateRelationship(Long id, PersonRelationshipDTO relationshipDTO) {
        try {
            Optional<PersonRelationship> existingOpt = relationshipRepository.findById(id);
            if (existingOpt.isEmpty()) {
                return null;
            }
            
            PersonRelationship existing = existingOpt.get();
            Optional<Person> person1Opt = personRepository.findById(relationshipDTO.getPerson1Id());
            Optional<Person> person2Opt = personRepository.findById(relationshipDTO.getPerson2Id());
            
            if (person1Opt.isEmpty() || person2Opt.isEmpty()) {
                return null;
            }
            
            existing.setPerson1(person1Opt.get());
            existing.setPerson2(person2Opt.get());
            existing.setRelationshipType(relationshipDTO.getRelationshipType());
            
            PersonRelationship updated = relationshipRepository.save(existing);
            return PersonRelationshipUtils.toDTO(updated);
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }

    @Override
    public List<PersonRelationshipDTO> findRelationshipBetweenPersons(String person1Id, String person2Id) {
        return relationshipRepository.findRelationshipBetweenPersons(person1Id, person2Id)
                .stream()
                .map(PersonRelationshipUtils::toDTO)
                .collect(Collectors.toList());
    }
}

