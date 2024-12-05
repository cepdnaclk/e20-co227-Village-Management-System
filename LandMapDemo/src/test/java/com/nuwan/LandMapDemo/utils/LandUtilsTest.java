package com.nuwan.LandMapDemo.utils;

import com.nuwan.LandMapDemo.domain.Coordinate;
import com.nuwan.LandMapDemo.domain.Land;
import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.dto.LandDTO;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class LandUtilsTest {

    /**
     * Tests the toDTO method for converting a Land object to a LandDTO.
     * - When Land has an owner, the DTO should include the owner's details.
     * - When Land does not have an owner, the DTO should default to "Unknown" for ownerName.
     */
    @Test
    void testToDTOWithOwner() {
        Person owner = new Person();
        owner.setId("200030302987");
        owner.setName("John Doe");

        Land land = new Land();
        land.setId(1L);
        land.setLandType("GODA");
        land.setOwnership("SINNAKKARA");
        land.setSize(100.0);
        land.setCoordinates(Collections.singletonList(new Coordinate(1L, 1.0, 1.0, land)));
        land.setOwner(owner);

        LandDTO landDTO = LandUtils.toDTO(land);

        assertEquals(1L, landDTO.getId());
        assertEquals("GODA", landDTO.getLandType());
        assertEquals("SINNAKKARA", landDTO.getOwnership());
        assertEquals(100.0, landDTO.getSize());
        assertEquals("200030302987", landDTO.getOwner());
        assertEquals("John Doe", landDTO.getOwnerName());
    }

    @Test
    void testToDTOWithoutOwner() {
        Land land = new Land();
        land.setId(1L);
        land.setLandType("GODA");
        land.setOwnership("SINNAKKARA");
        land.setSize(100.0);
        land.setCoordinates(Collections.singletonList(new Coordinate(1L, 1.0, 1.0, land)));

        LandDTO landDTO = LandUtils.toDTO(land);

        assertEquals(1L, landDTO.getId());
        assertEquals("GODA", landDTO.getLandType());
        assertEquals("SINNAKKARA", landDTO.getOwnership());
        assertEquals(100.0, landDTO.getSize());
        assertNull(landDTO.getOwner());
        assertEquals("Unknown", landDTO.getOwnerName());
    }

    /**
     * Tests the isPointInPolygon method to determine if a point is inside a polygon.
     * - A point inside the polygon should return true.
     * - A point outside the polygon should return false.
     */
    @Test
    void testIsPointInPolygon() {
        Coordinate pointInside = new Coordinate(1L, 1.0, 1.0, null);
        Coordinate pointOutside = new Coordinate(2L, 5.0, 5.0, null);

        List<Coordinate> polygon = Arrays.asList(
                new Coordinate(1L, 0.0, 0.0, null),
                new Coordinate(2L, 0.0, 5.0, null),
                new Coordinate(3L, 5.0, 5.0, null),
                new Coordinate(4L, 5.0, 0.0, null)
        );

        assertTrue(LandUtils.isPointInPolygon(pointInside, polygon));
        assertFalse(LandUtils.isPointInPolygon(pointOutside, polygon));
    }

    /**
     * Tests the calculateCentroid method to calculate the centroid of a list of coordinates.
     * - The centroid calculation should return the correct average latitude and longitude.
     */
    @Test
    void testCalculateCentroid() {
        List<Coordinate> coordinates = Arrays.asList(
                new Coordinate(1L, 1.0, 1.0, null),
                new Coordinate(2L, 2.0, 2.0, null),
                new Coordinate(3L, 3.0, 3.0, null)
        );

        Coordinate centroid = LandUtils.calculateCentroid(coordinates);

        assertEquals(2.0, centroid.getLatitude());
        assertEquals(2.0, centroid.getLongitude());
    }

    /**
     * Tests the findLandContainingPoint method to find the land that contains a given point.
     * - Should return the land that contains the point.
     * - Should return null if no land contains the point.
     */
    @Test
    void testFindLandContainingPoint() {
        // Define a point inside the polygon
        Coordinate point = new Coordinate(1L, 1.0, 1.0, null);

        // Define the polygon as a list of coordinates (a simple square in this case)
        List<Coordinate> polygon = Arrays.asList(
                new Coordinate(1L, 0.0, 0.0, null),
                new Coordinate(2L, 0.0, 2.0, null),
                new Coordinate(3L, 2.0, 2.0, null),
                new Coordinate(4L, 2.0, 0.0, null)
        );

        // Create a land object with the polygon coordinates
        Land land = new Land();
        land.setId(1L);
        land.setCoordinates(polygon);

        // Place the land object in a list
        List<Land> lands = Collections.singletonList(land);

        // Call the method to find the land containing the point
        Land foundLand = LandUtils.findLandContainingPoint(point, lands);

        // Assert that the land containing the point is found
        assertNotNull(foundLand);
        assertEquals(1L, foundLand.getId());
    }


    @Test
    void testFindLandNotContainingPoint() {
        Coordinate point = new Coordinate(1L, 5.0, 5.0, null);
        Land land = new Land();
        land.setId(1L);
        land.setCoordinates(Collections.singletonList(new Coordinate(1L, 0.0, 0.0, land)));

        List<Land> lands = Collections.singletonList(land);

        Land foundLand = LandUtils.findLandContainingPoint(point, lands);

        assertNull(foundLand);
    }
}
