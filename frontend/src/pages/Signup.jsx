import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [teams, setTeams] = useState([]);
  const [subteams, setSubteams] = useState([]);

  const [teamId, setTeamId] = useState("");
  const [subteamId, setSubteamId] = useState("");

  // Load all teams
  useEffect(() => {
    fetch("http://localhost:5000/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.log(err));
  }, []);

  // Load subteams whenever team changes
  useEffect(() => {
    if (!teamId) return;

    fetch(`http://localhost:5000/subteams/${teamId}`)
      .then((res) => res.json())
      .then((data) => {
        setSubteams(data);
        setSubteamId("");
      })
      .catch((err) => console.log(err));
  }, [teamId]);

  const handleSignup = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        username,
        password,
        team_id: teamId,
        subteam_id: subteamId,
      }),
    });

    const data = await response.json();

    alert(data.message);

    if (response.ok) {
      navigate("/");
    }
  };

  return (
    <div className="container">

      <h1>Create Account</h1>

      <form onSubmit={handleSignup}>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          required
        >
          <option value="">Select Team</option>

          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.team_name}
            </option>
          ))}
        </select>

        <select
          value={subteamId}
          onChange={(e) => setSubteamId(e.target.value)}
          required
        >
          <option value="">Select Subteam</option>

          {subteams.map((subteam) => (
            <option key={subteam.id} value={subteam.id}>
              {subteam.subteam_name}
            </option>
          ))}
        </select>

        <button type="submit">
          Sign Up
        </button>

      </form>

      <p>Already have an account?</p>

      <Link to="/">
        <button>
          Login
        </button>
      </Link>

    </div>
  );
}

export default Signup;