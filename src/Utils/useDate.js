import { useEffect, useState } from "react";

export const useDate = () => {
    const locale = 'en';
    const [today, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 60 * 1000); // Update every minute (60 seconds * 1000 milliseconds)

        return () => {
            clearInterval(timer); // Clean up interval on component unmount
        };
    }, []); // Empty dependency array ensures effect runs only once on component mount

    // Format date and time strings
    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const date = `${day}, ${today.getDate()}, ${today.toLocaleDateString(locale, { month: 'long' })}`;
    const time = today.toLocaleDateString(locale, { hour: 'numeric', minute: 'numeric', hour12: true });

    return {
        date,
        time
    };
};
