# Technotes full stack app - Back End

Full Stack app for a business to keep track of notes.
General Landing page with Employee Access button on the bottom
There are 3 user access levels - Admin, Manager and Employee
Users are required to login at least once per week
Employees can only create and read their own notes
Managers and Admins can assign notes to a specific employee, and they can revoke access, they can also delete notes
Only Managers and Admins can create a New User

#### **Live Preview:**  https://technotes-gzcj.onrender.com/
I created a test user:
**username:** TestUser
**password:** hellouser

---

-   Based on [MERN Stack Tutorial](https://www.youtube.com/watch?v=H-9l-gTq-C4) by Dave Gray
  
  **Front End:**
-   React, React Redux, RTK Query
-   Authentication with JWT Access, Refresh Tokens, Cookies
-   Persist login state on refresh
-   User-role based access control & permissions

**Back End:**
- Express.js
- MongoDB
- Node.js
## Run Locally:
Clone the project
```
git clone https://github.com/netmagik/technotes-api
```

Go to the project directory
```
cd server
```
Install dependencies
```
npm install
```
Start the server
```
npm run start
```