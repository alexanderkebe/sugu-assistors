import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getAssignmentsForDay, ROLES } from '../utils/assignment';
import ExportView from '../components/ExportView';
import DatePicker from "react-multi-date-picker";
import { displayDate } from '../utils/dateFormatter';

function Organizer() {
    const { eventDays, setEventDays, assistants, addEventDay, removeEventDay, removeAssistant } = useAppContext();
    const navigate = useNavigate();

    const [selectedDay, setSelectedDay] = useState(eventDays[0] || '');
    const [showExport, setShowExport] = useState(false);

    const handleDateChange = (dates) => {
        if (!dates) {
            setEventDays([]);
            setSelectedDay('');
            return;
        }
        const dateArray = Array.isArray(dates) ? dates : [dates];
        const dateStrings = dateArray.map(d => (d.format ? d.format("YYYY-MM-DD") : d));
        
        setEventDays(dateStrings);
        
        if (!selectedDay && dateStrings.length > 0) {
            setSelectedDay(dateStrings[0]);
        } else if (selectedDay && !dateStrings.includes(selectedDay)) {
            setSelectedDay(dateStrings.length > 0 ? dateStrings[0] : '');
        }
    };

    const currentAssignments = selectedDay ? getAssignmentsForDay(selectedDay, assistants) : null;

    if (showExport && selectedDay && currentAssignments) {
        return (
            <ExportView
                day={selectedDay}
                assignments={currentAssignments}
                onClose={() => setShowExport(false)}
            />
        );
    }

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Organizer Dashboard</h1>
            </div>

            {/* Days Management */}
            <div className="card mb-4" style={{ overflow: 'visible', position: 'relative', zIndex: 10 }}>
                <h2>Event Days Management</h2>
                <div style={{ marginBottom: '1rem' }}>
                    <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Select multiple dates for your event schedule:
                    </p>
                    <DatePicker 
                        multiple
                        value={eventDays.map(d => new Date(d + 'T12:00:00'))}
                        onChange={handleDateChange}
                        format="dddd, DD, MMMM"
                        placeholder="Click to select dates..."
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px',
                            padding: '0.5rem 1rem',
                            width: '100%',
                            minHeight: '40px'
                        }}
                    />
                </div>

                {eventDays.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                        {eventDays.map(day => (
                            <div key={day} style={{
                                background: 'rgba(255,255,255,0.1)',
                                padding: '0.3rem 0.8rem',
                                borderRadius: 'var(--radius-full)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                <span>{displayDate(day)}</span>
                                <button
                                    onClick={() => removeEventDay(day)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', fontWeight: 'bold' }}
                                    aria-label="Remove day"
                                    title="Delete this date"
                                >&times;</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Assistant Roster */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Daily Roster</h2>

                    <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        style={{ width: 'auto', minWidth: '150px' }}
                    >
                        {eventDays.length === 0 && <option value="">No days added</option>}
                        {eventDays.map(day => (
                            <option key={day} value={day}>{displayDate(day)}</option>
                        ))}
                    </select>
                </div>

                {selectedDay && currentAssignments ? (
                    <div>
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Showing assignments for <strong style={{ color: 'var(--accent-light)' }}>{displayDate(selectedDay)}</strong>
                            </p>
                            <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', width: 'auto' }} onClick={() => setShowExport(true)}>
                                Export Image
                            </button>
                        </div>

                        {Object.entries(ROLES).map(([roleKey, role]) => {
                            const assigned = currentAssignments[roleKey.toLowerCase().replace('_f', '_f').replace('_m', '_m')] || []; // map key securely
                            // Actually object entries might mismatch ROLES vs Assignment keys, let's fix:
                            // ROLES keys: ATTENDANCE_FEMALE => attendance, ZIKR_FEMALE => zikr
                            const stateKey = role.id;
                            const group = currentAssignments[stateKey];

                            return (
                                <div key={stateKey} style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-hover)' }}>{role.name}</h3>
                                        <span style={{ fontSize: '0.8rem', background: group.length >= role.count ? 'var(--success)' : 'var(--error)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                            {group.length} / {role.count}
                                        </span>
                                    </div>

                                    {group.length === 0 ? (
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No assistants assigned yet.</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {group.map(assistant => (
                                                <div key={assistant.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
                                                    <div>
                                                        <p style={{ fontWeight: '500', fontSize: '1rem' }}>{assistant.name}</p>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{assistant.phone}</p>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <a href={`tel:${assistant.phone}`} className="btn" style={{ width: 'auto', padding: '0.3rem 0.8rem', fontSize: '0.8rem', backgroundColor: 'var(--success, #10b981)', color: '#fff', border: 'none' }}>
                                                            Call
                                                        </a>
                                                        <button onClick={() => removeAssistant(assistant.id)} style={{ background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-full)', cursor: 'pointer' }}>
                                                            &times;
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Unassigned/Standby */}
                        {currentAssignments.unassigned.length > 0 && (
                            <div style={{ marginTop: '2rem', background: 'rgba(255,107,107,0.1)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--error)', marginBottom: '1rem' }}>Standby / Unassigned ({currentAssignments.unassigned.length})</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {currentAssignments.unassigned.map(assistant => (
                                        <div key={assistant.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
                                            <div>
                                                <p style={{ fontWeight: '500', fontSize: '1rem' }}>{assistant.name} ({assistant.gender})</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{assistant.phone}</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <a href={`tel:${assistant.phone}`} className="btn" style={{ width: 'auto', padding: '0.3rem 0.8rem', fontSize: '0.8rem', backgroundColor: 'var(--success, #10b981)', color: '#fff', border: 'none' }}>
                                                    Call
                                                </a>
                                                <button onClick={() => removeAssistant(assistant.id)} style={{ background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-full)', cursor: 'pointer' }}>
                                                    &times;
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                ) : (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>Please select or add an event day to view the roster.</p>
                )}
            </div>

            {/* All Registrations Directory */}
            <div className="card" style={{ marginTop: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Registered Directory ({assistants.length})</h2>
                {assistants.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No one has registered yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '0.8rem 0.5rem' }}>Name</th>
                                    <th style={{ padding: '0.8rem 0.5rem' }}>Phone</th>
                                    <th style={{ padding: '0.8rem 0.5rem' }}>Gender</th>
                                    <th style={{ padding: '0.8rem 0.5rem' }}>Total Days</th>
                                    <th style={{ padding: '0.8rem 0.5rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assistants.map(a => (
                                    <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.8rem 0.5rem', fontWeight: '500' }}>{a.name}</td>
                                        <td style={{ padding: '0.8rem 0.5rem', color: 'var(--text-secondary)' }}>{a.phone}</td>
                                        <td style={{ padding: '0.8rem 0.5rem' }}>{a.gender}</td>
                                        <td style={{ padding: '0.8rem 0.5rem' }}>
                                            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                                                {a.availableDays ? a.availableDays.length : 0}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.8rem 0.5rem' }}>
                                            <button onClick={() => removeAssistant(a.id)} style={{ background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Organizer;
