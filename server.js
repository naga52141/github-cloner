require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const axios = require("axios"); // ✅ Fix 1: Import axios


const app = express();
const PORT =  process.env.PORT || 4000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src *; font-src * data:;");
    next();
});


// 🔹 Session Setup
app.use(
    session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// 🔹 GitHub OAuth Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:4000/auth/github/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, { profile, accessToken });
        }
    )
);

// 🔹 Serialize & Deserialize User
passport.serializeUser((user, done) => {
    done(null, { profile: user.profile, accessToken: user.accessToken });
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});


// 🔹 GitHub Auth Routes
app.get("/auth/github", passport.authenticate("github", { scope: ["repo", "user"] }));

app.get(
    "/auth/github/callback",
    passport.authenticate("github", {
        failureRedirect: "http://localhost:3000/login",
    }),
    (req, res) => {
        res.redirect("http://localhost:3000/dashboard");
    }
);

// 🔹 Get Logged-In User Info
app.get("/user", (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
});

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


const fs = require("fs");
const path = require("path");

app.post("/upload-files", upload.array("files"), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { repoName } = req.body;
    const accessToken = req.user.accessToken;
    const files = req.files;

    try {
        for (const file of files) {
            const content = fs.readFileSync(file.path, { encoding: "base64" });

            await axios.put(
                `https://api.github.com/repos/${req.user.profile.username}/${repoName}/contents/${file.originalname}`,
                {
                    message: `Updated ${file.originalname}`,
                    content: content,
                    branch: "main", // Modify based on your repo's branch
                },
                {
                    headers: { Authorization: `token ${accessToken}` },
                }
            );

            fs.unlinkSync(file.path); // Remove the file after upload
        }

        res.json({ message: "Files uploaded successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.response?.data?.message || "Failed to upload files" });
    }
});


// 🔹 Create a New Repository on GitHub
app.post("/create-repo", async (req, res) => {
    console.log("User Data:", req.user); // 🔍 Debugging line

    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { repoName, isPrivate } = req.body;
    const accessToken = req.user.accessToken;

    try {
        const response = await axios.post(
            "https://api.github.com/user/repos",
            {
                name: repoName,
                private: isPrivate || false,
                description: "Repository created via GitHub Cloner App",
            },
            {
                headers: { Authorization: `token ${accessToken}` },
            }
        );

        res.json({ message: "Repository created successfully!", repoUrl: response.data.html_url });
    } catch (error) {
        console.error("GitHub API Error:", error.response?.data);
        res.status(500).json({ error: error.response?.data?.message || "Failed to create repository" });
    }
});

const { exec } = require("child_process");


const desktopPath =
    process.platform === "win32"
        ? path.join(process.env.USERPROFILE, "Desktop", "Cloned-Repositories") // Windows
        : path.join(process.env.HOME, "Desktop", "ClonedRepos"); // Mac/Linux

app.post("/clone", (req, res) => {
    const { repoUrl } = req.body;

    if (!repoUrl) {
        return res.status(400).json({ error: "Repository URL is required." });
    }

    const cloneCommand = `git clone ${repoUrl} "${desktopPath}"`;

    exec(cloneCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Clone error: ${stderr}`);
            return res.status(500).json({ error: "Git clone failed." });
        }
        res.json({ message: "Repository cloned successfully!", output: stdout });
    });
});





    // Run the commands
   


app.get("/repos/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch repositories" });
    }
});

// 🔹 Logout
app.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("http://localhost:3000/");
    });
});
app.get("/", (req, res) => {
    res.send("GitHub OAuth Backend is Running!");

});

app.get("/debug-session", (req, res) => {
    res.json(req.user || { error: "No user session found" });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
