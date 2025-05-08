#!/bin/bash
curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{ "username": "user1", "password": "password1" }'
