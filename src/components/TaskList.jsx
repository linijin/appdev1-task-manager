import { useEffect, useState } from 'react'
import '../App.css'
import { db } from '../firebase'
import { collection, doc, getDocs, deleteDoc, addDoc, updateDoc, getDoc } from "firebase/firestore";

const TaskList = ({user}) => {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchTasks = async () => {
    const collectionRef = collection(db, 'tasks');
    const querySnapshot = await getDocs(collectionRef);

    const tasks = querySnapshot.docs.map((task) => ({
      id: task.id,
      ...task.data() 
    }))
    setTasks(tasks)
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (id) => {

    const docRef = doc(db, 'tasks', id)
    await deleteDoc(docRef)

    setTasks((prevTasks) => prevTasks.filter(task => task.id !== id))
  }

  const addTask = async (e) => {
    e.preventDefault();
    const collectionRef = collection(db, 'tasks');
    await addDoc(collectionRef, {
      title: title,
      description: description,
      status: 'pending'
    })
    setTitle('')
    setDescription('')
  }

  const handleStatus = async (id) => {
    try {
      const itemRef = doc(db, 'tasks', id);
      const currentTask = await getDoc(itemRef);
      const currentStatus = currentTask.data().status;
      const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

      //use the updateDoc function to make changes in the database
      await updateDoc(itemRef, {
        status: newStatus,
      });

      //call this funciton to reflect changes in user perspective
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
      //of course there is a catch block incase there is an error
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      {/*ADDING TASKS COMPONENT*/}
      <div className="formStyle">
        <h3>Welcome, {user} </h3>
        <form onSubmit={addTask}>
          <input type="text" name="title" id="title" placeholder="title" value={title} required onChange={(e) => setTitle(e.target.value)} />
          <textarea name="desc" id="desc" placeholder="description" value={description} required onChange={(e) => setDescription(e.target.value)}></textarea>
          <button type="submit" onClick={() => { setTimeout(() => { window.location.reload() }, 1500) }}>Add Task</button>
        </form>
      </div>

      {/*DISPLAYING THE TASKS*/}

      <h3>Task Lists</h3>
      {
        tasks.map((task) => (
          <div key={task.id}>
            <div>
              Task title: {task.title}
            </div>
            <div>
              Task description: {task.description}
            </div>
            <div>
              Task status: {task.status}
              <button onClick={() => {handleStatus(task.id)}}>
                {task.status}
              </button>
            </div>
            <button onClick={() => deleteTask(task.id)}>
              Delete task
            </button>
          </div>

        ))
      }
    </>
  )
}

export default TaskList