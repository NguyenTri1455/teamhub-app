
# CI/CD Setup Guide (Self-Hosted Runner)

**Reason for Change:**
The error `dial tcp ... i/o timeout` means GitHub cannot connect to your server. This is expected if your server is "local" or behind a VPN.
To fix this, we will use a **Self-Hosted Runner**. This allows your server to "pull" jobs from GitHub, so no incoming connection (SS) is needed.

## 1. Add Runner to GitHub
1.  Go to your GitHub Repository.
2.  Settings -> **Actions** -> **Runners**.
3.  Click **New self-hosted runner**.
4.  Select **Linux**.
5.  Run the commands shown by GitHub on your **Ubuntu Server**.

   *Example commands (Do not copy, use the specific token from GitHub):*
   ```bash
   # Create a folder
   mkdir actions-runner && cd actions-runner
   
   # Download (GitHub will give you the exact curl link)
   curl -O -L https://github.com/actions/runner/releases/download/v2.x.x/actions-runner-linux-x64-v2.x.x.tar.gz
   
   # Extract
   tar xzf ./actions-runner-linux-x64-*.tar.gz
   
   # Configure (Use url and token from GitHub page)
   ./config.sh --url https://github.com/YOUR_USER/YOUR_REPO --token YOUR_TOKEN
   # Accept defaults (press Enter)
   ```

## 2. Install as Service (Run in Background)
After configuring, run these commands to ensure it runs automatically:
```bash
# Install service
sudo ./svc.sh install

# Start service
sudo ./svc.sh start
```

## 3. Verify
- Go to Settings -> Actions -> Runners. You should see your runner is "Idle" (Green).

## 4. Permissions
The runner runs as the user you installed it with (e.g., `ubuntu` or `github-deploy`).
Ensure this user has Docker permissions:
```bash
sudo usermod -aG docker $USER
# You might need to restart the runner service if permission denied occurs
sudo ./svc.sh stop
sudo ./svc.sh start
```

## 5. Deploy
Push a change to `main`. The workflow will now be picked up by your local server and deployed instantly!
