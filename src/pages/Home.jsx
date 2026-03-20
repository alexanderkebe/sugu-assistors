import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function Home() {
    const { eventDays } = useAppContext();

    return (
        <div className="container">
            <h1>Subae Gubae</h1>
            <p className="subtitle">21 Days Without Weekends &bull; Coordination Portal</p>

            <div className="card text-center" style={{ marginTop: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Welcome to the Portal</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    This application manages the daily assistants for the program. Are you registering as an assistant, or are you the event organizer?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                    <Link to="/register" className="btn btn-primary">
                        Register as Assistant
                    </Link>
                    <Link to="/organizer" className="btn btn-secondary">
                        Organizer Dashboard
                    </Link>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.85rem', color: 'var(--text-secondary)', opacity: 0.6 }}>
                <p>Active Event Days Context: {eventDays.length}</p>
            </div>
        </div>
    );
}

export default Home;
