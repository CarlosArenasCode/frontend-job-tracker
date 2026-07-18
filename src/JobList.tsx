import { useState, useEffect } from 'react';

type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

interface Job {
    id: string;
    company: string;
    position: string;
    status: ApplicationStatus;
}

interface JobListProps {
    onJobDeleted: () => void;
}

const statusClass: Record<ApplicationStatus, string> = {
    Applied: 'job-status--applied',
    Interview: 'job-status--interview',
    Offer: 'job-status--offer',
    Rejected: 'job-status--rejected',
};

export function JobList({ onJobDeleted }: JobListProps) {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchJobs = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                if (!apiUrl) throw new Error('VITE_API_URL is not configured.');

                const response = await fetch(`${apiUrl}/api/jobs`, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`Failed to load jobs (HTTP ${response.status} ${response.statusText})`);
                }
                const data = await response.json();
                if (!controller.signal.aborted) {
                    setJobs(data);
                }
            } catch (err: unknown) {
                if (err instanceof Error && err.name === 'AbortError') return;
                const message = err instanceof Error ? err.message : String(err);
                setError(message);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchJobs();
        return () => controller.abort();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this application?')) return;

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            if (!apiUrl) throw new Error('VITE_API_URL is not configured.');

            const response = await fetch(`${apiUrl}/api/jobs/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`Failed to delete application (HTTP ${response.status})`);
            }

            setJobs(prev => prev.filter(job => job.id !== id));
            onJobDeleted();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            alert(message);
        }
    };

    const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            if (!apiUrl) throw new Error('VITE_API_URL is not configured.');

            const response = await fetch(`${apiUrl}/api/jobs/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) {
                throw new Error(`Failed to update status (HTTP ${response.status})`);
            }

            setJobs(prev => prev.map(job => job.id === id ? { ...job, status: newStatus } : job));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            alert(message);
        }
    };

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
                            <div className="job-card-actions">
                                <select
                                    aria-label="Status"
                                    className={`job-status ${statusClass[job.status]}`}
                                    value={job.status}
                                    onChange={e => handleStatusChange(job.id, e.target.value as ApplicationStatus)}
                                >
                                    <option value="Applied">Applied</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Offer">Offer</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                                <button
                                    className="btn-danger"
                                    onClick={() => handleDelete(job.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}