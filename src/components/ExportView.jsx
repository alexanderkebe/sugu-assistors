import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { ROLES } from '../utils/assignment';

export default function ExportView({ day, assignments, onClose }) {
    const exportRef = useRef(null);
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        if (!exportRef.current) return;
        setExporting(true);
        try {
            const canvas = await html2canvas(exportRef.current, {
                backgroundColor: '#1B164A', // Enforce primary Navy BG
                scale: 2 // High resolution
            });

            const image = canvas.toDataURL("image/png");

            // Create a dummy link to download the image
            const link = document.createElement('a');
            link.href = image;
            link.download = `Subae-Gubae-${day.replace(/\s+/g, '-')}-Roster.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to create image.");
        } finally {
            setExporting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem',
            overflowY: 'auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '800px', margin: '0 auto', width: '100%', marginBottom: '1rem' }}>
                <button onClick={onClose} className="btn-secondary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>Cancel</button>
                <button onClick={handleExport} className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                    {exporting ? 'Generating...' : 'Download Image'}
                </button>
            </div>

            {/* The Printable Container */}
            <div
                ref={exportRef}
                style={{
                    background: '#1B164A', /* Navy Blue */
                    color: '#FFFFFF',
                    padding: '3rem',
                    borderRadius: '16px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    width: '100%',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    fontFamily: "'Outfit', 'Inter', sans-serif"
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        color: '#C9A23A', /* Gold */
                        fontSize: '3rem',
                        margin: '0 0 0.5rem 0',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>
                        Subae Gubae
                    </h1>
                    <p style={{
                        color: '#D4AF37',
                        fontSize: '1.2rem',
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        margin: 0
                    }}>
                        21 Days Without Weekends
                    </p>
                    <div style={{
                        width: '60px',
                        height: '2px',
                        background: '#C9A23A',
                        margin: '1.5rem auto'
                    }}></div>
                    <h2 style={{ fontSize: '2rem', margin: 0 }}>Official Roster: {day}</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {Object.entries(ROLES).map(([roleKey, role]) => {
                        const group = assignments[role.id] || [];
                        if (group.length === 0) return null;

                        return (
                            <div key={role.id} style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '1.5rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(201, 162, 58, 0.2)'
                            }}>
                                <h3 style={{
                                    color: '#C9A23A',
                                    fontSize: '1.2rem',
                                    borderBottom: '1px solid rgba(201, 162, 58, 0.2)',
                                    paddingBottom: '0.5rem',
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    {role.name}
                                    <span style={{ fontSize: '0.9rem', color: '#FFF' }}>{group.length}/{role.count}</span>
                                </h3>

                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {group.map((assistant, idx) => (
                                        <li key={assistant.id} style={{
                                            padding: '0.5rem 0',
                                            borderBottom: idx !== group.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '1.1rem'
                                        }}>
                                            <span>{idx + 1}. {assistant.name}</span>
                                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{assistant.phone}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                    <p>Generated by Subae Gubae Coordinator Application</p>
                </div>
            </div>
        </div>
    );
}
