package com.nuwan.LandMapDemo.service;

import com.nuwan.LandMapDemo.dto.ComplainDTO;
import org.springframework.data.domain.Page;

import java.net.ContentHandler;
import java.util.List;

public interface ComplainService {
    boolean createComplain(ComplainDTO complainDTO);
//    Page<ComplainDTO> getAllComplains(int page, int size, String orderBy, String order);

    Page<ComplainDTO> getAllComplains(int page, int size, String orderBy, String order, String searchTerm);

    ComplainDTO getComplainById(Long id);

    ComplainDTO updateComplain(Long id, ComplainDTO complainDTO);

    boolean deleteComplain(Long id);

    List<ComplainDTO> getAllComplains(String orderBy, String order, String searchTerm);

//    List<ComplainDTO> searchComplains(String keyword);
}
