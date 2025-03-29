# 🚀 GitHub Repo Cloner  

A simple web application that allows users to **authenticate with GitHub**, **fetch repositories**, **clone repositories**, and **upload files** to them.

## 🌟 Features  
- 🔑 **GitHub OAuth Login** using Passport.js  
- 📁 **Fetch Repositories** of a given GitHub username  
- 🔄 **Clone Repositories** with a single click  
- 📤 **Upload Files** to selected repositories  
- 🛠 **Create New Repositories** from the UI  
- 🎨 **Responsive UI** with Tailwind CSS  

---  

## 🛠 Tech Stack  

### **Frontend (React.js)**  
- React.js (useState, useEffect, axios)  
- Tailwind CSS  
- GitHub OAuth Authentication  

### **Backend (Node.js, Express.js)**  
- Node.js & Express.js  
- MongoDB (for user sessions)  
- Passport.js (GitHub OAuth)  
- Axios & Fetch API  
- dotenv for environment variables  

---  

## 📂 Project Setup  

### **1️⃣ Clone the Repository**  
```sh  
git clone https://github.com/your-username/github-repo-cloner.git  
cd github-repo-cloner  
```  

### **2️⃣ Install Dependencies**  

#### **Frontend**  
```sh  
cd client  
npm install  
```  

#### **Backend**  
```sh  
cd server  
npm install  
```  

### **3️⃣ Set Up Environment Variables**  

Create a `.env` file inside the **backend** directory:  
```sh  
PORT=4000  
MONGO_URI=your_mongodb_connection_string  
GITHUB_CLIENT_ID=your_github_client_id  
GITHUB_CLIENT_SECRET=your_github_client_secret  
FRONTEND_URL=http://localhost:3000  
SESSION_SECRET=your_session_secret  
```  

In the **frontend**, create a `.env` file:  
```sh  
REACT_APP_BACKEND_URL=http://localhost:4000  
```  

### **4️⃣ Start the Application**  

#### **Start Backend**  
```sh  
cd server  
node server.js  
```  

#### **Start Frontend**  
```sh  
cd client  
npm start  
```  

🔹 Open **`http://localhost:3000`** in your browser!  

---  

## 🚀 Usage Guide  
1️⃣ **Login with GitHub**  
2️⃣ **Search for a GitHub username** to fetch their repositories  
3️⃣ **Click "Clone"** to clone a repository  
4️⃣ **Click "Update"** to upload files  
5️⃣ **Create a new repository** from the UI  

---  

## 💡 Screenshots  
<img width="1470" alt="Screenshot 2025-03-29 at 2 24 34 PM" src="https://github.com/user-attachments/assets/66c54f7b-09a4-42ad-a1a9-d9e2a0069e08" />
<img width="1470" alt="Screenshot 2025-03-29 at 2 24 59 PM" src="https://github.com/user-attachments/assets/a9ae70e0-856c-4ced-a6a0-a8d4df575c73" />
<img width="1470" alt="Screenshot 2025-03-29 at 2 27 19 PM" src="https://github.com/user-attachments/assets/f18126fd-78b3-4991-8c76-cacd433c8622" />



---  

## 🛠 Contributing  
Want to improve this project? Fork the repository and submit a pull request!  

---  

## 📜 License  
This project is **MIT Licensed**. Feel free to use and modify it.  

---  

🎉 **Enjoy using GitHub Repo Cloner!** 🚀  
If you like it, give it a ⭐ on [GitHub](https://github.com/your-username/github-repo-cloner) 😊  
