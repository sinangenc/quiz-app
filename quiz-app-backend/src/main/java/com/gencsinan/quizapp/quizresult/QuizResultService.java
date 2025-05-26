package com.gencsinan.quizapp.quizresult;

import com.gencsinan.quizapp.user.User;
import com.gencsinan.quizapp.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
public class QuizResultService {
    private final QuizResultRepository quizResultRepository;
    private final UserRepository userRepository;

    @Autowired
    public QuizResultService(QuizResultRepository quizResultRepository, UserRepository userRepository) {
        this.quizResultRepository = quizResultRepository;
        this.userRepository = userRepository;
    }

    public Page<QuizResult> getQuizResults(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email);

        Page<QuizResult> quizResults = quizResultRepository.findByUser(user,
                PageRequest.of(
                        pageable.getPageNumber(),
                        pageable.getPageSize(),
                        pageable.getSortOr(Sort.by(Sort.Direction.DESC, "completedAt"))
                )
        );

        return quizResults;
    }

    public QuizResult saveQuizResult(QuizResult quizResult, Principal principal) {
        String email = principal.getName();
        User user = userRepository.findByEmail(email);

        quizResult.setUser(user);
        return quizResultRepository.save(quizResult);
    }
}
