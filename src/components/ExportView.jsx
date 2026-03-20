import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { ROLES } from '../utils/assignment';
import { displayDate } from '../utils/dateFormatter';

export default function ExportView({ day, assignments, onClose }) {
    const exportRef = useRef(null);
    const [exporting, setExporting] = useState(false);
    const [sharing, setSharing] = useState(false);

    const generateCanvas = async () => {
        if (!exportRef.current) return null;
        return await html2canvas(exportRef.current, {
            backgroundColor: '#1B164A',
            scale: 2
        });
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const canvas = await generateCanvas();
            if (!canvas) return;
            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = `Subae-Gubae-${day}-Roster.png`;
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

    const handleShare = async () => {
        setSharing(true);
        try {
            const canvas = await generateCanvas();
            if (!canvas) return;

            canvas.toBlob(async (blob) => {
                const file = new File([blob], `Subae-Gubae-${day}-Roster.png`, { type: 'image/png' });

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: `ሱባኤ ጉባኤ - ${displayDate(day)}`,
                        text: `Selected Facilitators List for ${displayDate(day)}`,
                        files: [file]
                    });
                } else {
                    // Fallback: download the image
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `Subae-Gubae-${day}-Roster.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    alert("Share not supported on this device. Image downloaded instead.");
                }
                setSharing(false);
            }, 'image/png');
        } catch (err) {
            console.error("Share failed:", err);
            setSharing(false);
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
            padding: '1rem',
            overflowY: 'auto'
        }}>
            {/* Action Buttons */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '800px',
                margin: '0 auto',
                width: '100%',
                marginBottom: '1rem',
                gap: '0.5rem',
                flexWrap: 'wrap'
            }}>
                <button onClick={onClose} className="btn-secondary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    ✕ Cancel
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={handleExport} className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        {exporting ? '...' : '⬇ Download'}
                    </button>
                    <button onClick={handleShare} style={{
                        width: 'auto',
                        padding: '0.5rem 1rem',
                        fontSize: '0.85rem',
                        background: 'var(--success, #10b981)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}>
                        {sharing ? '...' : '📤 Share'}
                    </button>
                </div>
            </div>

            {/* The Printable Container */}
            <div
                ref={exportRef}
                style={{
                    background: '#1B164A',
                    color: '#FFFFFF',
                    padding: 'clamp(1.5rem, 4vw, 3rem)',
                    borderRadius: '16px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    width: '100%',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    fontFamily: "'Outfit', 'Inter', sans-serif",
                    boxSizing: 'border-box'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vw, 3rem)' }}>
                    <h1 style={{
                        color: '#C9A23A',
                        fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                        margin: '0 0 0.5rem 0',
                        letterSpacing: '3px',
                        textTransform: 'uppercase'
                    }}>
                        ሱባኤ ጉባኤ
                    </h1>
                    <h2 style={{
                        color: '#C9A23A',
                        fontSize: 'clamp(1.2rem, 4vw, 2.5rem)',
                        margin: '0 0 0.5rem 0',
                        letterSpacing: '2px',
                        background: 'none'
                    }}>
                        {displayDate(day)}
                    </h2>
                    <div style={{
                        width: '60px',
                        height: '2px',
                        background: '#C9A23A',
                        margin: '1rem auto'
                    }}></div>
                    <h3 style={{
                        fontSize: 'clamp(1rem, 3vw, 1.8rem)',
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        Selected Facilitators List
                    </h3>
                </div>

                {/* Responsive grid: 2 columns on wide, 1 column on narrow */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                    gap: 'clamp(1rem, 2vw, 2rem)'
                }}>
                    {Object.entries(ROLES).map(([roleKey, role]) => {
                        const group = assignments[role.id] || [];
                        if (group.length === 0) return null;

                        return (
                            <div key={role.id} style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: 'clamp(0.8rem, 2vw, 1.5rem)',
                                borderRadius: '8px',
                                border: '1px solid rgba(201, 162, 58, 0.2)'
                            }}>
                                <h3 style={{
                                    color: '#C9A23A',
                                    fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
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
                                            padding: '0.4rem 0',
                                            borderBottom: idx !== group.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
                                            gap: '0.5rem',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span>{idx + 1}. {assistant.name}</span>
                                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)' }}>{assistant.phone}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* Bible Verse */}
                <div style={{
                    textAlign: 'center',
                    marginTop: 'clamp(1.5rem, 3vw, 3rem)',
                    padding: 'clamp(0.8rem, 2vw, 1.5rem)',
                    background: 'rgba(201, 162, 58, 0.08)',
                    borderRadius: '8px',
                    border: '1px solid rgba(201, 162, 58, 0.15)'
                }}>
                    <p style={{
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
                        lineHeight: '1.8',
                        margin: '0 0 0.5rem 0',
                        fontStyle: 'italic'
                    }}>
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
