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
    const controller = new AbortController();
    
    const fetchJobs = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
        
        const response = await fetch(`${apiBaseUrl}/api/jobs`, { signal: controller.signal });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch jobs (${response.status})`);
        }
        
        const data = await response.json();
        
        if (!controller.signal.aborted) {
          setJobs(data);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        
        setError(err.message ?? String(err));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchJobs();

    return () => controller.abort();
  }, []); 

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>My Applications</h2>
      {jobs.length === 0 ? (
        <p>You haven't saved any job applications yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {jobs.map((job) => (
            <li key={job.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px' }}>
              <strong>{job.company}</strong> - {job.position} <br />
              <span style={{ color: '#666', fontSize: '0.9em' }}>Status: {job.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}