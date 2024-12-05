package com.nuwan.LandMapDemo.utils;

import com.nuwan.LandMapDemo.domain.Coordinate;
import com.nuwan.LandMapDemo.domain.Land;
import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.dto.LandDTO;

import java.util.List;

public class LandUtils {


    public static LandDTO toDTO(Land land) {
        LandDTO landDTO = new LandDTO();
        landDTO.setId(land.getId());
        landDTO.setLandType(land.getLandType());
        landDTO.setOwnership(land.getOwnership());
        landDTO.setSize(land.getSize());
        landDTO.setCoordinates(land.getCoordinates());

        // Handle potentially null owner
        Person owner = land.getOwner();
        if (owner != null) {
            landDTO.setOwner(owner.getId());
            landDTO.setOwnerName(owner.getName());
        } else {
            // Set default values or handle null case
            landDTO.setOwner(null);        // Adjust as needed (e.g., empty string or some placeholder)
            landDTO.setOwnerName("Unknown"); // Adjust as needed
        }

        return landDTO;
    }

    /**
     * Determines if a point lies inside a polygon.
     *
     * @param point the point to check
     * @param polygon the list of coordinates defining the polygon
     * @return true if the point is inside the polygon, false otherwise
     */
    public static boolean isPointInPolygon(Coordinate point, List<Coordinate> polygon) {
        int n = polygon.size();
        boolean inside = false;

        double x = point.getLatitude();
        double y = point.getLongitude();

        for (int i = 0, j = n - 1; i < n; j = i++) {
            double xi = polygon.get(i).getLatitude();
            double yi = polygon.get(i).getLongitude();
            double xj = polygon.get(j).getLatitude();
            double yj = polygon.get(j).getLongitude();

            boolean intersect = ((yi > y) != (yj > y)) &&
                    (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                inside = !inside;
            }
        }

        return inside;
    }

    /**
     * Calculates the centroid (geometric center) of a list of coordinates.
     *
     * @param coordinates the list of coordinates to calculate the centroid from
     * @return the centroid of the coordinates
     */
    public static Coordinate calculateCentroid(List<Coordinate> coordinates) {
        double latitudeSum = 0;
        double longitudeSum = 0;
        int numCoordinates = coordinates.size();

        for (Coordinate coordinate : coordinates) {
            latitudeSum += coordinate.getLatitude();
            longitudeSum += coordinate.getLongitude();
        }

        Coordinate centroid = new Coordinate();
        centroid.setLatitude(latitudeSum / numCoordinates);
        centroid.setLongitude(longitudeSum / numCoordinates);

        return centroid;
    }

    /**
     * Determines if a point lies inside any of the given lands' polygons.
     *
     * @param point the point to check
     * @param lands the list of lands to check against
     * @return the land that contains the point, or null if none contains the point
     */
    public static Land findLandContainingPoint(Coordinate point, List<Land> lands) {
        for (Land land : lands) {
            if (land.getCoordinates() != null && !land.getCoordinates().isEmpty()) {
                if (isPointInPolygon(point, land.getCoordinates())) {
                    return land;
                }
            }
        }
        return null;
    }
}
