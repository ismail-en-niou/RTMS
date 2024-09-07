To update your React site on the server, you'll need to follow these steps:

1. Make Updates Locally
Navigate to Your React App Directory:

bash
Copy code
cd /path/to/your/react-app
Make the Necessary Updates: Update your React code as needed.

Build the Updated App:

bash
Copy code
npm run build
This will generate a new dist (or build) folder with the updated production files.

2. Upload Updated Files to the Server
Copy the Updated Files:

Replace the old files on the server with the new ones. You can use scp or rsync to do this. For example:

bash
Copy code
scp -r dist/* user@your-server-ip:/home/robixe-team/htdocs/team.robixe.online/
This will overwrite the existing files with the updated ones.

Verify the Files:

Log in to your server and check that the updated files have been copied correctly:

bash
Copy code
ls -l /home/robixe-team/htdocs/team.robixe.online/
3. Ensure Permissions
Ensure that the updated files have the correct permissions:

bash
Copy code
sudo chown -R www-data:www-data /home/robixe-team/htdocs/team.robixe.online/
4. Clear Browser Cache
Sometimes, browsers cache old versions of your site. To ensure users see the latest version:

Force Refresh: Users can force a refresh (usually Ctrl + F5 or Cmd + Shift + R).
Clear Cache: Optionally, clear the browser cache from the settings.
5. Check the Deployment
Navigate to your website (https://team.robixe.online) and verify that the updates are visible and functioning as expected.

6. Troubleshooting
If the site does not reflect the updates:

Check File Paths: Ensure the correct files are in the root directory.

Check NGINX Configuration: Ensure that the root directive in your NGINX configuration points to the correct directory.

Check NGINX Logs: Review logs for any issues:

bash
Copy code
sudo tail -f /home/robixe-team/logs/nginx/error.log
If you encounter any issues or need further assistance with the update process, feel free to ask!
