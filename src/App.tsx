import { useState } from 'react'
import { JobList } from './JobList'
import { JobForm } from './JobForm'

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <header className="app-header">
        <h1>Job Tracker</h1>
        <p>Track your remote job applications.</p>
      </header>
      <JobForm onJobCreated={() => setRefreshKey(k => k + 1)} />
      <JobList key={refreshKey} />
    </div>
  )
}

export default App