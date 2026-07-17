import { useState, useEffect } from 'react';

interface Job {
  id: string;
  company: string;
  position: string;
  status: string;
}

export function JobList({ refreshTrigger = 0 }: { refreshTrigger?: number }) {
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
        setError(err?.message ?? String(err));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchJobs();
    return () => controller.abort();
  }, [refreshTrigger]); 

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job application?')) return;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
      const response = await fetch(`${apiBaseUrl}/api/jobs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting the job application');
      }

      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    } catch (err: any) {
      alert(`Error: ${err?.message ?? String(err)}`); 
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
      
      const response = await fetch(`${apiBaseUrl}/api/jobs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job status');
      }

      setJobs((prevJobs) => 
        prevJobs.map((job) => 
          job.id === id ? { ...job, status: newStatus } : job
        )
      );

    } catch (err: any) {
      alert(`Error updating status: ${err?.message ?? String(err)}`);
    }
  };

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>My Job Applications</h2>
      {jobs.length === 0 ? (
        <p>You haven't saved any job applications yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {jobs.map((job) => (
            <li key={job.id} style={{ 
              border: '1px solid #ccc', 
              margin: '10px 0', 
              padding: '15px', 
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ fontSize: '1.2em' }}>{job.company}</strong> - {job.position} <br />
                
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#666', fontSize: '0.9em' }}>Status:</span>
                  
                  <select 
                    value={job.status} 
                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                    style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      border: '1px solid #aaa',
                      backgroundColor: job.status === 'Applied' ? '#e2e3e5' : 
                                       job.status === 'Interview' ? '#fff3cd' : 
                                       job.status === 'Offer' ? '#d1e7dd' : '#f8d7da'
                    }}
                  >
                    <option value="Applied">Applied (Sent)</option>
                    <option value="Interview">Interview (Interview)</option>
                    <option value="Offer">Offer (Offer)</option>
                    <option value="Rejected">Rejected (Rejected)</option>
                  </select>
                </div>

              </div>
              <button 
                onClick={() => handleDelete(job.id)}
                style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}