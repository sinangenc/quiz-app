package com.gencsinan.quizapp.quizresult;

import com.gencsinan.quizapp.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    Page<QuizResult> findByUser(User user, Pageable pageable);
}
