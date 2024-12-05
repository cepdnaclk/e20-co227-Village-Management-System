package com.nuwan.LandMapDemo.service.impl;

import com.nuwan.LandMapDemo.domain.Event;
import com.nuwan.LandMapDemo.repository.EventRepository;
import com.nuwan.LandMapDemo.service.EventService;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    public EventServiceImpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(Long id, Event event) {
        return eventRepository.findById(id)
                .map(existingEvent -> {
                    existingEvent.setTitle(event.getTitle());
                    existingEvent.setDescription(event.getDescription());
                    existingEvent.setStart(event.getStart());
                    existingEvent.setEnd(event.getEnd());
                    existingEvent.setFinished(event.isFinished());
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


}
