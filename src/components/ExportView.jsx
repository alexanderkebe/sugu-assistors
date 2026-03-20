import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { ROLES } from '../utils/assignment';
import { displayDate } from '../utils/dateFormatter';

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
                        color: '#C9A23A',
                        fontSize: '2.5rem',
                        margin: '0 0 0.5rem 0',
                        letterSpacing: '2px',
                        background: 'none'
                    }}>
                        {displayDate(day)}
                    </h1>
                    <div style={{
                        width: '60px',
                        height: '2px',
                        background: '#C9A23A',
                        margin: '1rem auto'
                    }}></div>
                    <h2 style={{ fontSize: '1.8rem', margin: 0, textTransform: 'uppercase', letterSpacing: '3px' }}>
                        Selected Facilitators List
                    </h2>
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

                <div style={{ textAlign: 'center', marginTop: '3rem', padding: '1.5rem', background: 'rgba(201, 162, 58, 0.08)', borderRadius: '8px', border: '1px solid rgba(201, 162, 58, 0.15)' }}>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: '1.8', margin: '0 0 0.5rem 0', fontStyle: 'italic' }}>
                        እግዚአብሔር፥ ቅዱሳንን ስላገለገላችሁ እስከ አሁንም ስለምታገለግሉአቸው፥ ያደረጋችሁትን ሥራ ለስሙም ያሳያችሁትን ፍቅር ይረሳ ዘንድ ዓመፀኛ አይደለምና።
                    </p>
                    <p style={{ color: '#C9A23A', fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>
                        ዕብራውያን 6:10
                    </p>
                </div>
            </div>
        </div>
    );
}
