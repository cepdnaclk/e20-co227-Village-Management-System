package com.nuwan.LandMapDemo.utils;

import com.nuwan.LandMapDemo.domain.Event;
import com.nuwan.LandMapDemo.dto.EventDTO;

import java.util.stream.Collectors;

public class EventUtils {
    public static EventDTO toDTO(Event event) {
        if (event == null) return null;
        
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setStart(event.getStart());
        dto.setEnd(event.getEnd());
        dto.setFinished(event.isFinished());
        if (event.getGramaNiladhari() != null) {
            dto.setGramaNiladhariId(event.getGramaNiladhari().getId());
            dto.setGramaNiladhariName(event.getGramaNiladhari().getName());
        }
        dto.setEventType(event.getEventType());
        dto.setLocation(event.getLocation());
        if (event.getAttendees() != null) {
            dto.setAttendeeIds(event.getAttendees().stream()
                    .map(person -> person.getId())
                    .collect(Collectors.toList()));
            dto.setAttendeeNames(event.getAttendees().stream()
                    .map(person -> person.getName())
                    .collect(Collectors.toList()));
        }
        dto.setNotes(event.getNotes());
        dto.setStatus(event.getStatus());
        return dto;
    }
}
