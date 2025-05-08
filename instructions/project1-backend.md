# Project Setup Instructions

## 1. Setup a Linux Environment for Development

Follow the guide [Ubuntu for Developers: A Guide](https://daily.dev/blog/ubuntu-for-developers-a-guide) to set up a Linux environment for development.

## 2. Setup an API for Login

1. Create an endpoint `/auth/login`.
2. The endpoint should accept `username` and `password` from a form (parsed on the backend from the body).
3. Check the username and password within the code (no need for a database).
4. If the credentials match, return `200 OK`, otherwise return `401 Unauthorized`.

### Example Code:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const validUsername = 'testuser';
const validPassword = 'password123';

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === validUsername && password === validPassword) {
    res.status(200).send('OK');
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

### Test with Curl:

Save the following script as `test-login.sh`:

```sh
#!/bin/bash
curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{ "username": "testuser", "password": "password123" }'
```

Make the script executable:

```sh
chmod +x scripts/auth/test-login.sh
```

## 3. Update the API to Use JWT

1. On successful login, create a JWT (sign the JWT with username and a secret key).
2. Create middleware `verifyToken` that looks for the authorization header. If it isn't there, return unauthorized.
3. Create an endpoint `/protected` that verifies the token.

### Example Code:

```javascript
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';

// Login endpoint
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === validUsername && password === validPassword) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send('Token is required');
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Unauthorized');
    }
    req.user = decoded;
    next();
  });
};

// Protected route
app.get('/protected', verifyToken, (req, res) => {
  res.status(200).send('This is a protected route');
});
```

### Test with Curl:

Save the following script as `login-and-access-protected.sh`:

```sh
#!/bin/bash

# Perform login and capture the response
LOGIN_RESPONSE=$(curl -s -w "%{http_code}" -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username": "testuser", "password": "password123"}')

# Extract the HTTP status code
HTTP_STATUS="${LOGIN_RESPONSE: -3}"

# Extract the response body
RESPONSE_BODY="${LOGIN_RESPONSE:0:${#LOGIN_RESPONSE}-3}"

if [ "$HTTP_STATUS" -eq 200 ]; then
    # Parse the token from the response body
    TOKEN=$(echo $RESPONSE_BODY | sed -n 's|.*"token":"\([^"]*\)".*|\1|p')

    echo "Login successful. Token: $TOKEN"

    # Use the token to call the protected route
    PROTECTED_RESPONSE=$(curl -s -X GET http://localhost:3000/protected \
        -H "Authorization: Bearer $TOKEN")

    echo "Protected route response: $PROTECTED_RESPONSE"
else
    echo "Login failed. HTTP status code: $HTTP_STATUS"
fi
```

Make the script executable:

```sh
chmod +x scripts/login-and-access-protected.sh
```

## 4. Setup Multer for File Upload

1. Install `multer` to handle file uploads.
2. Protect the upload route with JWT authentication.
3. Create a shell script to test the file upload.

### Example Code:

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// File upload endpoint
app.post('/file/upload', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).json({
    message: 'File uploaded successfully',
    file: req.file,
  });
});
```

### Test with Curl:

Save the following script as `upload-file.sh`:

```sh
#!/bin/bash

# Perform login and capture the response
LOGIN_RESPONSE=$(curl -s -w "%{http_code}" -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username": "testuser", "password": "password123"}')

# Extract the HTTP status code
HTTP_STATUS="${LOGIN_RESPONSE: -3}"

# Extract the response body
RESPONSE_BODY="${LOGIN_RESPONSE:0:${#LOGIN_RESPONSE}-3}"

if [ "$HTTP_STATUS" -eq 200 ]; then
    # Parse the token from the response body
    TOKEN=$(echo $RESPONSE_BODY | sed -n 's|.*"token":"\([^"]*\)".*|\1|p')

    echo "Login successful. Token: $TOKEN"

    # Use the token to call the file upload route
    UPLOAD_RESPONSE=$(curl -s -w "%{http_code}" -X POST http://localhost:3000/file/upload \
        -H "Authorization: Bearer $TOKEN" \
        -F "file=@path/to/your/file.txt")

    # Extract the HTTP status code from the upload response
    UPLOAD_HTTP_STATUS="${UPLOAD_RESPONSE: -3}"

    # Extract the response body from the upload response
    UPLOAD_RESPONSE_BODY="${UPLOAD_RESPONSE:0:${#UPLOAD_RESPONSE}-3}"

    if [ "$UPLOAD_HTTP_STATUS" -eq 200 ]; then
        echo "File upload successful. Response: $UPLOAD_RESPONSE_BODY"
    else
        echo "File upload failed. HTTP status code: $UPLOAD_HTTP_STATUS"
    fi
else
    echo "Login failed. HTTP status code: $HTTP_STATUS"
fi
```

Make the script executable:

```sh
chmod +x scripts/upload-file.sh
```

## 5. Setup Google Cloud Storage for File Management

1. Install the Google Cloud Storage library.
2. Create TypeScript files to list, fetch, and create files in the Google Storage bucket.
3. Create a shell script to test uploading, listing, and deleting files from the command line.

### Example Code for Google Cloud Storage (TypeScript):

```typescript
import { Storage } from '@google-cloud/storage';
const storage = new Storage();
const bucketName = 'your-bucket-name';

// List files in the bucket
export const listFiles = async () => {
  const [files] = await storage.bucket(bucketName).getFiles();
  return files;
};

// Upload a file to the bucket
export const uploadFile = async (filePath: string) => {
  await storage.bucket(bucketName).upload(filePath);
  console.log(`${filePath} uploaded to ${bucketName}`);
};

// Delete a file from the bucket
export const deleteFile = async (fileName: string) => {
  await storage.bucket(bucketName).file(fileName).delete();
  console.log(`gs://${bucketName}/${fileName} deleted.`);
};
```

### Shell Script for Google Cloud Storage:

Save the following script as `test-google-storage.sh`:

```sh
#!/bin/bash

ACTION=$1
FILE=$2

case $ACTION in
  -upload)
    node -e "require('./path/to/your/script').uploadFile('$FILE')"
    ;;
  -list)
    node -e "console.log(require('./path/to/your/script').listFiles())"
    ;;
  -delete)
    node -e "require('./path/to/your/script').deleteFile('$FILE')"
    ;;
  *)
    echo "Invalid action. Use -upload, -list, or -delete."
    ;;
esac
```

Make the script executable:

```sh
chmod +x scripts/test-google-storage.sh
```

## 6. Testing

Ensure your project has several bash scripts in the `/scripts` folder, and fully test:

- **Login**: With valid and invalid credentials.
- **Protected Endpoint**: Login, then obtain token and use that token to access a protected endpoint.
- **CRUD Against Google Storage**: Test creating, listing, and deleting files.
- **File Upload**: Ensure the file upload endpoint is protected and works as expected.

### Final Steps

1. Ensure the project is checked into GitHub and visible to me.
2. Once the above tasks are completed, we will have the parts necessary to construct the front-end UI and the ability to test the

 backend without requiring the UI. This will greatly simplify development and testing and help reason about the code.

```sh
# Example commands to test the scripts
./scripts/auth/test-login.sh
./scripts/login-and-access-protected.sh
./scripts/upload-file.sh
./scripts/test-google-storage.sh -upload -f ./assets/test.jpg
./scripts/test-google-storage.sh -list
./scripts/test-google-storage.sh -delete -f test.jpg
```

By following these instructions, you should be able to set up the necessary backend functionality and corresponding tests, allowing for easier development and testing of the entire application.
