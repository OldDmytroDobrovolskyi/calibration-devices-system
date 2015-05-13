package com.softserve.edu.service.catalogue;

import com.softserve.edu.dto.CatalogueDTO;
import com.softserve.edu.dto.util.CatalogueDTOTransformer;
import com.softserve.edu.entity.catalogue.Locality;
import com.softserve.edu.entity.catalogue.Street;
import com.softserve.edu.repository.catalogue.StreetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StreetService {

    @Autowired
    private StreetRepository streetRepository;

    @Autowired
    private LocalityService localityService;

    public List<CatalogueDTO> getStreetsCorrespondingLocality(Long localityId) {
        return CatalogueDTOTransformer.toDto(streetRepository.findByLocalityId(localityId));
    }

    public Street findById(Long id) {
        return streetRepository.findOne(id);
    }
}
