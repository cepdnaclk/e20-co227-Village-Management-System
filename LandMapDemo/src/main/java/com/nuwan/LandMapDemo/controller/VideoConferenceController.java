package com.nuwan.LandMapDemo.controller;

import com.nuwan.LandMapDemo.dto.VideoConferenceDTO;
import com.nuwan.LandMapDemo.service.VideoConferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/video-conferences")
@RequiredArgsConstructor
public class VideoConferenceController {

    private final VideoConferenceService conferenceService;

    @PostMapping
    public ResponseEntity<VideoConferenceDTO> scheduleConference(@RequestBody VideoConferenceDTO conferenceDTO) {
        VideoConferenceDTO scheduled = conferenceService.scheduleConference(conferenceDTO);
        if (scheduled != null) {
            return new ResponseEntity<>(scheduled, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoConferenceDTO> getConferenceById(@PathVariable Long id) {
        VideoConferenceDTO conference = conferenceService.getConferenceById(id);
        if (conference != null) {
            return new ResponseEntity<>(conference, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/grama-niladhari/{gramaNiladhariId}")
    public ResponseEntity<List<VideoConferenceDTO>> getConferencesByGramaNiladhariId(
            @PathVariable String gramaNiladhariId) {
        List<VideoConferenceDTO> conferences = conferenceService.getConferencesByGramaNiladhariId(gramaNiladhariId);
        return new ResponseEntity<>(conferences, HttpStatus.OK);
    }

    @GetMapping("/villager/{villagerId}")
    public ResponseEntity<List<VideoConferenceDTO>> getConferencesByVillagerId(@PathVariable String villagerId) {
        List<VideoConferenceDTO> conferences = conferenceService.getConferencesByVillagerId(villagerId);
        return new ResponseEntity<>(conferences, HttpStatus.OK);
    }

    @GetMapping("/grama-niladhari/{gramaNiladhariId}/upcoming")
    public ResponseEntity<List<VideoConferenceDTO>> getUpcomingConferences(@PathVariable String gramaNiladhariId) {
        List<VideoConferenceDTO> conferences = conferenceService.getUpcomingConferences(gramaNiladhariId);
        return new ResponseEntity<>(conferences, HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<VideoConferenceDTO> updateConferenceStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        VideoConferenceDTO updated = conferenceService.updateConferenceStatus(id, status);
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<VideoConferenceDTO> startConference(@PathVariable Long id) {
        VideoConferenceDTO started = conferenceService.startConference(id);
        if (started != null) {
            return new ResponseEntity<>(started, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/{id}/end")
    public ResponseEntity<VideoConferenceDTO> endConference(@PathVariable Long id) {
        VideoConferenceDTO ended = conferenceService.endConference(id);
        if (ended != null) {
            return new ResponseEntity<>(ended, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelConference(@PathVariable Long id) {
        if (conferenceService.cancelConference(id)) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}/meeting-link")
    public ResponseEntity<String> getMeetingLink(@PathVariable Long id) {
        String link = conferenceService.generateMeetingLink(id);
        if (link != null) {
            return new ResponseEntity<>(link, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

