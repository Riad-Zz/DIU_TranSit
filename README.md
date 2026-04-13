#  RouteSync — Transport Management Platform

RouteSync is a modern, comprehensive university transport management platform. It allows students to view real-time dynamic bus schedules, apply for transport cards, and manage their academic profiles. For administrators, it functions as a centralized dashboard to oversee the fleet, approve student applications, and track financial records securely.



## **Tech Stack**

![React](https://skillicons.dev/icons?i=react) ![HTML](https://skillicons.dev/icons?i=html) ![CSS](https://skillicons.dev/icons?i=css) ![JS](https://skillicons.dev/icons?i=js) ![NodeJS](https://skillicons.dev/icons?i=nodejs) ![Express](https://skillicons.dev/icons?i=express) ![Supabase](https://skillicons.dev/icons?i=supabase) ![PostgreSQL](https://skillicons.dev/icons?i=postgresql) ![MUI](https://skillicons.dev/icons?i=mui) ![Tailwind](https://skillicons.dev/icons?i=tailwind) ![Firebase](https://skillicons.dev/icons?i=firebase) ![Git](https://skillicons.dev/icons?i=git) ![GitHub](https://skillicons.dev/icons?i=github)

### **Technology Table**

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| **Frontend**   | React 19, HTML5, CSS3, JavaScript, MUI, DaisyUI, Tailwind CSS, Axios, TanStack React Query, React Router, React Hook Form, Lottie React, React Icons, React Spinners, React Toastify, SweetAlert2, Swiper, React Fast Marquee |
| **Backend**    | Node.js, Express.js, Firebase Authentication, JWT |
| **Database**   | Supabase, PostgreSQL |



## **Core Features & Workflow**

### 🧑‍🎓 **Student Workflow (Step by Step)**

Here's how a student uses the platform from start to finish:

#### **1. Authentication - Creating an Account & Logging In**
- New users can **sign up** using their email and password via Firebase Authentication.
- After signup, users can **log in** securely to access their personalized dashboard.
- Firebase handles all password security, so your data stays safe.

#### **2. Viewing Bus Schedule - Even Without Login**
- Anyone (even without logging in) can visit the **/schedule** page to see bus routes and timings.
- This is useful for new students or parents who just want to check bus availability.
- However, to see **detailed bus information** (like stop sequences, fare, or real-time updates), the user must be logged in.

#### **3. Private Route Protection - Login Required for Details**
- When a logged-out user tries to click on a specific bus route to see details, the system **blocks them**.
- They are automatically redirected to the **Login page**.
- After successful login, they are taken back to the bus details page they wanted to see.
- This is called **Private Route** protection — only authenticated users can access certain pages.

#### **4. Profile Verification - Getting the "Student" Role**
- After logging in for the first time, the user is just a "registered user" — not yet a verified student.
- They must go to the **/profile** page and complete their **verification** (fill in details like student ID and email.).
- Once verification is complete, their role changes from `non-student` to `student`.
- **Only verified students** can apply for a transport card. Unverified users cannot access the card application form.

#### **5. Card Application - Only for Verified Students**
- Verified students can fill out a **multi-step application form** to request a transport card.
- The form automatically calculates the **fee based on their semester** (e.g., final year students might pay less).
- After submitting, the application status shows as **pending** until an admin reviews it.

#### **6. Bus Details Page - Fare or Free?**
- When a student clicks on any bus route from the schedule, they go to the **Bus Details page**.
- On this page, the system checks two things:
  - **Does the student have an approved transport card?** (Status = `active`)
  - **Is the student logged in?**
- **If the student has an active card:** The page shows **"Ride is FREE — Your card covers this trip"** with a green badge.
- **If the student does NOT have a card:** The page shows **"Fare: $X.XX"** and a button to **"Pay Now"** before they can ride.
- This encourages students to apply for cards to save money on daily travel.

---

### 👨‍💻 **Admin Workflow (Step by Step)**

Admins have a special dashboard with full control over the system. Here's what they can do:

#### **1. Dashboard Overview - See Everything at a Glance**
- When an admin logs in, they see a **dashboard** with key statistics:
  - **Total Revenue Collected** (from bus fares and card fees)
  - **Total Applications Pending** (students waiting for card approval)
  - **Total Active Cards** (number of students riding with cards)
  - **Total Buses in Fleet**
- This helps admins understand the system's health quickly.

#### **2. Card Processing - Approve or Reject Student Applications**
- Admins go to the **Card Management** page to see all student card applications.
- Each application shows:
  - Student name, ID, department, semester
  - Application date and calculated fee
  - Current status (`pending`, `active`, or `none`)
- Admins can:
  - **Approve** an application → status changes from `pending` to `active`. Student can now ride for free.
  - **Reject** an application → status changes from `pending` to `none`. Student gets notified and can reapply.
- Optionally, admins can add a **rejection reason** (e.g., "Invalid student ID provided").

#### **3. Fleet Management - Full Control Over Buses**
- Admins can go to **Manage Buses** page to control the entire fleet.
- **Add a new bus route:**
  - Fill out a form with: Bus number, route name (e.g., "North Campus to Main Gate"), stops in order (comma-separated), departure times, operating days, and fare amount.
  - New route appears instantly on the student schedule page.
- **Edit an existing bus route:**
  - Change timings, add/remove stops, update fare, or modify days of operation.
- **Delete a bus route:**
  - Remove a route completely (e.g., if it's discontinued for the semester).
  - System asks for confirmation before deleting to avoid accidents.

#### **4. User Management - Assign or Revoke Admin Roles**
- Admins can view a list of all registered users on the **Manage Users** page.
- For any user, they can:
  - **Make Admin:** Promote a trusted student/staff to admin role. This gives them access to the full dashboard.
  - **Revoke Admin Access:** Demote an existing admin back to a normal student role.
  - **Delete User:** Completely remove a user from the database (use carefully — this deletes their profile and application history).

#### **5. Payment Status Tracking**
- Admins can see all payment transactions on the **Payment Management** page.
- Each payment record shows:
  - Student name who paid
  - Payment amount
  - Payment purpose (card fee or single ride fare)
  - Date and time of payment
- This helps track revenue and identify any payment issues.

---

### ⚙️ **System Features (How It Works Under the Hood)**

These are the technical features that make the platform secure and smooth:

#### **1. JWT-Secured APIs - Safe Communication**
- Every time the frontend (React app) talks to the backend (Node.js/Express), it sends a **JSON Web Token (JWT)**.
- This token comes from Firebase after a user logs in.
- The backend checks the token before processing any request — if the token is invalid or missing, the request is rejected.
- This ensures that only authenticated users can access protected data like applications, payments, and bus management.

#### **2. Axios Interceptors - Automatic Token Injection**
- Axios is used to make HTTP requests from React to the backend.
- An **interceptor** is a piece of code that runs before every request is sent.
- The interceptor automatically:
  - Grabs the current user's Firebase token
  - Injects it into the request headers (`Authorization: Bearer <token>`)
- This means developers don't have to manually attach tokens for every API call — it happens automatically.

#### **3. Granular Route Protection - Three Levels of Access**
The platform has **three custom route guards** to control who can see what:

| Guard Name | What it does | Example |
|------------|--------------|---------|
| **PrivateRoute** | Blocks unauthenticated users (not logged in) | Bus details page, Profile page |
| **StudentRoute** | Blocks non-student users (logged in but not verified) | Card application form |
| **AdminRoute** | Blocks non-admin users (even if they are students) | Dashboard, Manage Buses, Card Management |

**How it works:**
- When a user tries to visit a protected page, the guard checks their authentication status and role.
- If they pass the check, they see the page.
- If they fail, they are redirected to:
  - Login page (for PrivateRoute)
  - Profile verification page (for StudentRoute)
  - "Access Denied" or Home page (for AdminRoute)

#### **4. Real-Time Fare Logic**
- When a student views a bus route, the system checks:
  ```javascript
  if (user.hasActiveCard) {
    showMessage("FREE - Your card covers this trip");
  } else {
    showFare("$2.50");
    showButton("Pay Now");
  }
#### **5. Folder Structure**
The architecture follows a modular, feature-based approach designed for scalability:

```text
src/
├── assets/             # Static files, images, and global SVGs
├── Componets/          # Reusable UI elements (Loader, Forbidden, VarifyError)
├── Firebase/           # Firebase configuration and initialization
├── hooks/              # Custom data-fetching hooks (useAxios, useLoggedInUser)
├── Layout/             # Main structural layouts
│   ├── AuthLayout/     # Wraps Login/Register pages
│   ├── Dashboard/      # Wraps Admin UI with Sidebar
│   └── Root/           # Main public/student facing layout
├── Pages/              # Application Views
│   ├── Authentication/ # Login & Register
│   ├── BusDetails/     # Dynamic route info by ID
│   ├── CardApply/      # Multi-step transport card form
│   ├── Contact/        # Contact and support page
│   ├── DashboardPages/ # Overview, Manage, CardManagement, PaymentManagement
│   ├── Error/          # 404 and Error boundary pages
│   ├── Home/           # Landing page elements
│   ├── Profile/        # Student information display
│   ├── Scedule/        # Dynamic bus search interface
│   └── Shared/         # Shared page components (Navbar, Footer)
├── Providers/          # Context API & Route Gatekeepers
│   ├── AdminRoute/     # Blocks non-admins
│   ├── AuthProvider/   # Distributes Firebase user state
│   ├── PrivateRoute/   # Blocks unauthenticated users
│   └── StudentRoute/   # Blocks non-student users
├── Router/             # Central React Router configuration (Router.jsx)
├── App.css             # Global application styles
├── App.jsx             # Root React component
└── index.css           # Tailwind directives and base styles

```
# Getting Started

This guide explains how to set up, run, and deploy the project in a clean and structured way.

## Prerequisites

Make sure your environment is properly configured before starting:

* **Node.js (v14 or higher)** — runtime for the application
* **npm or yarn** — dependency management
* **Firebase account** — required for authentication

Check Node.js installation:

```bash id="p6y2r1"
node -v
```

## Installation

### Clone the Repository

```bash id="f2k8sa"
git clone https://github.com/Riad-Zz/DIU_TranSit.git
cd DIU_TranSit
```

### Install Dependencies

Install all required packages:

```bash id="l3v9q0"
npm install
# or
yarn install
```

## Environment Setup

Create a `.env` file in the root directory and configure the following:

```env id="z8k1ux"
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=your_backend_url
```

Ensure all values are correctly set before running the project.

## Running the Application

Start the development server:

```bash id="x2j4bn"
npm run dev
# or
yarn dev
```

The app will be available at:
`http://localhost:5173`

## Production Build

Create an optimized build:

```bash id="y7c1mw"
npm run build
# or
yarn build
```

The output will be generated inside the `dist/` directory.

## API Endpoints
```
| Method | Endpoint                | Description         | Access  |
| ------ | ----------------------- | ------------------- | ------- |
| GET    | `/api/buses`            | Get all bus routes  | Public  |
| GET    | `/api/buses/:id`        | Get bus details     | Public  |
| POST   | `/api/buses`            | Create a route      | Admin   |
| PUT    | `/api/buses/:id`        | Update route        | Admin   |
| DELETE | `/api/buses/:id`        | Delete route        | Admin   |
| GET    | `/api/applications`     | Get applications    | Admin   |
| POST   | `/api/applications`     | Submit application  | Student |
| PUT    | `/api/applications/:id` | Update status       | Admin   |
| GET    | `/api/payments`         | Get payment records | Admin   |
```
```
This api endpoints are not actuall api endpoint names , they are here to describe the project structure
```
## Environment Variables
```
| Variable                            | Description             | Required |
| ----------------------------------- | ----------------------- | -------- |
| `VITE_FIREBASE_API_KEY`             | Firebase API key        | Yes      |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase auth domain    | Yes      |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase project ID     | Yes      |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket | Yes      |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID      | Yes      |
| `VITE_FIREBASE_APP_ID`              | Firebase app ID         | Yes      |
| `VITE_API_BASE_URL`                 | Backend API base URL    | Yes      |
```
## Deployment

### Prepare Build

```bash id="m4k2du"
npm run build
```

### Preview Build

```bash id="b1r8kp"
npm run preview
```

### Deploy Options

#### Vercel

* Install CLI:

  ```bash
  npm install -g vercel
  ```
* Run deployment:

  ```bash
  vercel
  ```

#### Netlify

* Connect your GitHub repository
* Set build command: `npm run build`
* Set publish directory: `dist`

## Contributing

1. Fork the repository
2. Create a feature branch

```bash id="p9d3wl"
git checkout -b feature/AmazingFeature
```

3. Commit your changes

```bash id="k8u1zh"
git commit -m "Add some AmazingFeature"
```

4. Push to GitHub

```bash id="c2n7as"
git push origin feature/AmazingFeature
```

5. Open a Pull Request

## Development Guidelines

* Follow existing code style
* Write clear commit messages
* Update documentation when needed
* Test thoroughly before submitting

## Backend Repository Link to know more About DATABASE and API 
```
https://github.com/Riad-Zz/DIU_TranSit_Server
```
