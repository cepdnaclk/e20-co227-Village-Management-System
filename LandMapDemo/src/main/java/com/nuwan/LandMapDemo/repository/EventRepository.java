package com.nuwan.LandMapDemo.repository;

import com.nuwan.LandMapDemo.domain.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStartBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);
}
