import { useState } from 'react';
import { JobList } from './JobList';
import { JobForm } from './JobForm';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleJobAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Job Application Tracker</h1>
      <hr style={{ marginBottom: '20px' }} />
      <JobForm onJobAdded={handleJobAdded} />
      <JobList refreshTrigger={refreshTrigger} />
    </div>
  )
}

export default App