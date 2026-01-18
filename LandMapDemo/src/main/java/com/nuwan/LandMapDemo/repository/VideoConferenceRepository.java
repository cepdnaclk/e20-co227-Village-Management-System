package com.nuwan.LandMapDemo.repository;

import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.domain.VideoConference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VideoConferenceRepository extends JpaRepository<VideoConference, Long> {
    List<VideoConference> findByGramaNiladhari(Person gramaNiladhari);
    List<VideoConference> findByVillager(Person villager);
    List<VideoConference> findByStatus(VideoConference.ConferenceStatus status);
    
    @Query("SELECT vc FROM VideoConference vc WHERE vc.scheduledDateTime BETWEEN :start AND :end")
    List<VideoConference> findByScheduledDateTimeBetween(@Param("start") LocalDateTime start, 
                                                          @Param("end") LocalDateTime end);
    
    @Query("SELECT vc FROM VideoConference vc WHERE vc.gramaNiladhari.id = :gramaNiladhariId AND vc.scheduledDateTime >= :now")
    List<VideoConference> findUpcomingByGramaNiladhari(@Param("gramaNiladhariId") String gramaNiladhariId, 
                                                        @Param("now") LocalDateTime now);
}

