import React, { useState, useEffect } from 'react';
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css';
import 'react-tabulator/lib/css/bootstrap/tabulator_bootstrap4.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'To Do',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
        const formattedTasks = response.data.slice(0, 20).map(task => ({
          id: task.id,
          title: task.title,
          description: `Task ${task.id} description`,
          status: task.completed ? 'Done' : 'To Do',
        }));
        setTasks(formattedTasks);
        setFilteredTasks(formattedTasks);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const addTask = () => {
    if (!newTask.title.trim() || !newTask.description.trim()) {
      toast.error('Please provide a title and description for the task.');
      return;
    }

    const taskToAdd = {
      id: tasks.length + 1,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
    };

    const updatedTasks = [...tasks, taskToAdd];
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    setNewTask({ title: '', description: '', status: 'To Do' });
    toast.success('Task added successfully!');
  };

  const deleteTask = (row) => {
    const taskId = row.getData().id;
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    toast.info('Task deleted successfully!');
  };

  const updateTask = (cell) => {
    const updatedTask = cell.getData();
    const updatedTasks = tasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    toast.success('Task updated successfully!');
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = tasks.filter(
      task =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
    );
    setFilteredTasks(filtered);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    const filtered = tasks.filter(task => !status || task.status === status);
    const finalFilteredTasks = filtered.filter(
      task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
    );
    setFilteredTasks(finalFilteredTasks);
  };

  const columns = [
    { title: 'Task ID', field: 'id', editor: false, width: 80, align: 'center' },
    { title: 'Title', field: 'title', editor: 'input' },
    { title: 'Description', field: 'description', editor: 'input' },
    {
      title: 'Status',
      field: 'status',
      editor: 'select',
      editorParams: { values: ['To Do', 'In Progress', 'Done'] },
    },
    {
      title: 'Actions',
      formatter: 'buttonCross',
      align: 'center',
      cellClick: (e, cell) => deleteTask(cell),
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 min-h-screen p-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">Task List Manager</h1>
        
        {/* Add Task Section */}
        <div className="bg-gray-100 rounded-lg p-4 shadow-md mb-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Add a New Task</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="border border-gray-300 rounded py-2 px-4 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="border border-gray-300 rounded py-2 px-4 focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              className="border border-gray-300 rounded py-2 px-4 focus:ring-2 focus:ring-blue-500"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded mt-4"
          >
            Add Task
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by Title or Description"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full sm:w-2/3 border border-gray-300 rounded py-2 px-3 focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="w-full sm:w-1/3 border border-gray-300 rounded py-2 px-3 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {/* Task Table */}
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
          <ReactTabulator
            data={filteredTasks}
            columns={columns}
            layout="fitData"
            responsiveLayout="collapse"
            cellEdited={(cell) => updateTask(cell)}
            className="border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
