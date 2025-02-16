import { useEffect, useState } from 'react';

export default function Timer({ duration, onTimeUp }) {
    const [timeLeft, setTimeLeft] = useState(duration); // Start from the passed duration

    // Format time as mm:ss
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Timer countdown logic
    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp(); // Trigger the onTimeUp method passed from the parent
            return; // Stop the interval if time is up
        }

        const interval = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1); // Decrease time by 1 second
        }, 1000);

        return () => clearInterval(interval); // Clean up interval on component unmount
    }, [timeLeft, onTimeUp]);

    return (
        <>
            {formatTime(timeLeft)}
        </>
    );
}
