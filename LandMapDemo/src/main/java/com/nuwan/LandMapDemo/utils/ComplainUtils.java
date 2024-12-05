package com.nuwan.LandMapDemo.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nuwan.LandMapDemo.domain.Complain;
import com.nuwan.LandMapDemo.dto.ComplainDTO;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

public class ComplainUtils {

    public static ComplainDTO toDTO(Complain complain) {
        if (complain == null) {
            return null;
        }

        ComplainDTO dto = new ComplainDTO();
        dto.setId(complain.getId());
        dto.setPerson(complain.getPerson().getId());
        dto.setPersonName(complain.getPerson().getName());
        dto.setComplain(complain.getComplain());
        dto.setTime(complain.getTime());
        dto.setStatus(complain.getStatus());
        dto.setCompleteTime(complain.getCompleteTime());
        dto.setNotes(complain.getNotes());
        return dto;
    }

    public static ByteArrayOutputStream exportToCSV(List<ComplainDTO> complaints) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        StringBuilder csvBuilder = new StringBuilder();
        csvBuilder.append("ID,Person,Person Name,Complain,Time,Complete Time,Status,Notes\n");

        for (ComplainDTO dto : complaints) {
            csvBuilder.append(dto.getId()).append(",")
                    .append(dto.getPerson()).append(",")
                    .append(dto.getPersonName()).append(",")
                    .append(dto.getComplain()).append(",")
                    .append(dto.getTime()).append(",")
                    .append(dto.getCompleteTime()).append(",")
                    .append(dto.getStatus()).append(",")
                    .append(dto.getNotes()).append("\n");
        }

        outputStream.write(csvBuilder.toString().getBytes());
        return outputStream;
    }

    public static ByteArrayOutputStream exportToHTML(List<ComplainDTO> complaints) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        StringBuilder htmlBuilder = new StringBuilder();
        htmlBuilder.append("<html><head><title>Complaints</title></head><body>")
                .append("<h1>Complaints</h1>")
                .append("<table border='1'><tr><th>ID</th><th>Person</th><th>Person Name</th><th>Complain</th><th>Time</th><th>Complete Time</th><th>Status</th><th>Notes</th></tr>");

        for (ComplainDTO dto : complaints) {
            htmlBuilder.append("<tr>")
                    .append("<td>").append(dto.getId()).append("</td>")
                    .append("<td>").append(dto.getPerson()).append("</td>")
                    .append("<td>").append(dto.getPersonName()).append("</td>")
                    .append("<td>").append(dto.getComplain()).append("</td>")
                    .append("<td>").append(dto.getTime()).append("</td>")
                    .append("<td>").append(dto.getCompleteTime()).append("</td>")
                    .append("<td>").append(dto.getStatus()).append("</td>")
                    .append("<td>").append(dto.getNotes()).append("</td>")
                    .append("</tr>");
        }

        htmlBuilder.append("</table></body></html>");
        outputStream.write(htmlBuilder.toString().getBytes());
        return outputStream;
    }

    public static ByteArrayOutputStream exportToJSON(List<ComplainDTO> complaints) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(complaints);
        outputStream.write(json.getBytes());
        return outputStream;
    }
}
