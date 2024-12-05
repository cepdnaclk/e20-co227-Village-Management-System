package com.nuwan.LandMapDemo.utils;

import com.nuwan.LandMapDemo.domain.Request;
import com.nuwan.LandMapDemo.dto.RequestDTO;

public class RequestUtils {
    public static RequestDTO toDTO(Request request) {
        if (request == null) return null;

        RequestDTO requestDTO = new RequestDTO();
        requestDTO.setId(request.getId());
        requestDTO.setRequestType(request.getRequestType());
        requestDTO.setTime(request.getTime());
        if (request.getEvent() != null) requestDTO.setEvent(request.getEvent().getId());
        if (request.getPerson() != null) requestDTO.setPerson(request.getPerson().getId());

        return requestDTO;
    }
}
