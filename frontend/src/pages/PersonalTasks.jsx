import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PersonalTasks() {

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);

    const [title, setTitle] = useState("");
    const [deadline, setDeadline] = useState("");

    const addTask = () => {

        if(title.trim()===""){
            alert("Enter a task");
            return;
        }

        const newTask={
            id:Date.now(),
            title:title,
            deadline:deadline,
            status:"Pending"
        };

        setTasks([...tasks,newTask]);

        setTitle("");
        setDeadline("");

    };

    const deleteTask=(id)=>{

        setTasks(tasks.filter(task=>task.id!==id));

    };

    const completeTask=(id)=>{

        setTasks(
            tasks.map(task=>
                task.id===id
                ? {...task,status:"Completed"}
                :task
            )
        );

    };

    return(

        <div className="container">

            <button onClick={()=>navigate("/dashboard")}>
                ← Back
            </button>

            <h1>Personal Tasks</h1>

            <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
            />

            <input
                type="date"
                value={deadline}
                onChange={(e)=>setDeadline(e.target.value)}
            />

            <button onClick={addTask}>
                Add Task
            </button>

            <hr/>

            {tasks.length===0?

            <p>No Personal Tasks</p>

            :

            tasks.map(task=>(

                <div
                    key={task.id}
                    style={{
                        border:"1px solid gray",
                        borderRadius:"8px",
                        padding:"10px",
                        marginBottom:"10px"
                    }}
                >

                    <h3>{task.title}</h3>

                    <p>
                        Deadline :
                        {" "}
                        {task.deadline}
                    </p>

                    <p>
                        Status :
                        {" "}
                        {task.status}
                    </p>

                    <button
                        onClick={()=>completeTask(task.id)}
                    >
                        Complete
                    </button>

                    <button
                        style={{marginLeft:"10px"}}
                        onClick={()=>deleteTask(task.id)}
                    >
                        Delete
                    </button>

                </div>

            ))

            }

        </div>

    );

}

export default PersonalTasks;