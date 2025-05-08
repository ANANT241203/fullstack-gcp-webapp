# Project1 - Requirements Document

## Objective
The objective of this project is to implement basic user/password authentication in a Nest.js application. This authentication system will allow users to authenticate with a username and password stored in a JSON file.

## Requirements

### Step 1: Generate a Nest Project
- Install the Nest CLI globally if not already installed:
  ```bash
  npm install -g @nestjs/cli
  ```
  - Use yarn
- Create Project 1
  ```bash  
  nest new project1
  cd project1
  ```


### Step 2: Create Authentication Service and Module
- Create an authentication service to handle user authentication::
  ```bash
  nest generate service auth
  ```
- Create an authentication module to organize authentication-related components:
  ```bash  
  nest generate module auth
  ```
- Create an authentication controller
  ```bash
  nest generate controller auth
   ```

### Step 3: Implement Authentication Logic
- Implement the logic for basic authentication in the authentication service (auth.service.ts). Store login/password pairs in a JSON and validate user credentials against it.
   ```typescript
   // auth/auth.service.ts
   import { Injectable } from '@nestjs/common';

   @Injectable()
   export class AuthService {
   private readonly users = [
     { username: 'user1', password: 'password1' },
     { username: 'user2', password: 'password2' },
   ];

   async login(username: string, password: string): Promise<boolean> {
     const user = this.users.find(
       (user) => user.username === username && user.password === password,
     );

     if (user) {
       return true; // Login successful
     }
     return false; // Invalid credentials
   }
  }

   ```
   - Create the middleware
  
   ```typescript
   // auth/auth.middleware.ts
   import { Injectable, NestMiddleware } from '@nestjs/common';
   import { Request, Response, NextFunction } from 'express';
   @Injectable()
   export class AuthMiddleware implements NestMiddleware {
    
     use(req: Request, res: Response, next: NextFunction) {
       // Implement logic to check for valid authentication credentials in the request headers

       const authHeader = req.headers.authorization;
       if (!authHeader || authHeader !== 'Bearer your_access_token') {
         return res.status(401).json({ message: 'Unauthorized' });
       }

       next();
     }
   }
  ```

  - Update the app module
  ```typescript
  // src/app.module.ts
  import { Module } from '@nestjs/common';
  import { AuthModule } from './auth/auth.module';
  import { AuthController } from './auth/auth.controller'; // Import the AuthController

  @Module({
    imports: [AuthModule],
    controllers: [AuthController], // Include the AuthController
  })
  export class AppModule {}
  ```
  - Update the controller
  ```typescript
  // auth/auth.controller.ts
  import { Controller, Post, Body } from '@nestjs/common';
  import { AuthService } from './auth.service';
  @Controller()
  export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body: { username: string, password: string }) {
      // Assuming you have a method named `login` in your AuthService
      const result = await this.authService.login(body.username, body.password);
      if (result) {
        return { message: 'Login successful' };
      } else {
        return { message: 'Invalid credentials' };
      }
    }
  }

  ```

# Example Structure

Your project structure might look like this:

<pre>
 project1/
 ├── src/
 │   ├── auth/
 │   │   ├── auth.controller.ts
 │   │   ├── auth.middleware.ts
 │   │   ├── auth.module.ts
 │   │   └── auth.service.ts
 │   ├── app.module.ts
 │   ├── main.ts
 │   └── ...
 └── ...
 </pre>

## Testing

## Start the server
```bash
yarn start
```

## Send a request with valid credentials
```
curl -X POST -H "Content-Type: application/json" -d '{"username": "user1", "password": "password1"}' http://localhost:3000/login
```
Expect:  ```{"message":"Login successful"}%```

## Send a request with invalid credentials
```
curl -X POST -H "Content-Type: application/json" -d '{"username": "user1", "password": "wrongpassword"}' http://localhost:3000/login
```
Expect:  ```{"message":"Invalid credentials"}%```

# Test Assignment

1. Extend this to support uploading a file, and store the file to disk.  Create the curl and include the curl in a test script so that the end to end file upload test can be called from within the project using a simple script.

   ```
   curl -X POST -F "file=@/path/to/your/file.txt" http://localhost:3000/upload
   ```

2. Extend the upload functionality to write to a Google Storage bucket.  The file should reside in Google storage after the curl call.

3.  Create a React client

      ```
      npx create-react-app my-react-client
      ```
 - Build a ui that does login, logout, and upload.
