package com.nuwan.LandMapDemo.dto;

import com.nuwan.LandMapDemo.domain.VideoConference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VideoConferenceDTO {
    private Long id;
    private String gramaNiladhariId;
    private String gramaNiladhariName;
    private String villagerId;
    private String villagerName;
    private String title;
    private String description;
    private LocalDateTime scheduledDateTime;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private VideoConference.ConferenceStatus status;
    private String meetingLink;
    private String meetingId;
    private String meetingPassword;
    private Long relatedRequestId;
    private String notes;
}

