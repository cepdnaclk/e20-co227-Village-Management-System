package com.nuwan.LandMapDemo.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VideoConference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "grama_niladhari_id", nullable = false)
    private Person gramaNiladhari;

    @ManyToOne
    @JoinColumn(name = "villager_id", nullable = false)
    private Person villager;

    private String title;

    private String description;

    private LocalDateTime scheduledDateTime;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private ConferenceStatus status;

    public enum ConferenceStatus {
        SCHEDULED,
        ONGOING,
        COMPLETED,
        CANCELLED,
        RESCHEDULED
    }

    private String meetingLink;

    private String meetingId;

    private String meetingPassword;

    @ManyToOne
    @JoinColumn(name = "request_id", nullable = true)
    private Request relatedRequest;

    private String notes;
}

