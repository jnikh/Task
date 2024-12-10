import React from 'react'
import { ReactTabulator } from 'react-tabulator'
import 'react-tabulator/lib/styles.css';
import 'react-tabulator/lib/css/bootstrap/tabulator_bootstrap4.min.css';
import axios  from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'

const App = () => {
  const [task , setTask] = useState([]);
  const [statusFilter , setStatusFilter] = useState('')

  useEffect(()=>{
      const fetchData = async () =>{
        try {
          const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
          const formatedTask= response.data.slice(0,20).map(task =>({
            id:task.id,
            title:task.title,
            desription: `Task ${task.id} description`,
            staus: task.completed ? 'Done': 'To Do'
          }));
          setTask(formatedTask)
        } catch (error) {
           console.log({message:error.message})
        }
      }
      fetchData()
  },[])
  return (
    <div>
       
    </div>
  )
}

export default App
