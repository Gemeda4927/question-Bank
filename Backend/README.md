# Backend API - Educational Platform

A comprehensive Node.js/Express backend for an educational platform with course management, exam systems, payment integration, and user authentication.

## Features

- **User Authentication**: JWT-based authentication with role-based access control (student, instructor, admin)
- **Course Management**: Full CRUD operations for courses with prerequisites and instructor assignments
- **Exam System**: Create and manage exams with questions, support for multiple question types
- **Payment Integration**: Chapa payment gateway integration for course and exam payments
- **Subscription Management**: Track student subscriptions to courses and individual exams
- **Soft Delete**: Soft delete functionality for users, courses, exams, and questions
- **University/College/Faculty Structure**: Hierarchical organization structure

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Payment Gateway**: Chapa (Ethiopian payment processor)
- **File Upload**: Cloudinary integration
- **Environment Variables**: dotenv

## Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `config.env` file in the root directory (use `config.env.example` as template):
   \`\`\`env
   NODE_ENV=development
   PORT=5000
   DATABASE=mongodb+srv://username:<PASSWORD>@cluster.mongodb.net/dbname
   DATABASE_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   CHAPA_SECRET_KEY=your_chapa_key
   FRONTEND_URL=http://localhost:3000
   BASE_URL=http://localhost:5000
   \`\`\`

4. Start the server:
   \`\`\`bash
   npm start
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/v1/users/signup` - Register new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/forgot-password` - Request password reset
- `POST /api/v1/users/reset-password/:resetToken` - Reset password

### Users (Protected)
- `GET /api/v1/users/me/profile` - Get current user profile
- `PUT /api/v1/users/me/profile` - Update current user profile
- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get user by ID (admin only)
- `PUT /api/v1/users/:id` - Update user (admin only)
- `DELETE /api/v1/users/:id` - Hard delete user (admin only)
- `PATCH /api/v1/users/:id/soft-delete` - Soft delete user (admin only)
- `PATCH /api/v1/users/:id/restore` - Restore soft-deleted user (admin only)

### Courses
- `GET /api/v1/courses` - Get all courses
- `POST /api/v1/courses` - Create course
- `GET /api/v1/courses/:id` - Get course by ID
- `PUT /api/v1/courses/:id` - Update course
- `DELETE /api/v1/courses/soft/:id` - Soft delete course
- `PATCH /api/v1/courses/restore/:id` - Restore course
- `DELETE /api/v1/courses/hard/:id` - Hard delete course

### Exams
- Similar CRUD operations as courses

### Questions
- `GET /api/v1/questions` - Get all questions
- `POST /api/v1/questions` - Create question
- `GET /api/v1/questions/:id` - Get question by ID
- `PUT /api/v1/questions/:id` - Update question
- `DELETE /api/v1/questions/:id` - Delete question
- `POST /api/v1/questions/:id/options` - Add option to question
- `PUT /api/v1/questions/:id/options/:index` - Update option
- `DELETE /api/v1/questions/:id/options/:index` - Delete option

### Payments
- `POST /api/v1/payments/course` - Initialize course payment
- `GET /api/v1/payments/webhook` - Payment webhook (Chapa callback)
- `POST /api/v1/payments/webhook` - Payment webhook (Chapa callback)

## Key Logic Fixes

### 1. Body Parsing Middleware
Added `express.json()` and `express.urlencoded()` middleware to properly parse request bodies.

### 2. User ID Consistency
Fixed inconsistent use of `req.user.id` vs `req.user._id` throughout controllers. MongoDB uses `_id` by default.

### 3. Subscription Logic
Improved subscription methods to properly handle updates to existing subscriptions instead of creating duplicates.

### 4. Route Ordering
Fixed route ordering in user routes - specific routes like `/me/profile` must come before parameterized routes like `/:id`.

### 5. Payment Verification
Enhanced payment webhook to properly check for existing subscriptions before adding duplicates.

### 6. Question-Exam Sync
Added check to prevent duplicate question IDs in exam.questions array.

### 7. Error Handling
Added global error handling middleware and 404 handler for undefined routes.

### 8. Database Connection
Improved MongoDB connection with better error handling and removed deprecated options.

## Security Considerations

- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt with salt rounds of 10
- Password reset tokens expire after 10 minutes
- Role-based access control for admin operations
- CORS configured for specific frontend origin

## Development

Run in development mode with auto-reload:
\`\`\`bash
npm run dev
\`\`\`

## License

ISC
