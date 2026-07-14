import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    if (!loggedUser) {
      navigate("/");
      return;
    }

    setUser(loggedUser);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="container">

      <button onClick={() => navigate("/dashboard")}>
        ← Dashboard
      </button>

      <h1>My Profile</h1>

      <hr />

      <p>
        <strong>Name:</strong> {user.name}
      </p>

      <p>
        <strong>Username:</strong> {user.username}
      </p>

      <p>
        <strong>Role:</strong> {user.role}
      </p>

      <p>
        <strong>Team:</strong> {user.team_name}
      </p>

      <p>
        <strong>Subteam:</strong> {user.subteam_name}
      </p>

      <hr />

      <button onClick={logout}>
        Logout
      </button>

    </div>
  );
}

export default Profile;