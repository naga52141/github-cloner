import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [newRepoName, setNewRepoName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedFiles] = useState([]);




  // ✅ Fetch GitHub User Info (OAuth)
  useEffect(() => {
    axios
      .get("http://localhost:4000/user", { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch(() => setUser(null));
  }, []);


  // ✅ Fetch Repositories
  const fetchRepos = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`http://localhost:4000/repos/${username}`);
      console.log("Response Status:", response.status); // Log status

      const text = await response.text(); // Read raw response
      console.log("Raw Response:", text); // Debugging

      // Try parsing as JSON
      const data = JSON.parse(text);
      if (data.error) throw new Error(data.error);

      setRepos(data);
    } catch (error) {
      console.error("Fetch Error:", error); // Debugging
      setMessage("Error fetching repositories.");
    }

    setLoading(false);
  };

  // ✅ Clone Repository
const cloneRepo = async (repo) => {
  setMessage("Cloning...");
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/clone`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl: repo.clone_url, repoName: repo.name }),
    });

    const result = await response.json();
    setMessage(result.message);
  } catch (error) {
    console.error("Clone Error:", error);
    setMessage("Error cloning repository.");
  }
};
console.log("Selected Files:", selectedFiles);
console.log("User:", user);
console.log("Repositories:", repos);
console.log("Loading:", loading);
console.log("Message:", message);
console.log("New Repository Name:", newRepoName);
console.log("Is Private:", isPrivate);

  // ✅ Create a New Repository

  const createRepo = async () => {
    if (!newRepoName) {
      setMessage("Please enter a repository name.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/create-repo",
        { repoName: newRepoName, isPrivate },
        { withCredentials: true }
      );

      setMessage(response.data.message);
      setNewRepoName(""); // Clear input after creation
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to create repository");
    }
  };


  const handleFileUpload = (repoName) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true; // Allow multiple file selection
    input.onchange = async (event) => {
      const files = event.target.files;
      if (files.length === 0) return;

      const formData = new FormData();
      formData.append("repoName", repoName);
      for (let file of files) {
        formData.append("files", file);
      }

      try {
        const response = await axios.post(
          "http://localhost:4000/upload-files",
          formData,
          { withCredentials: true }
        );

        setMessage(response.data.message);
      } catch (error) {
        setMessage(error.response?.data?.error || "Failed to upload files");
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      {/* ✅ GitHub OAuth Login Section */}
      <h1 className="text-2xl font-bold mb-4 text-white">GitHub  Login</h1>
      {user ? (
        <div className="text-center mb-4">
          <p>Welcome, {user.profile.displayName}!</p>
          <img
            src={user.profile.photos[0].value}
            alt="Profile"
            width="50"
            className="rounded-full my-2"
          />
          <br />
          <a href="http://localhost:4000/logout">
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              Logout
            </button>
          </a>
        </div>
      ) : (
        <a href="http://localhost:4000/auth/github">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Login with GitHub
          </button>
        </a>
      )}


      {/* ✅ Repo Fetch Section */}
      <h1 className="text-2xl font-bold mt-6">Your Repositories</h1>
      <input
        className="border p-2 rounded mb-2"
        type="text"
        placeholder='Enter GitHub Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={fetchRepos}
      >
        Search
      </button>

      {loading && <p>Loading...</p>}
      {message && <p className="mt-2">{message}</p>}



      {/* ✅ Repositories Display Section */}
      <div className="repo-grid">
        {repos.map((repo) => (
          <div key={repo.id} className="repo-card">
            <h3>{repo.name}</h3>
            <p>{repo.description || "No description available"}</p>

            <div className="button-group">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => window.open(repo.html_url, "_blank")}
              >
                View Repository
              </button>
              
              <button
                className="bg-green-500 text-white px-3 py-1 rounded ml-2"
                onClick={() => cloneRepo(repo)}
              >
                Clone
              </button>
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded ml-2"
                onClick={() => handleFileUpload(repo.name)}
              >
                Update
              </button>

            </div>
          </div>
        ))}



        <div className="create-repo-container">
          <h2>Create a GitHub Repository</h2>
          <input
            type="text"
            placeholder="Enter repository name"
            value={newRepoName}
            onChange={(e) => setNewRepoName(e.target.value)}
          />
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
            />
            <label> Private Repository</label>
          </div>
          <button className="create-repo-btn" onClick={createRepo}>
            Create Repository
          </button>

          {message && <p className="message">{message}</p>}
        </div>

      </div>
    </div >
  );
}
