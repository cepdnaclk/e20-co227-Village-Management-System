package com.nuwan.LandMapDemo.repository;

import com.nuwan.LandMapDemo.domain.Land;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LandRepository extends JpaRepository<Land, Long> {

    List<Land> getLandBySizeAfter(double size);

    List<Land> getLandsBySizeBetween(double size1, double size2);
    @Query("SELECT l FROM Land l JOIN l.owner p WHERE " +
            "CAST(l.owner.id AS string) LIKE %:keyword% OR " +
            "p.name LIKE %:keyword%")
    Page<Land> searchLands(@Param("keyword") String keyword, Pageable pageable);

    void deleteLandsByOwnerId(String id);

    @Query("SELECT l FROM Land l WHERE " +
           "(:minSize IS NULL OR l.size >= :minSize) AND " +
           "(:maxSize IS NULL OR l.size <= :maxSize) AND " +
           "(:landType IS NULL OR l.landType = :landType) AND " +
           "(:ownership IS NULL OR l.ownership = :ownership) AND " +
           "(:ownerId IS NULL OR l.owner.id = :ownerId)")
    List<Land> findLandsWithFilters(@Param("minSize") Double minSize,
                                     @Param("maxSize") Double maxSize,
                                     @Param("landType") String landType,
                                     @Param("ownership") String ownership,
                                     @Param("ownerId") String ownerId);

    @Query("SELECT l FROM Land l JOIN l.owner p WHERE " +
           "(:minSize IS NULL OR l.size >= :minSize) AND " +
           "(:maxSize IS NULL OR l.size <= :maxSize) AND " +
           "(:landType IS NULL OR l.landType = :landType) AND " +
           "(:ownership IS NULL OR l.ownership = :ownership) AND " +
           "(:ownerId IS NULL OR l.owner.id = :ownerId) AND " +
           "(:searchTerm IS NULL OR p.name LIKE %:searchTerm% OR CAST(l.owner.id AS string) LIKE %:searchTerm%)")
    Page<Land> findLandsWithAdvancedFilters(@Param("minSize") Double minSize,
                                              @Param("maxSize") Double maxSize,
                                              @Param("landType") String landType,
                                              @Param("ownership") String ownership,
                                              @Param("ownerId") String ownerId,
                                              @Param("searchTerm") String searchTerm,
                                              Pageable pageable);

}
