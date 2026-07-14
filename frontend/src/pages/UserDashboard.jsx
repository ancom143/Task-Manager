import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    if (!loggedInUser) {
      navigate("/");
      return;
    }

    setUser(loggedInUser);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="container">

      <h1>User Dashboard</h1>

      <button onClick={logout}>
        Logout
      </button>

      <hr />

      <h2>Welcome, {user.name}</h2>

      <p>
        <strong>Username:</strong> {user.username}
      </p>

      <p>
        <strong>Team:</strong> {user.team_name}
      </p>

      <p>
        <strong>Subteam:</strong> {user.subteam_name}
      </p>

      <hr />

      <h2>Quick Actions</h2>

      <button
        onClick={() => navigate("/personal-tasks")}
      >
        Personal Tasks
      </button>

      <br /><br />

      <button
        onClick={() => navigate("/team-tasks")}
      >
        Team Tasks
      </button>

      <br /><br />

      <button
        onClick={() => navigate("/profile")}
      >
        My Profile
      </button>

    </div>
  );
}

export default UserDashboard;