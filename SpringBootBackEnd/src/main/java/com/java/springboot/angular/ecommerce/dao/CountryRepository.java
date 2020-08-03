package com.java.springboot.angular.ecommerce.dao;

import com.java.springboot.angular.ecommerce.entity.Country;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "countries", path = "countries")  // Expose /countries endpoint
public interface CountryRepository extends JpaRepository<Country, Integer> {

}