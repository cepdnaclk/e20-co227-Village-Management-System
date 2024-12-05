package com.nuwan.LandMapDemo.service.impl;

import com.nuwan.LandMapDemo.domain.Complain;
import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.dto.ComplainDTO;
import com.nuwan.LandMapDemo.repository.ComplainRepository;
import com.nuwan.LandMapDemo.repository.PersonRepository;
import com.nuwan.LandMapDemo.service.ComplainService;
import com.nuwan.LandMapDemo.utils.ComplainUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplainServiceImpl implements ComplainService {

    private final ComplainRepository complainRepository;
    private final PersonRepository personRepository;

    @Override
    @Transactional
    public boolean createComplain(ComplainDTO complainDTO) {
        Person person = personRepository.findById(complainDTO.getPerson())
                .orElse(null);

        if (person == null) {
            // Return false if the associated person is not found
            return false;
        }

        Complain complain = new Complain();
        complain.setPerson(person);
        complain.setComplain(complainDTO.getComplain());
        complain.setCompleteTime(complainDTO.getCompleteTime());

        complainRepository.save(complain);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ComplainDTO> getAllComplains(int page, int size, String orderBy, String order, String searchTerm) {
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.fromString(order), orderBy);

        Page<Complain> complainPage = (searchTerm != null && !searchTerm.trim().isEmpty())
                ? complainRepository.searchComplains(searchTerm, pageable)
                : complainRepository.findAll(pageable);

        return complainPage.map(ComplainUtils::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ComplainDTO getComplainById(Long id) {
        return complainRepository.findById(id)
                .map(ComplainUtils::toDTO)
                .orElse(null);  // Return null if complain not found
    }

    @Override
    @Transactional
    public ComplainDTO updateComplain(Long id, ComplainDTO complainDTO) {
        return complainRepository.findById(id)
                .map(complain -> {
                    complain.setComplain(complainDTO.getComplain());
                    complain.setCompleteTime(complainDTO.getCompleteTime());
                    complain.setStatus(complainDTO.getStatus());
                    complain.setNotes(complainDTO.getNotes());

                    Complain updatedComplain = complainRepository.save(complain);
                    return ComplainUtils.toDTO(updatedComplain);
                })
                .orElse(null);  // Return null if complain not found
    }

    @Override
    @Transactional
    public boolean deleteComplain(Long id) {
        if (complainRepository.existsById(id)) {
            complainRepository.deleteById(id);
            return true;
        }
        return false;  // Return false if complain not found
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplainDTO> getAllComplains(String orderBy, String order, String searchTerm) {
        Sort sort = Sort.by(Sort.Direction.fromString(order), orderBy);

        List<Complain> complains = (searchTerm != null && !searchTerm.trim().isEmpty())
                ? complainRepository.searchComplains(searchTerm, sort)
                : complainRepository.findAll(sort);

        return complains.stream().map(ComplainUtils::toDTO).collect(Collectors.toList());
    }
}
