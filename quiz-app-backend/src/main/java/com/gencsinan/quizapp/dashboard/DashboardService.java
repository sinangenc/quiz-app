package com.gencsinan.quizapp.dashboard;

import com.gencsinan.quizapp.dtos.dashboard.response.DashboardStatsDto;
import com.gencsinan.quizapp.question.QuestionRepository;
import com.gencsinan.quizapp.question.QuizRepository;
import com.gencsinan.quizapp.quizresult.QuizResultRepository;
import com.gencsinan.quizapp.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final QuizResultRepository quizResultRepository;

    @Autowired
    public DashboardService(
            UserRepository userRepository,
            QuestionRepository questionRepository,
            QuizResultRepository quizResultRepository) {
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.quizResultRepository = quizResultRepository;
    }

    public DashboardStatsDto getStats() {
        long userCount = userRepository.count();
        long questionCount = questionRepository.count();
        long quizCount = quizResultRepository.count();

        return new DashboardStatsDto(userCount, questionCount, quizCount);
    }
}
