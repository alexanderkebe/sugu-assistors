import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { displayDate } from '../utils/dateFormatter';

function Registration() {
    const { eventDays, assistants, addAssistant } = useAppContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        gender: 'Female',
        availableDays: []
    });

    const [success, setSuccess] = useState(false);

    const isDayFull = (day) => {
        const dayAssistants = assistants.filter(a => a.availableDays && a.availableDays.includes(day) && a.gender === formData.gender);
        const max = formData.gender === 'Female' ? 9 : 3;
        return dayAssistants.length >= max;
    };

    const handleDayToggle = (day) => {
        if (isDayFull(day) && !formData.availableDays.includes(day)) return;
        setFormData(prev => {
            const days = [...prev.availableDays];
            if (days.includes(day)) {
                return { ...prev, availableDays: days.filter(d => d !== day) };
            } else {
                return { ...prev, availableDays: [...days, day] };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || formData.availableDays.length === 0) {
            alert("Please fill all required fields and select at least one day.");
            return;
        }

        addAssistant(formData);
        setSuccess(true);

        setTimeout(() => {
            setFormData({ name: '', phone: '', gender: 'Female', availableDays: [] });
            setSuccess(false);
            window.scrollTo(0,0);
        }, 2500);
    };

    if (success) {
        return (
            <div className="container text-center" style={{ paddingTop: '10vh' }}>
                <div className="card flex items-center justify-center flex-column" style={{ flexDirection: 'column' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--success)' }}>✓</div>
                    <h2 style={{ color: 'var(--success)' }}>Registration Successful!</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Thank you for volunteering, {formData.name}.</p>
                    <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--accent-light)' }}>Refreshing form...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 style={{ fontSize: '2rem' }}>Subae Gubae Portal</h1>
            <p className="subtitle">Assistant Registration</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Select your available days and provide your details to register as a volunteer for the 21 Days Without Weekends program.
            </p>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name (English) *</label>
                        <input
                            type="text"
                            placeholder="e.g. Abebe Bikila"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number *</label>
                        <input
                            type="tel"
                            placeholder="+251 9... or 09..."
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Gender *</label>
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value, availableDays: [] })}
                        >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Available Days *</label>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            Tap the days you are available to assist.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {eventDays.length === 0 ? (
                                <p style={{ color: 'var(--error)', fontSize: '0.9rem' }}>No event days have been set by the organizer.</p>
                            ) : (
                                eventDays.map(day => {
                                    const full = isDayFull(day);
                                    const selected = formData.availableDays.includes(day);
                                    return (
                                        <button
                                            type="button"
                                            key={day}
                                            onClick={() => handleDayToggle(day)}
                                            disabled={full && !selected}
                                            style={{
                                                background: selected ? 'var(--primary-accent)' : full ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.1)',
                                                color: selected ? 'var(--primary-bg)' : full ? 'var(--text-secondary)' : 'var(--text-primary)',
                                                border: selected ? 'none' : '1px solid var(--card-border)',
                                                padding: '0.5rem 1rem',
                                                borderRadius: 'var(--radius-full)',
                                                cursor: full && !selected ? 'not-allowed' : 'pointer',
                                                fontWeight: selected ? '600' : '400',
                                                opacity: full && !selected ? 0.5 : 1,
                                                transition: 'all 0.2s',
                                                fontFamily: 'var(--font-body)',
                                                textDecoration: full && !selected ? 'line-through' : 'none'
                                            }}
                                        >
                                            {displayDate(day)} {full && !selected ? '(Full)' : ''}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary mt-4"
                        disabled={eventDays.length === 0}
                    >
                        Complete Registration
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Registration;
