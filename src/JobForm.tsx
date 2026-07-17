import { useState, type FormEvent } from 'react';

export function JobForm({ onJobAdded }: { onJobAdded: () => void }) {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
      
      const response = await fetch(`${apiBaseUrl}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company, position }),
      });

      if (!response.ok) {
        throw new Error('Error saving the job application');
      }

      setCompany('');
      setPosition('');
      onJobAdded();

    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>Add Job Application</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Company (e.g., Spotify)" 
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
        />
        <input 
          type="text" 
          placeholder="Position (e.g., Backend Developer)" 
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
        />
        <button 
          type="submit" 
          disabled={loading} 
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}