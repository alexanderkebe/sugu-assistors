// Assignment Constants
export const ROLES = {
    ATTENDANCE_FEMALE: { id: 'attendance', name: 'Attendance Takers', gender: 'Female', count: 6 },
    ZIKR_FEMALE: { id: 'zikr', name: 'Zikr / Bread Giving', gender: 'Female', count: 2 },
    HALL_MALE: { id: 'hall_m', name: 'Hall Assistant (Male)', gender: 'Male', count: 1 },
    HALL_FEMALE: { id: 'hall_f', name: 'Hall Assistant (Female)', gender: 'Female', count: 1 },
    OUTSIDE_MALE: { id: 'outside', name: 'Outside Facilitators', gender: 'Male', count: 2 }
};

export const getAssignmentsForDay = (day, allAssistants) => {
    // Filter assistants available for this day
    const available = allAssistants.filter(a => a.availableDays.includes(day));

    // Separate by gender
    const males = available.filter(a => a.gender === 'Male');
    const females = available.filter(a => a.gender === 'Female');

    const assignments = {
        attendance: [],
        zikr: [],
        hall_m: [],
        hall_f: [],
        outside: [],
        unassigned: [] // For overflow
    };

    // Assign Females
    let fIndex = 0;
    // 1. Attendance (6)
    while (fIndex < females.length && assignments.attendance.length < ROLES.ATTENDANCE_FEMALE.count) {
        assignments.attendance.push(females[fIndex++]);
    }
    // 2. Zikr / Bread (2)
    while (fIndex < females.length && assignments.zikr.length < ROLES.ZIKR_FEMALE.count) {
        assignments.zikr.push(females[fIndex++]);
    }
    // 3. Hall Female (1)
    while (fIndex < females.length && assignments.hall_f.length < ROLES.HALL_FEMALE.count) {
        assignments.hall_f.push(females[fIndex++]);
    }
    // Remaining females are unassigned
    while (fIndex < females.length) {
        assignments.unassigned.push(females[fIndex++]);
    }

    // Assign Males
    let mIndex = 0;
    // 1. Outside Facilitators (2)
    while (mIndex < males.length && assignments.outside.length < ROLES.OUTSIDE_MALE.count) {
        assignments.outside.push(males[mIndex++]);
    }
    // 2. Hall Male (1)
    while (mIndex < males.length && assignments.hall_m.length < ROLES.HALL_MALE.count) {
        assignments.hall_m.push(males[mIndex++]);
    }
    // Remaining males are unassigned
    while (mIndex < males.length) {
        assignments.unassigned.push(males[mIndex++]);
    }

    return assignments;
};
