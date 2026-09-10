Use without docker:

Use with docker:

1. Create a file named .env in the root directory of the project. Paste the key into this file.
2. Open the Docker Desktop program on your computer. (You can find it here https://docs.docker.com/get-started/get-docker/)
3. Open a powershell terminal and run: docker compose up --build
4. In Docker Desktop you can now click on krafty_watt and open the site.

Note! Your 4000 and 8000 ports must not already be in use.
Solutions:

1. Stop the Docker containers by running: docker compose down
2. Check if port 4000 in use by running: netstat -ano | findstr :4000
   Check if port 8000 in use by running: netstat -ano | findstr :8000
   If in use the port will then show: TCP 0.0.0.0:<port> 0.0.0.0:0 LISTENING <PID>
3. Close port by: taskkill /PID <PID> /F
