import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { db } from '../firebase.js';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { SignOut } from './SignOut.jsx';

const TaskList = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from Firestore
  const fetchTasks = async () => {
    try {
      const collectionRef = collection(db, 'tasks');
      const querySnapshot = await getDocs(collectionRef);
      const tasksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task
  const addTask = async (e) => {
    e.preventDefault();
    const collectionRef = collection(db, 'tasks');
    const newTask = {
      title: newTitle,
      description: newDescription,
      status: 'pending',
    };
    const docRef = await addDoc(collectionRef, newTask);
    setTasks([...tasks, { id: docRef.id, ...newTask }]);
    setNewTitle('');
    setNewDescription('');
  };

  // Toggle task status
  const handleToggleStatus = async (id, currentStatus) => {
    const taskRef = doc(db, 'tasks', id);
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    await updateDoc(taskRef, { status: newStatus });
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
    );
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    const taskRef = doc(db, 'tasks', id);
    await deleteDoc(taskRef);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="formStyle">
      <h1>Task Manager</h1>
      <h3> Welcome <span></span> , {user.email || user.displayName} <SignOut/> </h3>
      <form className='box' onSubmit={addTask}>
        <input type="text" value={newTitle} placeholder="Title" required onChange={(e) => setNewTitle(e.target.value)} />
        <textarea value={newDescription} placeholder="Description" required onChange={(e) => setNewDescription(e.target.value)}></textarea>
        <button type="submit">
          <FaPlus /> Add Task
        </button>
      </form>

      <ul>
      <h3>Task Lists</h3>
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div>
              Task title: <strong>{task.title}</strong>
            </div>
            <div>
              Task description: <p>{task.description}</p>
            </div>
            <div>
              Task status: {task.status}
              <button onClick={() => handleToggleStatus(task.id, task.status)}>
                {task.status === 'pending' ? 'Pending' : 'Completed'}
              </button>
              <button onClick={() => handleDeleteTask(task.id)}>
                <MdDelete /> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList ;
