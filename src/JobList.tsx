import { useState, useEffect } from 'react';

interface Job {
    id: string;
    company: string;
    position: string;
    status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
}

const statusClass: Record<Job['status'], string> = {
    Applied: 'job-status--applied',
    Interview: 'job-status--interview',
    Offer: 'job-status--offer',
    Rejected: 'job-status--rejected',
};

export function JobList() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                if (!apiUrl) throw new Error('VITE_API_URL is not configured.');

                const response = await fetch(`${apiUrl}/api/jobs`);
                if (!response.ok) {
                    throw new Error(`Failed to load jobs (HTTP ${response.status} ${response.statusText})`);
                }
                const data = await response.json();
                setJobs(data);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) return <p className="state-message">Loading...</p>;
    if (error) return <p className="state-message state-message--error">Error: {error}</p>;

    return (
        <div>
            <h2>My Applications</h2>
            {jobs.length === 0 ? (
                <p className="state-message">No applications found.</p>
            ) : (
                <ul className="job-list">
                    {jobs.map(job => (
                        <li key={job.id} className="job-card">
                            <div className="job-card-info">
                                <span className="job-card-title">{job.position}</span>
                                <span className="job-card-company">{job.company}</span>
                            </div>
                            <span className={`job-status ${statusClass[job.status]}`}>
                                {job.status}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
