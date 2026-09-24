FROM eclipse-temurin:25-jdk

LABEL authors="Ankit Yadav"

WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

ENTRYPOINT ["java","-jar","target/zerowaste-meals-backend-0.0.1-SNAPSHOT.jar", "app.jar"]