package com.nuwan.LandMapDemo.domain;

import jakarta.persistence.*;
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
@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private LocalDateTime start;

    private LocalDateTime end;

    private boolean finished;

    @ManyToOne
    @JoinColumn(name = "grama_niladhari_id")
    private Person gramaNiladhari;

    @Enumerated(EnumType.STRING)
    private EventType eventType;

    public enum EventType {
        MEETING,
        VILLAGE_EVENT,
        OFFICE_WORK,
        FIELD_VISIT,
        TRAINING,
        OTHER
    }

    private String location;

    @ManyToMany
    @JoinTable(
            name = "event_attendees",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    private List<Person> attendees;

    private String notes;

    @Enumerated(EnumType.STRING)
    private EventStatus status = EventStatus.SCHEDULED;

    public enum EventStatus {
        SCHEDULED,
        ONGOING,
        COMPLETED,
        CANCELLED,
        POSTPONED
    }
}
