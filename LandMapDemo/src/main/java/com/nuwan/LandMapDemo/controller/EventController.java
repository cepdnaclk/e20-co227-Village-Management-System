package com.nuwan.LandMapDemo.controller;

import com.nuwan.LandMapDemo.domain.Event;
import com.nuwan.LandMapDemo.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<Void> createEvent(@RequestBody Event event) {
        if (eventService.createEvent(event) != null) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        if (eventService.updateEvent(id, event) != null) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}/done")
    public ResponseEntity<Void> markEventStatus(@PathVariable Long id, @RequestParam("status") boolean status) {
        try {
            eventService.makeEventStatus(id, status);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}/get_time")
    public ResponseEntity<Duration> getEventDueTime(@PathVariable Long id) {
        try {
            Duration dueTime = eventService.getEventDueTime(id);
            return new ResponseEntity<>(dueTime, HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (eventService.deleteEvent(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event = Optional.ofNullable(eventService.getEventById(id));
        return event.map(e -> new ResponseEntity<>(e, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/today")
    public ResponseEntity<List<Event>> getTodayEvents() {
        List<Event> events = eventService.getTodayEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
}
