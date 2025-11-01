@echo off
echo Generating self-signed SSL certificate for localhost...
echo.

REM Create ssl directory if it doesn't exist
if not exist ssl mkdir ssl

REM Generate private key and certificate
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo.
echo SSL certificates generated successfully!
echo.
echo Files created:
echo   - ssl/key.pem (private key)
echo   - ssl/cert.pem (certificate)
echo.
echo Note: These are self-signed certificates for local development only.
echo Your browser will show a security warning - this is normal.
echo Click 'Advanced' and 'Proceed to localhost' to continue.
echo.
pause
