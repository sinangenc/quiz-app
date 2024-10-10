package com.gencsinan.quizapp.question;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("IMAGE_QUESTION")
public class QuestionWithImage extends Question {
    @Column(nullable = false)
    private String imagePath;


    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}