import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function TeamManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const teamId = searchParams.get("team");

  const [teamName, setTeamName] = useState("");
  const [subteams, setSubteams] = useState([]);
  const [newSubteam, setNewSubteam] = useState("");

  // Load Team + Subteams
  const loadData = async () => {
    try {
      const teamRes = await fetch(`http://localhost:5000/team/${teamId}`);
      const team = await teamRes.json();

      setTeamName(team.team_name);

      const subRes = await fetch(
        `http://localhost:5000/subteams/${teamId}`
      );

      const subs = await subRes.json();

      setSubteams(subs);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add Subteam
  const addSubteam = async () => {
    if (newSubteam.trim() === "") {
      alert("Enter a subteam");
      return;
    }

    const response = await fetch(
      "http://localhost:5000/subteams",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team_id: teamId,
          subteam_name: newSubteam,
        }),
      }
    );

    const data = await response.json();

    alert(data.message);

    setNewSubteam("");

    loadData();
  };

  // Delete Subteam
  const deleteSubteam = async (id) => {
    if (!window.confirm("Delete subteam?")) return;

    await fetch(
      `http://localhost:5000/subteams/${id}`,
      {
        method: "DELETE",
      }
    );

    loadData();
  };

  // Rename Subteam
  const editSubteam = async (subteam) => {
    const newName = prompt(
      "Enter new name",
      subteam.subteam_name
    );

    if (!newName) return;

    await fetch(
      `http://localhost:5000/subteams/${subteam.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subteam_name: newName,
        }),
      }
    );

    loadData();
  };

  return (
    <div className="container">

      <button onClick={() => navigate("/admin")}>
        ← Back
      </button>

      <h1>{teamName}</h1>

      <h2>Subteams</h2>

      <input
        type="text"
        placeholder="Subteam Name"
        value={newSubteam}
        onChange={(e) => setNewSubteam(e.target.value)}
      />

      <button onClick={addSubteam}>
        Add Subteam
      </button>

      <hr />

      {subteams.length === 0 ? (
        <p>No subteams.</p>
      ) : (
        subteams.map((subteam) => (
          <div
            key={subteam.id}
            style={{
              border: "1px solid gray",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <h3>{subteam.subteam_name}</h3>

            <button
              onClick={() => editSubteam(subteam)}
            >
              Edit
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => deleteSubteam(subteam.id)}
            >
              Delete
            </button>

          </div>
        ))
      )}

    </div>
  );
}

export default TeamManagement;