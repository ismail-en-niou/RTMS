# Phone Number and Location Management System

## Overview

This project is a web-based application designed to manage and interact with a database of phone numbers and their associated locations. It features two main user roles: Adder and Targeter, each with specific functionalities tailored to their needs. The application provides a user-friendly interface with dark mode support and responsive design for various devices.

## Features

### General Features
- Secure login system with role-based access control
- Dark mode toggle for better user experience in different lighting conditions
- Responsive design that works well on desktop and mobile devices

### Adder Role
- Add new phone numbers and their associated Google Maps links
- Edit existing entries
- Delete entries
- View all entries in a sortable table
- Entries are automatically sorted by the most recent update

### Targeter Role
- View all entries added by Adders
- Initiate WhatsApp chats directly from the application
- Make phone calls directly from the application
- View Google Maps locations for each entry

## Technology Stack

- Frontend: React.js
- Styling: CSS with custom properties for theming
- State Management: React Hooks (useState, useEffect)
- Persistence: Local Storage (for demo purposes, can be replaced with a backend database)

## Installation and Setup

1. Clone the repository:
   ```
   git clone [repository-url]
   ```

2. Navigate to the project directory:
   ```
   cd [project-name]
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and visit `http://localhost:3000`

## Usage

### Login
- Use your provided credentials to log in
- The system will automatically direct you to the appropriate dashboard based on your role

### Adder Dashboard
- Use the form at the top of the page to add new entries
- The table below shows all existing entries
- Use the "Edit" and "Delete" buttons to modify or remove entries

### Targeter Dashboard
- View all entries in the table
- Click "WhatsApp" to open a chat with the number
- Click "Call" to initiate a phone call
- Click "View on Map" to see the location on Google Maps

## Security Considerations

- This application uses client-side storage for demonstration purposes. In a production environment, it's crucial to implement server-side storage and proper authentication mechanisms.
- Ensure that you have the necessary permissions and comply with local laws and regulations when storing and using personal data like phone numbers.

## Future Enhancements

- Implement server-side storage and authentication
- Add search and filter functionality for large datasets
- Implement pagination for better performance with large datasets
- Add data export functionality
- Implement user management features for admin roles

## Contributing

Contributions to improve the application are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[Specify your license here, e.g., MIT, GPL, etc.]

## Contact

[ismail-en-nioou] - [ismail.enniou@gmail.com]

Project Link: [https://github.com/ismail-en-niou/RTMS](https://github.com/ismail-en-niou/RTMS)
