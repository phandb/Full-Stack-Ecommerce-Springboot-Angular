package com.java.springboot.angular.ecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import com.java.springboot.angular.ecommerce.entity.Country;
import com.java.springboot.angular.ecommerce.entity.Product;
import com.java.springboot.angular.ecommerce.entity.ProductCategory;
import com.java.springboot.angular.ecommerce.entity.State;

// import org.hibernate.type.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer{

    // Autowire JPA entity manager
    private EntityManager entityManager;
    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager){
        entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {

        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        //  Read only--Disable Http methods for Product: PUT, POST, and DELETE
        disableHttpMethods(Product.class, config, theUnsupportedActions);
        disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);
        disableHttpMethods(Country.class, config, theUnsupportedActions);
        disableHttpMethods(State.class, config, theUnsupportedActions);
         
        // Call an internal helper to expose id
        exposeIds(config);
    }

    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        // expose entity ids

        // Get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // Create an array of the entity types
        List<Class<?>> entityClasses = new ArrayList<>();

        // Get the entity types for the entities
        for (EntityType<?> tempEntityType : entities) {
            entityClasses.add(tempEntityType.getJavaType());
        }

        // Expose the entity ids for the arrays of entity/domain types
        Class<?>[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}

