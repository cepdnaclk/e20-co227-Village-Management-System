package com.nuwan.LandMapDemo.service;

import com.nuwan.LandMapDemo.domain.Request;
import com.nuwan.LandMapDemo.dto.RequestDTO;

import java.util.List;

public interface RequestService {
    RequestDTO createRequest(RequestDTO requestDTO);
    RequestDTO getRequestById(Long id);
    List<RequestDTO> getAllRequests();
    List<RequestDTO> getRequestsByPersonId(String personId);
    RequestDTO updateRequest(Long id, RequestDTO requestDTO);
    boolean deleteRequest(Long id);
    List<RequestDTO> getRequestsByType(Request.RequestType requestType);
}
