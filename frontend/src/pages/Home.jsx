function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="container">
      <h1>Welcome</h1>

      <h2>{user?.name}</h2>

      <p><strong>Username:</strong> {user?.username}</p>

      <p><strong>Team:</strong> {user?.team_name}</p>

      <p><strong>Subteam:</strong> {user?.subteam_name}</p>
    </div>
  );
}

export default Home;