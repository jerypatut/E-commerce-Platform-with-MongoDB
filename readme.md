# Login and Registration Application

This application provides a login and registration system with two user roles: **Admin** and **User**. Admins have full access to edit data, while Users have limited access. After registration, users will receive an email confirmation before they can log in.

## Technologies Used

- **Node.js**: v22.14.0
- **npm**: 10.9.2
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: React.js

## Features

### 1. Home Page

- The main page of the application with general information.
- Screenshot:
  ![Home Page](/scrinsut/beforelogin.png)
  ![After Login](/scrinsut/sudahverifikasih.png)

### 2. Login Page

- Users can log in using their registered email and password.
- Screenshot:
  ![Login Page](/scrinsut/loginkerja.png)

### 3. Registration Page

- New users can register by providing their name, email, and password.
- Users must confirm their email before they can log in.
- Screenshots:
  ![Registration Page](/scrinsut/registerconfimasion.png)
  ![Email Verification](/scrinsut/verifikasihemail.png)
  ![Verification Success](/scrinsut/verifikasih.png)
  - Users can log in only after clicking the confirmation code.

### 4. Forgot Password Page

- Users can reset their password by entering their registered email.
- A confirmation code will be sent via email.
- Screenshot:
  ![Forgot Password Page](/scrinsut/resetpassword.png)

### 5. Email Confirmation Page

- After registration, users must confirm their account via email before logging in.
- Screenshot:
  ![Email Confirmation Page](/scrinsut/verifikasih.png)

## How to Run the Application

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project-directory
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory and add the following configurations:

```env
MONGO_URI=mongodb://127.0.0.1:27017/login_app
PORT=5000
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

Create a `.env` file in the `frontend` directory and add the following configurations:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Run the Application

```bash
# Start the server
cd server
npm start

# Start the frontend
cd ../frontend
npm start
```

### 5. Access the Application

Open a browser and visit [http://localhost:3000](http://localhost:3000).

## Project Structure

```
/project-directory
|-- /backend
|-- /frontend
|-- /scrinsut
|-- readme.md
```

## Future Enhancements

- Password reset using OTP.
- Improved UI/UX.
- Admin dashboard for user management.

---

Developed by **[jerypatut]**.
