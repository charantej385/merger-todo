# Simple Todos - Meteor.js Blaze App

A full-featured todo application built with **Meteor.js**, **Blaze**, and **MongoDB**, featuring task categorization and drag-and-drop reordering.

## Features

✅ **User Authentication**
- Sign up and login with `accounts-password`
- Account UI for easy management

✅ **Task Management**
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Each task belongs to the current user only

✅ **Task Categorization**
- Organize tasks into three categories: **Work**, **Personal**, **Urgent**
- Filter tasks by category
- Visual category badges with color coding

✅ **Drag-and-Drop Reordering**
- Reorder tasks by dragging and dropping (powered by **SortableJS**)
- Order persisted to database
- Smooth animations and visual feedback

✅ **Responsive Design**
- Mobile-friendly interface
- Gradient background with modern UI

## Technology Stack

- **Framework**: Meteor.js (v2.x/v3.x)
- **Frontend**: Blaze (Spacebars/HTML templating)
- **Database**: MongoDB (Meteor Collections)
- **Drag-and-Drop**: SortableJS
- **Authentication**: Accounts Password
- **Build Tool**: Rspack

## Project Structure

```
merger_todo/
├── client/                    # Client-side code
│   ├── main.html             # Main HTML file
│   ├── main.js               # Client entry point
│   └── main.css              # Styling
├── server/                    # Server-side code
│   └── main.js               # Server entry point
├── imports/
│   ├── api/
│   │   └── tasks.js          # Tasks collection, methods, and publications
│   └── ui/
│       ├── App.html          # Main app template
│       ├── App.js            # App logic with SortableJS integration
│       └── Task.html         # Individual task template (included in App.html)
├── .meteor/
│   ├── packages              # Meteor packages configuration
│   └── ...
├── package.json              # NPM dependencies
└── README.md                 # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Meteor CLI (install with: `curl https://install.meteor.com/ | sh`)

### Steps

1. **Navigate to project directory:**
   ```bash
   cd c:\Users\DELL\OneDrive\Desktop\merger_todo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   ```bash
   npm start
   ```
   
   Or directly:
   ```bash
   meteor run
   ```

4. **Open browser:**
   Navigate to `http://localhost:3000`

## Usage

### Creating a Task

1. Sign up or log in
2. Enter task text in the input field
3. Select a category (Work, Personal, or Urgent)
4. Click "Add Task" or press Enter
5. Task appears in the list!

### Managing Tasks

- **Check/Uncheck**: Click the checkbox to mark tasks as complete
- **Delete**: Click the × button to remove a task
- **Reorder**: Drag and drop tasks to reorder them
- **Filter**: Click filter buttons to view tasks by category

### Categories

- 🔵 **Work** - Work-related tasks (blue)
- 🟣 **Personal** - Personal tasks (purple)
- 🔴 **Urgent** - Urgent tasks (red)

## API Methods

All database operations are performed through secure Meteor Methods:

### `tasks.insert(text, category)`
- **Parameters**: `text` (String), `category` (String: 'Work', 'Personal', 'Urgent')
- **Returns**: Task ID
- **Description**: Creates a new task for the current user

### `tasks.remove(taskId)`
- **Parameters**: `taskId` (String)
- **Returns**: Success count
- **Description**: Removes a task (only by owner)

### `tasks.setChecked(taskId, isChecked)`
- **Parameters**: `taskId` (String), `isChecked` (Boolean)
- **Returns**: Success count
- **Description**: Marks task as complete/incomplete

### `tasks.updateOrder(taskId, newOrder)`
- **Parameters**: `taskId` (String), `newOrder` (Number)
- **Returns**: Success count
- **Description**: Updates task order for drag-and-drop (called automatically)

### `tasks.setCategory(taskId, newCategory)`
- **Parameters**: `taskId` (String), `newCategory` (String)
- **Returns**: Success count
- **Description**: Changes task category

## Database Schema

### Tasks Collection

```javascript
{
  _id: String,                    // MongoDB ID
  text: String,                   // Task text
  category: String,               // 'Work', 'Personal', or 'Urgent'
  order: Number,                  // Sort order (used for drag-and-drop)
  checked: Boolean,               // Completion status
  userId: String,                 // Owner's user ID
  createdAt: Date,                // Creation timestamp
}
```

## Security Features

- ✅ **User Authentication**: Tasks are only accessible to their owner
- ✅ **Method Validation**: All inputs validated with `check()`
- ✅ **Ownership Check**: Methods verify user ownership before operations
- ✅ **Database Rules**: Removed `insecure` package
- ✅ **Publications**: Removed `autopublish` package, using explicit publications
- ✅ **Secure Methods**: All database writes go through validated Meteor Methods

## Performance Optimizations

- ⚡ **Optimistic UI**: Drag-and-drop feels instant with client-side updates
- ⚡ **Reactive Sorting**: Blaze reactivity automatically handles order changes
- ⚡ **SortableJS Integration**: Minimal re-renders during drag operations
- ⚡ **Selective Subscriptions**: Only user's tasks are published

## Troubleshooting

### App won't start
```bash
# Clear Meteor cache
meteor reset

# Reinstall dependencies
npm install

# Try running again
npm start
```

### Packages not installing
```bash
# Update Meteor
meteor update

# Re-add packages
meteor add accounts-password accounts-ui
```

### Drag-and-drop not working
- Ensure JavaScript is enabled
- Check browser console for errors (F12)
- Try clearing browser cache (Ctrl+Shift+Delete)

## Development Commands

```bash
# Start development server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test-app

# Visualize bundle
npm run visualize

# Production build
meteor build
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT - Feel free to use this project for learning and development!

## Resources

- [Meteor Official Docs](https://docs.meteor.com/)
- [Blaze Documentation](https://guide.meteor.com/blaze.html)
- [Accounts System](https://docs.meteor.com/api/accounts.html)
- [SortableJS Docs](https://sortablejs.github.io/Sortable/)
- [Meteor Blaze Tutorial](https://www.meteor.com/tutorials/blaze/creating-an-app)

---

**Built with ❤️ using Meteor.js and Blaze**
