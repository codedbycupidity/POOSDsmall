# POOSDsmall

A web-based contact management application with user authentication and team information display.

## Project Structure

```
POOSDsmall/
├── webroot/
│   ├── index.html           # Main landing/login page
│   ├── contacts.html        # Contact management interface
│   ├── register.html        # User registration page
│   ├── meet-team.html       # Team information page
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript files
│   │   ├── auth.js         # Authentication handling
│   │   ├── contact.js      # Contact management logic
│   │   ├── register.js     # Registration functionality
│   │   └── ...             # Additional JavaScript modules
│   ├── assets/             # Images and other assets
│   └── LAMPAPI/            # API endpoints
└── package.json            # Node.js dependencies

```

## Features

- User authentication (login/register)
- Contact management system
- Team information display
- Responsive design
- Cookie-based session management
- MD5 password hashing
- Toast notifications
- Keyboard navigation support
- Easter egg functionality

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- PHP (Backend API)
- MySQL (Database)
- RESTful API architecture
- Browser-Sync (Development)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd POOSDsmall
```

2. Install development dependencies:
```bash
npm install
```

3. Set up your web server to point to the `webroot` directory

4. Configure your database connection in the LAMPAPI files

## Development

To run Browser-Sync for live reloading during development:
```bash
npx browser-sync start --server "webroot" --files "webroot/**/*"
```

## API Endpoints

The application includes several API endpoints located in `webroot/LAMPAPI/`:
- User authentication
- Contact CRUD operations
- User registration

## File Structure Details

### JavaScript Modules
- `auth.js` - Handles user authentication and session management
- `contact.js` - Manages contact creation, reading, updating, and deletion
- `register.js` - User registration logic with password confirmation
- `cookies.js` - Cookie management utilities
- `toast.js` - Notification system
- `navbar.js` - Navigation bar functionality
- `keyHandler.js` - Keyboard shortcuts and navigation
- `easterEgg.js` - Hidden features
- `loading.js` - Loading state management
- `teamcard.js` - Team member display cards
- `config.js` - Application configuration
- `main.js` - Main application initialization

### Pages
- `index.html` - Login page
- `contacts.html` - Main contact management interface
- `register.html` - New user registration
- `meet-team.html` - Team information and member profiles

## Browser Compatibility

The application is designed to work with modern web browsers supporting ES6+ JavaScript.

## License

[Specify your license here]

## Contributing

[Add contribution guidelines if applicable]

## Contact

[Add contact information if applicable]