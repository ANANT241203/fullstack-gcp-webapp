#!/bin/bash
LOGIN_RESPONSE=$(curl -s -w "%{http_code}" -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username": "user1", "password": "password1"}')
HTTP_STATUS="${LOGIN_RESPONSE: -3}"
RESPONSE_BODY="${LOGIN_RESPONSE:0:${#LOGIN_RESPONSE}-3}"
if [ "$HTTP_STATUS" -eq 200 ]; then
    TOKEN=$(echo $RESPONSE_BODY | sed -n 's|.*"access_token":"\([^"]*\)".*|\1|p')
    echo "Login successful. Token: $TOKEN"
    UPLOAD_RESPONSE=$(curl -s -w "%{http_code}" -X POST http://localhost:3000/auth/upload \
        -H "Authorization: Bearer $TOKEN" \
        -F "file=@$1")
    UPLOAD_HTTP_STATUS="${UPLOAD_RESPONSE: -3}"
    UPLOAD_RESPONSE_BODY="${UPLOAD_RESPONSE:0:${#UPLOAD_RESPONSE}-3}"
    if [ "$UPLOAD_HTTP_STATUS" -eq 200 ]; then
        echo "File upload successful. Response: $UPLOAD_RESPONSE_BODY"
    else
        echo "File upload failed. HTTP status code: $UPLOAD_HTTP_STATUS"
    fi
else
    echo "Login failed. HTTP status code: $HTTP_STATUS"
fi
