package com.nuwan.LandMapDemo.dto;

import com.nuwan.LandMapDemo.domain.Event;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EventDTO {
    private Long id;

    private String title;

    private String description;

    private LocalDateTime start;

    private LocalDateTime end;

    private boolean finished;
    
    private String gramaNiladhariId;
    private String gramaNiladhariName;
    private Event.EventType eventType;
    private String location;
    private List<String> attendeeIds;
    private List<String> attendeeNames;
    private String notes;
    private Event.EventStatus status;
}
