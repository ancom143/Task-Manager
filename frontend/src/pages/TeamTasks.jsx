import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TeamTasks.css";

function TeamTasks() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    if (!loggedInUser) {
      navigate("/");
      return;
    }

    setUser(loggedInUser);

    loadTasks(loggedInUser);
  }, []);

  const loadTasks = async (loggedInUser) => {
    try {
      const response = await fetch(
        `http://localhost:5000/team_tasks/${loggedInUser.team_id}/${loggedInUser.subteam_id}`
      );

      const data = await response.json();

      setTasks(data);

    } catch (err) {
      console.log(err);
    }
  };

  const addTask = async () => {

    if (title.trim() === "") {
      alert("Enter task title");
      return;
    }

    const response = await fetch(
      "http://localhost:5000/team_tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          deadline,
          team_id: user.team_id,
          subteam_id: user.subteam_id,
        }),
      }
    );

    const data = await response.json();

    alert(data.message);

    setTitle("");
    setDescription("");
    setDeadline("");

    loadTasks(user);
  };

  const deleteTask = async (id) => {

    await fetch(
      `http://localhost:5000/team_tasks/${id}`,
      {
        method: "DELETE",
      }
    );

    loadTasks(user);
  };

  const completeTask = async (id) => {

    await fetch(
      `http://localhost:5000/team_tasks/${id}`,
      {
        method: "PUT",
      }
    );

    loadTasks(user);
  };

  if (!user) return <h2>Loading...</h2>;

  return (

    <div className="container">

      <button onClick={() => navigate("/dashboard")}>
        ← Dashboard
      </button>

      <h1>Team Tasks</h1>

      <h3>{user.team_name}</h3>

      <h4>{user.subteam_name}</h4>

      <hr />

      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <button onClick={addTask}>
        Add Team Task
      </button>

      <hr />

      {tasks.length === 0 ? (

        <p>No Team Tasks</p>

      ) : (

        tasks.map((task) => (

          <div
            key={task.id}
            style={{
              border: "1px solid gray",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "12px",
            }}
          >

            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <p>
              <strong>Deadline:</strong> {task.deadline}
            </p>

            <p>
              <strong>Status:</strong> {task.status}
            </p>

            <button
              onClick={() => completeTask(task.id)}
            >
              Complete
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>

          </div>

        ))

      )}

    </div>

  );
}

export default TeamTasks;