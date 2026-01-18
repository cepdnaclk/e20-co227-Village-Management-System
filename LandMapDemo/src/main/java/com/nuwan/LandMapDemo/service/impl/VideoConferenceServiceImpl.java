package com.nuwan.LandMapDemo.service.impl;

import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.domain.Request;
import com.nuwan.LandMapDemo.domain.VideoConference;
import com.nuwan.LandMapDemo.dto.VideoConferenceDTO;
import com.nuwan.LandMapDemo.repository.PersonRepository;
import com.nuwan.LandMapDemo.repository.RequestRepository;
import com.nuwan.LandMapDemo.repository.VideoConferenceRepository;
import com.nuwan.LandMapDemo.service.VideoConferenceService;
import com.nuwan.LandMapDemo.utils.VideoConferenceUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class VideoConferenceServiceImpl implements VideoConferenceService {

    private final VideoConferenceRepository conferenceRepository;
    private final PersonRepository personRepository;
    private final RequestRepository requestRepository;

    @Override
    @Transactional
    public VideoConferenceDTO scheduleConference(VideoConferenceDTO conferenceDTO) {
        try {
            Optional<Person> gramaNiladhariOpt = personRepository.findById(conferenceDTO.getGramaNiladhariId());
            Optional<Person> villagerOpt = personRepository.findById(conferenceDTO.getVillagerId());
            
            if (gramaNiladhariOpt.isEmpty() || villagerOpt.isEmpty()) {
                return null;
            }
            
            VideoConference conference = new VideoConference();
            conference.setGramaNiladhari(gramaNiladhariOpt.get());
            conference.setVillager(villagerOpt.get());
            conference.setTitle(conferenceDTO.getTitle());
            conference.setDescription(conferenceDTO.getDescription());
            conference.setScheduledDateTime(conferenceDTO.getScheduledDateTime());
            conference.setStatus(VideoConference.ConferenceStatus.SCHEDULED);
            conference.setNotes(conferenceDTO.getNotes());
            
            if (conferenceDTO.getRelatedRequestId() != null) {
                Optional<Request> requestOpt = requestRepository.findById(conferenceDTO.getRelatedRequestId());
                requestOpt.ifPresent(conference::setRelatedRequest);
            }
            
            // Generate meeting link and credentials
            String meetingId = UUID.randomUUID().toString();
            String meetingPassword = UUID.randomUUID().toString().substring(0, 8);
            conference.setMeetingId(meetingId);
            conference.setMeetingPassword(meetingPassword);
            conference.setMeetingLink(generateMeetingLink(meetingId));
            
            VideoConference saved = conferenceRepository.save(conference);
            return VideoConferenceUtils.toDTO(saved);
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }

    @Override
    public VideoConferenceDTO getConferenceById(Long id) {
        return conferenceRepository.findById(id)
                .map(VideoConferenceUtils::toDTO)
                .orElse(null);
    }

    @Override
    public List<VideoConferenceDTO> getConferencesByGramaNiladhariId(String gramaNiladhariId) {
        Optional<Person> personOpt = personRepository.findById(gramaNiladhariId);
        if (personOpt.isEmpty()) {
            return List.of();
        }
        
        return conferenceRepository.findByGramaNiladhari(personOpt.get())
                .stream()
                .map(VideoConferenceUtils::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VideoConferenceDTO> getConferencesByVillagerId(String villagerId) {
        Optional<Person> personOpt = personRepository.findById(villagerId);
        if (personOpt.isEmpty()) {
            return List.of();
        }
        
        return conferenceRepository.findByVillager(personOpt.get())
                .stream()
                .map(VideoConferenceUtils::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VideoConferenceDTO> getUpcomingConferences(String gramaNiladhariId) {
        return conferenceRepository.findUpcomingByGramaNiladhari(gramaNiladhariId, LocalDateTime.now())
                .stream()
                .map(VideoConferenceUtils::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public VideoConferenceDTO updateConferenceStatus(Long id, String status) {
        try {
            Optional<VideoConference> conferenceOpt = conferenceRepository.findById(id);
            if (conferenceOpt.isEmpty()) {
                return null;
            }
            
            VideoConference conference = conferenceOpt.get();
            try {
                conference.setStatus(VideoConference.ConferenceStatus.valueOf(status.toUpperCase()));
            } catch (IllegalArgumentException e) {
                return null;
            }
            
            VideoConference updated = conferenceRepository.save(conference);
            return VideoConferenceUtils.toDTO(updated);
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }

    @Override
    @Transactional
    public VideoConferenceDTO startConference(Long id) {
        try {
            Optional<VideoConference> conferenceOpt = conferenceRepository.findById(id);
            if (conferenceOpt.isEmpty()) {
                return null;
            }
            
            VideoConference conference = conferenceOpt.get();
            conference.setStatus(VideoConference.ConferenceStatus.ONGOING);
            conference.setStartTime(LocalDateTime.now());
            
            VideoConference updated = conferenceRepository.save(conference);
            return VideoConferenceUtils.toDTO(updated);
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }

    @Override
    @Transactional
    public VideoConferenceDTO endConference(Long id) {
        try {
            Optional<VideoConference> conferenceOpt = conferenceRepository.findById(id);
            if (conferenceOpt.isEmpty()) {
                return null;
            }
            
            VideoConference conference = conferenceOpt.get();
            conference.setStatus(VideoConference.ConferenceStatus.COMPLETED);
            conference.setEndTime(LocalDateTime.now());
            
            VideoConference updated = conferenceRepository.save(conference);
            return VideoConferenceUtils.toDTO(updated);
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }

    @Override
    @Transactional
    public boolean cancelConference(Long id) {
        try {
            Optional<VideoConference> conferenceOpt = conferenceRepository.findById(id);
            if (conferenceOpt.isEmpty()) {
                return false;
            }
            
            VideoConference conference = conferenceOpt.get();
            conference.setStatus(VideoConference.ConferenceStatus.CANCELLED);
            conferenceRepository.save(conference);
            return true;
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }

    @Override
    public String generateMeetingLink(Long conferenceId) {
        Optional<VideoConference> conferenceOpt = conferenceRepository.findById(conferenceId);
        if (conferenceOpt.isEmpty()) {
            return null;
        }
        
        VideoConference conference = conferenceOpt.get();
        if (conference.getMeetingLink() == null || conference.getMeetingLink().isEmpty()) {
            String meetingId = UUID.randomUUID().toString();
            conference.setMeetingId(meetingId);
            String link = generateMeetingLink(meetingId);
            conference.setMeetingLink(link);
            conferenceRepository.save(conference);
            return link;
        }
        
        return conference.getMeetingLink();
    }

    private String generateMeetingLink(String meetingId) {
        // In a real implementation, this would integrate with a video conferencing service
        // For now, return a placeholder link
        return "https://meet.village-system.lk/" + meetingId;
    }
}

