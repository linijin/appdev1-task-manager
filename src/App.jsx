import { useState } from 'react'
import TaskList from './components/TaskList'

function App() {
  const [user, setUser] = useState('Lenie Jane')

  return (
    <div>
      <h1>Task Manager</h1>
      {user ? (
        <TaskList user={user} />
      ) : (
        <p>You must login to view the task lists</p>
      )}
    </div>
  );
};

export default App;
