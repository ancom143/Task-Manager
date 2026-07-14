import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");

  // Load all teams
  const loadTeams = async () => {
    try {
      const response = await fetch("http://localhost:5000/teams");
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  // Add Team
  const addTeam = async () => {
    if (teamName.trim() === "") {
      alert("Enter a team name");
      return;
    }

    const response = await fetch("http://localhost:5000/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team_name: teamName,
      }),
    });

    const data = await response.json();

    alert(data.message);

    setTeamName("");
    loadTeams();
  };

  // Delete Team
  const deleteTeam = async (id) => {
    if (!window.confirm("Delete this team?")) return;

    await fetch(`http://localhost:5000/teams/${id}`, {
      method: "DELETE",
    });

    loadTeams();
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="admin-container">

      <h1>Admin Dashboard</h1>

      <button onClick={logout}>
        Logout
      </button>

      <hr />

      <h2>Create Team</h2>

      <input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />

      <button onClick={addTeam}>
        Add Team
      </button>

      <hr />

      <h2>Existing Teams</h2>

      {teams.length === 0 ? (
        <p>No teams created.</p>
      ) : (
        teams.map((team) => (
          <div
            key={team.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >

            <h3>{team.team_name}</h3>

            {/* Team Task Dashboard */}
            <button
              onClick={() =>
                navigate(`/team-dashboard?team=${team.id}`)
              }
            >
              View Team Dashboard
            </button>


            {/* Manage Subteams */}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() =>
                navigate(`/teams?team=${team.id}`)
              }
            >
              Manage Subteams
            </button>


            {/* Delete Team */}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => deleteTeam(team.id)}
            >
              Delete
            </button>

          </div>
        ))
      )}

    </div>
  );
}

export default AdminDashboard;