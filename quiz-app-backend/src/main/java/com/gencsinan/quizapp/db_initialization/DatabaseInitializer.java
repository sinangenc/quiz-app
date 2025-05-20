package com.gencsinan.quizapp.db_initialization;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final DataSource dataSource;
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DatabaseInitializer(DataSource dataSource, JdbcTemplate jdbcTemplate) {
        this.dataSource = dataSource;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM question", Long.class);

        if (count != null && count == 0) {
            // Veritabanı boşsa SQL dosyasını çalıştır
            Resource resource = new ClassPathResource("data.sql");
            ScriptUtils.executeSqlScript(dataSource.getConnection(), resource);
            logger.info("Database initialised with data.sql file");
        } else {
            logger.info("Database contains data, initialization step skipped");
        }
    }
}
