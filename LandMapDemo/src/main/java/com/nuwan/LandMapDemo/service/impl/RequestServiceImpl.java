package com.nuwan.LandMapDemo.service.impl;

import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.domain.Request;
import com.nuwan.LandMapDemo.dto.RequestDTO;
import com.nuwan.LandMapDemo.repository.PersonRepository;
import com.nuwan.LandMapDemo.repository.RequestRepository;
import com.nuwan.LandMapDemo.service.RequestService;
import com.nuwan.LandMapDemo.utils.RequestUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class RequestServiceImpl implements RequestService {

    private final RequestRepository requestRepository;
    private final PersonRepository personRepository;

    @Override
    @Transactional
    public RequestDTO createRequest(RequestDTO requestDTO) {
        try {
            Optional<Person> personOpt = personRepository.findById(requestDTO.getPerson());
            if (personOpt.isEmpty()) {
                return null;
            }
            
            Request request = new Request();
            request.setPerson(personOpt.get());
            request.setRequestType(requestDTO.getRequestType());
            
            Request saved = requestRepository.save(request);
            return RequestUtils.toDTO(saved);
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }

    @Override
    public RequestDTO getRequestById(Long id) {
        return requestRepository.findById(id)
                .map(RequestUtils::toDTO)
                .orElse(null);
    }

    @Override
    public List<RequestDTO> getAllRequests() {
        return requestRepository.findAll()
                .stream()
                .map(RequestUtils::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RequestDTO> getRequestsByPersonId(String personId) {
        Optional<Person> personOpt = personRepository.findById(personId);
        if (personOpt.isEmpty()) {
            return List.of();
        }
        
        return requestRepository.findAll()
                .stream()
                .filter(r -> r.getPerson().getId().equals(personId))
                .map(RequestUtils::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RequestDTO updateRequest(Long id, RequestDTO requestDTO) {
        try {
            Optional<Request> requestOpt = requestRepository.findById(id);
            if (requestOpt.isEmpty()) {
                return null;
            }
            
            Request request = requestOpt.get();
            if (requestDTO.getRequestType() != null) {
                request.setRequestType(requestDTO.getRequestType());
            }
            
            Request updated = requestRepository.save(request);
            return RequestUtils.toDTO(updated);
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }

    @Override
    @Transactional
    public boolean deleteRequest(Long id) {
        try {
            requestRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }

    @Override
    public List<RequestDTO> getRequestsByType(Request.RequestType requestType) {
        return requestRepository.findAll()
                .stream()
                .filter(r -> r.getRequestType() == requestType)
                .map(RequestUtils::toDTO)
                .collect(Collectors.toList());
    }
}
