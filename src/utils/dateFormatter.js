export const displayDate = (yyyy_mm_dd) => {
    if (!yyyy_mm_dd) return '';
    const d = new Date(yyyy_mm_dd + 'T12:00:00'); 
    if (isNaN(d)) return yyyy_mm_dd;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[d.getDay()]}, ${d.getDate().toString().padStart(2, '0')}, ${months[d.getMonth()]}`;
};
