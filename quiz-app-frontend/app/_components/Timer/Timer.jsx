import { useEffect, useState, useRef } from 'react';


export default function Timer({ duration, onTimeUp }) {
    const [timeLeft, setTimeLeft] = useState(duration); // Start from the passed duration
    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);

    // Store the latest onTimeUp callback in a ref to avoid stale closures
    const onTimeUpRef = useRef(onTimeUp);
    useEffect(() => {
        onTimeUpRef.current = onTimeUp;
    }, [onTimeUp]);


    // Timer countdown logic
    useEffect(() => {
        startTimeRef.current = Date.now();

        const interval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
            const remainingSeconds = Math.max(0, duration - elapsedSeconds);

            setTimeLeft(remainingSeconds);

            if (remainingSeconds === 0) {
                clearInterval(interval);
                onTimeUpRef.current();
            }
        }, 250); // daha akıcı animasyon için kısa aralık

        return () => clearInterval(interval);
    }, [duration]);


    


    // Format time as mm:ss
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <>
            {formatTime(timeLeft)}
        </>
    );
}
