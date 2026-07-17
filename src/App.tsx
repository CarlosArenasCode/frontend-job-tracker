import './index.css'
import { JobList } from './JobList'

function App() {
  return (
    <div>
      <h1>Job Application Tracker</h1>
      <hr />
      {/* 2. We paint the JobList component here */}
      <JobList />
      
    </div>
  )
}

export default App