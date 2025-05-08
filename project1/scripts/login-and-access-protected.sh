#!/bin/bash
LOGIN_RESPONSE=$(curl -s -w "%{http_code}" -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username": "user1", "password": "password1"}')
HTTP_STATUS="${LOGIN_RESPONSE: -3}"
RESPONSE_BODY="${LOGIN_RESPONSE:0:${#LOGIN_RESPONSE}-3}"
if [ "$HTTP_STATUS" -eq 200 ]; then
    TOKEN=$(echo $RESPONSE_BODY | sed -n 's|.*"access_token":"\([^"]*\)".*|\1|p')
    echo "Login successful. Token: $TOKEN"
    PROTECTED_RESPONSE=$(curl -s -X GET http://localhost:3000/auth/protected \
        -H "Authorization: Bearer $TOKEN")
    echo "Protected route response: $PROTECTED_RESPONSE"
else
    echo "Login failed. HTTP status code: $HTTP_STATUS"
fi
