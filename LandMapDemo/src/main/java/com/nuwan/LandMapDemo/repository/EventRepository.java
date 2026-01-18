package com.nuwan.LandMapDemo.repository;

import com.nuwan.LandMapDemo.domain.Event;
import com.nuwan.LandMapDemo.domain.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStartBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);
    
    List<Event> findByGramaNiladhari(Person gramaNiladhari);
    
    @Query("SELECT e FROM Event e WHERE e.gramaNiladhari.id = :gramaNiladhariId AND e.start >= :startDate AND e.start <= :endDate")
    List<Event> findByGramaNiladhariAndDateRange(@Param("gramaNiladhariId") String gramaNiladhariId,
                                                  @Param("startDate") LocalDateTime startDate,
                                                  @Param("endDate") LocalDateTime endDate);
    
    List<Event> findByStatus(Event.EventStatus status);
    
    List<Event> findByEventType(Event.EventType eventType);
}
