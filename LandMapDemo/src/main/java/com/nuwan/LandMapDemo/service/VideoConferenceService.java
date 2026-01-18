package com.nuwan.LandMapDemo.service;

import com.nuwan.LandMapDemo.dto.VideoConferenceDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface VideoConferenceService {
    VideoConferenceDTO scheduleConference(VideoConferenceDTO conferenceDTO);
    VideoConferenceDTO getConferenceById(Long id);
    List<VideoConferenceDTO> getConferencesByGramaNiladhariId(String gramaNiladhariId);
    List<VideoConferenceDTO> getConferencesByVillagerId(String villagerId);
    List<VideoConferenceDTO> getUpcomingConferences(String gramaNiladhariId);
    VideoConferenceDTO updateConferenceStatus(Long id, String status);
    VideoConferenceDTO startConference(Long id);
    VideoConferenceDTO endConference(Long id);
    boolean cancelConference(Long id);
    String generateMeetingLink(Long conferenceId);
}

