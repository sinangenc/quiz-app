# Stage for building the application.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw .
COPY ./src ./src

# Resolve dependencies and build the application.
RUN mvn package -DskipTests && \
    mv target/*.jar app.jar

# Stage for running the application.
FROM eclipse-temurin:21-jre-jammy AS production
WORKDIR /app
COPY --from=build /app/app.jar .
COPY ./uploaded_files ./uploaded_files
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]