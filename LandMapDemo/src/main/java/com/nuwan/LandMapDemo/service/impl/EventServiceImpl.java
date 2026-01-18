package com.nuwan.LandMapDemo.service.impl;

import com.nuwan.LandMapDemo.domain.Event;
import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.dto.EventDTO;
import com.nuwan.LandMapDemo.repository.EventRepository;
import com.nuwan.LandMapDemo.repository.PersonRepository;
import com.nuwan.LandMapDemo.service.EventService;
import com.nuwan.LandMapDemo.utils.EventUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final PersonRepository personRepository;

    @Override
    @Transactional
    public Event createEvent(Event event) {
        if (event.getStatus() == null) {
            event.setStatus(Event.EventStatus.SCHEDULED);
        }
        return eventRepository.save(event);
    }

    @Override
    @Transactional
    public Event updateEvent(Long id, Event event) {
        return eventRepository.findById(id)
                .map(existingEvent -> {
                    existingEvent.setTitle(event.getTitle());
                    existingEvent.setDescription(event.getDescription());
                    existingEvent.setStart(event.getStart());
                    existingEvent.setEnd(event.getEnd());
                    existingEvent.setFinished(event.isFinished());
                    if (event.getGramaNiladhari() != null) {
                        existingEvent.setGramaNiladhari(event.getGramaNiladhari());
                    }
                    if (event.getEventType() != null) {
                        existingEvent.setEventType(event.getEventType());
                    }
                    if (event.getLocation() != null) {
                        existingEvent.setLocation(event.getLocation());
                    }
                    if (event.getAttendees() != null) {
                        existingEvent.setAttendees(event.getAttendees());
                    }
                    if (event.getNotes() != null) {
                        existingEvent.setNotes(event.getNotes());
                    }
                    if (event.getStatus() != null) {
                        existingEvent.setStatus(event.getStatus());
                    }
                    return eventRepository.save(existingEvent);
                }).orElse(null);
    }

    @Override
    public boolean deleteEvent(Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public boolean makeEventStatus(Long id, boolean status) {
        try {
            eventRepository.findById(id)
                    .ifPresent(event -> {
                            event.setFinished(status);
                            eventRepository.save(event);
                    });
            return true;
        }
        catch (Exception e) {
            System.out.println(e);
            return false;
        }

    }

    @Override
    public Duration getEventDueTime(Long id) {
        return eventRepository.findById(id)
                .map(event -> {
                    if (event.isFinished()) {
                        throw new IllegalStateException("Event already done");
                    }
                    return Duration.between(LocalDateTime.now(), event.getEnd());
                }).orElseThrow(() -> new IllegalStateException("Event not found"));
    }

    @Override
    public List<Event> getTodayEvents() {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);
        return eventRepository.findByStartBetween(startOfDay, endOfDay);
    }

    public List<EventDTO> getEventsByGramaNiladhariId(String gramaNiladhariId) {
        Optional<Person> personOpt = personRepository.findById(gramaNiladhariId);
        if (personOpt.isEmpty()) {
            return List.of();
        }
        
        return eventRepository.findByGramaNiladhari(personOpt.get())
                .stream()
                .map(EventUtils::toDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getEventsByGramaNiladhariAndDateRange(String gramaNiladhariId, LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.findByGramaNiladhariAndDateRange(gramaNiladhariId, startDate, endDate)
                .stream()
                .map(EventUtils::toDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getEventsByStatus(Event.EventStatus status) {
        return eventRepository.findByStatus(status)
                .stream()
                .map(EventUtils::toDTO)
                .collect(Collectors.toList());
    }

}
