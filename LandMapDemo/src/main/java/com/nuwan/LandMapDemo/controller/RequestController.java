package com.nuwan.LandMapDemo.controller;

import com.nuwan.LandMapDemo.domain.Request;
import com.nuwan.LandMapDemo.dto.RequestDTO;
import com.nuwan.LandMapDemo.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/request")
public class RequestController {

    private final RequestService requestService;

    @PostMapping
    public ResponseEntity<RequestDTO> createRequest(@RequestBody RequestDTO requestDTO) {
        RequestDTO created = requestService.createRequest(requestDTO);
        if (created != null) {
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping
    public ResponseEntity<List<RequestDTO>> getAllRequests() {
        List<RequestDTO> requests = requestService.getAllRequests();
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestDTO> getRequestById(@PathVariable Long id) {
        RequestDTO request = requestService.getRequestById(id);
        if (request != null) {
            return new ResponseEntity<>(request, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/person/{personId}")
    public ResponseEntity<List<RequestDTO>> getRequestsByPersonId(@PathVariable String personId) {
        List<RequestDTO> requests = requestService.getRequestsByPersonId(personId);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<RequestDTO>> getRequestsByType(@PathVariable String type) {
        try {
            Request.RequestType requestType = Request.RequestType.valueOf(type);
            List<RequestDTO> requests = requestService.getRequestsByType(requestType);
            return new ResponseEntity<>(requests, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RequestDTO> updateRequest(@PathVariable Long id, @RequestBody RequestDTO requestDTO) {
        RequestDTO updated = requestService.updateRequest(id, requestDTO);
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        if (requestService.deleteRequest(id)) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
