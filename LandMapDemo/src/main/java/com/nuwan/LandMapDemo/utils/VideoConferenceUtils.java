package com.nuwan.LandMapDemo.utils;

import com.nuwan.LandMapDemo.domain.VideoConference;
import com.nuwan.LandMapDemo.dto.VideoConferenceDTO;

public class VideoConferenceUtils {
    public static VideoConferenceDTO toDTO(VideoConference conference) {
        if (conference == null) return null;
        
        VideoConferenceDTO dto = new VideoConferenceDTO();
        dto.setId(conference.getId());
        dto.setGramaNiladhariId(conference.getGramaNiladhari().getId());
        dto.setGramaNiladhariName(conference.getGramaNiladhari().getName());
        dto.setVillagerId(conference.getVillager().getId());
        dto.setVillagerName(conference.getVillager().getName());
        dto.setTitle(conference.getTitle());
        dto.setDescription(conference.getDescription());
        dto.setScheduledDateTime(conference.getScheduledDateTime());
        dto.setStartTime(conference.getStartTime());
        dto.setEndTime(conference.getEndTime());
        dto.setStatus(conference.getStatus());
        dto.setMeetingLink(conference.getMeetingLink());
        dto.setMeetingId(conference.getMeetingId());
        dto.setMeetingPassword(conference.getMeetingPassword());
        if (conference.getRelatedRequest() != null) {
            dto.setRelatedRequestId(conference.getRelatedRequest().getId());
        }
        dto.setNotes(conference.getNotes());
        return dto;
    }
}

