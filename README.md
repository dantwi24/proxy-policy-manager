# Proxy Policy Change Request Manager

A React-based application for managing proxy policy change requests with status tracking and JIRA integration.

## Features
- Submit and track proxy policy change requests
- Status tracking (Pending/Implemented)
- JIRA ticket integration with hyperlinks
- Dark/Light theme toggle
- Quick search/filter functionality
- Local storage persistence

## Tech Stack
- React.js with TypeScript
- Tailwind CSS
- shadcn/ui components
- Local Storage for data persistence

## Setup Instructions

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Development

### Project Structure
- `/client/src/` - React frontend code
  - `/components/` - React components
  - `/pages/` - Page components
  - `/lib/` - Utilities and configurations
- `/server/` - Express backend server
- `/shared/` - Shared types and schemas

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm run check` - Type checking

## Steps to Push to GitHub

1. Create a new repository on GitHub (do not initialize with README)

2. Initialize git in your local project:
```bash
git init
```

3. Add all files to git:
```bash
git add .
```

4. Create initial commit:
```bash
git commit -m "Initial commit"
```

5. Add GitHub repository as remote:
```bash
git remote add origin https://github.com/username/repository.git
```

6. Push to GitHub:
```bash
git push -u origin main
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
MIT