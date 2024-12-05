package com.nuwan.LandMapDemo.service;

import com.nuwan.LandMapDemo.domain.Event;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

public interface EventService {
    Event createEvent(Event event);
    Event updateEvent(Long id, Event event);
    boolean deleteEvent(Long id);
    Event getEventById(Long id);
    List<Event> getAllEvents();
    boolean makeEventStatus(Long id, boolean status);
    Duration getEventDueTime(Long id);
    List<Event> getTodayEvents();

}
