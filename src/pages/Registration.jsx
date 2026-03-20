import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { displayDate } from '../utils/dateFormatter';

function Registration() {
    const { eventDays, addAssistant } = useAppContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        gender: 'Female',
        availableDays: []
    });

    const [success, setSuccess] = useState(false);

    const handleDayToggle = (day) => {
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
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
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
                                eventDays.map(day => (
                                    <button
                                        type="button"
                                        key={day}
                                        onClick={() => handleDayToggle(day)}
                                        style={{
                                            background: formData.availableDays.includes(day) ? 'var(--primary-accent)' : 'rgba(255,255,255,0.1)',
                                            color: formData.availableDays.includes(day) ? 'var(--primary-bg)' : 'var(--text-primary)',
                                            border: formData.availableDays.includes(day) ? 'none' : '1px solid var(--card-border)',
                                            padding: '0.5rem 1rem',
                                            borderRadius: 'var(--radius-full)',
                                            cursor: 'pointer',
                                            fontWeight: formData.availableDays.includes(day) ? '600' : '400',
                                            transition: 'all 0.2s',
                                            fontFamily: 'var(--font-body)'
                                        }}
                                    >
                                        {displayDate(day)}
                                    </button>
                                ))
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
