export function getFormattedDate(): string {
    // Here we declare the current date, in the format requested in the project.
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('en-US', { month: 'short' });

    // Here we check the issue of the suffix for the exact day.
    const getOrdinalSuffix = (n: number) => {
        if (n > 3 && n < 21) return 'th';
        switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
        }
    };

    // Here we put everything together in a const named formatted.
    const formatted = `${day}${getOrdinalSuffix(day)} ${month}`;
    // We return in the format displayed on the screen, written: Today + the date dynamically formed..
    return `Today, ${formatted}`;
}
