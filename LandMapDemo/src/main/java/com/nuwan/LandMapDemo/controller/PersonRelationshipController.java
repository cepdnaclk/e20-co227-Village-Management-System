package com.nuwan.LandMapDemo.controller;

import com.nuwan.LandMapDemo.dto.PersonRelationshipDTO;
import com.nuwan.LandMapDemo.service.PersonRelationshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/relationships")
@RequiredArgsConstructor
public class PersonRelationshipController {

    private final PersonRelationshipService relationshipService;

    @PostMapping
    public ResponseEntity<PersonRelationshipDTO> createRelationship(@RequestBody PersonRelationshipDTO relationshipDTO) {
        PersonRelationshipDTO created = relationshipService.createRelationship(relationshipDTO);
        if (created != null) {
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/person/{personId}")
    public ResponseEntity<List<PersonRelationshipDTO>> getRelationshipsByPersonId(@PathVariable String personId) {
        List<PersonRelationshipDTO> relationships = relationshipService.getRelationshipsByPersonId(personId);
        return new ResponseEntity<>(relationships, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonRelationshipDTO> getRelationshipById(@PathVariable Long id) {
        PersonRelationshipDTO relationship = relationshipService.getRelationshipById(id);
        if (relationship != null) {
            return new ResponseEntity<>(relationship, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/between/{person1Id}/{person2Id}")
    public ResponseEntity<List<PersonRelationshipDTO>> getRelationshipBetweenPersons(
            @PathVariable String person1Id,
            @PathVariable String person2Id) {
        List<PersonRelationshipDTO> relationships = relationshipService.findRelationshipBetweenPersons(person1Id, person2Id);
        return new ResponseEntity<>(relationships, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonRelationshipDTO> updateRelationship(
            @PathVariable Long id,
            @RequestBody PersonRelationshipDTO relationshipDTO) {
        PersonRelationshipDTO updated = relationshipService.updateRelationship(id, relationshipDTO);
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRelationship(@PathVariable Long id) {
        if (relationshipService.deleteRelationship(id)) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

