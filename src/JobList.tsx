import { useState, useEffect } from 'react';

interface Job {
    id: string;
    company: string;
    position: string;
    status: string;
}

export function JobList() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/jobs');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setJobs(data);
            } catch (err: any) {
                setError(err.message ?? String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>My Applications</h2>
            {jobs.length === 0 ? (
                <p>No applications found.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {jobs.map(job => (
                        <li key={job.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px' }}>
                            <strong>{job.company}</strong> — {job.position} <br />
                            <span style={{ color: '#666', fontSize: '0.9em' }}>Estado: {job.status}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}