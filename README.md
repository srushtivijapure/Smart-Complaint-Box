# Smart Complaint Box 🚀

A modern, intelligent complaint management system built with HTML, CSS, and JavaScript, featuring AI-powered categorization, real-time tracking, and a professional admin dashboard.

## ✨ Features

### 🎯 Core Functionality
- **Smart Complaint Submission**: User-friendly form with optional contact information
- **AI-Powered Categorization**: Automatically categorizes complaints into Maintenance, Cleanliness, Electricity, or Suggestions
- **Priority Detection**: Identifies urgent complaints based on keywords and category
- **Real-time Updates**: Live complaint tracking with Firebase Firestore
- **Professional Admin Dashboard**: Complete management interface for administrators

### 🎨 User Experience
- **Modern Design**: Beautiful gradient backgrounds and smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Accessibility**: Proper form labels, keyboard navigation, and screen reader support

### 🔧 Admin Features
- **Real-time Statistics**: Live dashboard with complaint counts and status
- **Advanced Filtering**: Filter by status, priority, and search functionality
- **Bulk Actions**: Mark complaints as resolved or delete them
- **Data Export**: Export complaints to CSV format
- **Sorting Options**: Sort by date, priority, or category

### 🛡️ Technical Features
- **Firebase Integration**: Secure cloud database with real-time synchronization
- **Offline Support**: Basic offline functionality with local storage
- **Performance Optimized**: Fast loading times and smooth animations
- **Cross-browser Compatible**: Works on all modern browsers

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase project (for backend functionality)
- Basic knowledge of HTML, CSS, and JavaScript

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Smart-Complaint-Box.git
   cd Smart-Complaint-Box
   ```

2. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Copy your Firebase configuration
   - Update the `firebaseConfig` object in `assets/js/app.js`

3. **Configure Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /complaints/{complaint} {
         allow read, write: if true; // For demo purposes
         // For production, implement proper authentication
       }
     }
   }
   ```

4. **Open the application**
   - Simply open `index.html` in your web browser
   - Or serve it using a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     
     # Using PHP
     php -S localhost:8000
     ```

## 📁 Project Structure

```
Smart-Complaint-Box/
├── index.html                 # Main application file
├── README.md                  # Project documentation
├── assets/
│   ├── css/
│   │   └── style.css         # Main stylesheet with animations
│   ├── js/
│   │   └── app.js            # Main JavaScript application
│   └── images/               # Images and icons (optional)
└── .gitignore               # Git ignore file
```

## 🎯 Usage Guide

### For Users
1. **Submit a Complaint**
   - Fill out the complaint form with your details
   - Provide a detailed description of the issue
   - Optionally include contact information for follow-up
   - Click "Submit Complaint" to send

2. **Track Your Complaint**
   - Your complaint will be automatically categorized
   - Priority will be assigned based on content
   - Status updates will be available in real-time

### For Administrators
1. **Access Admin Panel**
   - Click "View Admin Panel" to switch to admin view
   - View real-time statistics and complaint counts

2. **Manage Complaints**
   - Filter complaints by status, priority, or search terms
   - Sort complaints by various criteria
   - Mark complaints as resolved
   - Delete inappropriate complaints

3. **Export Data**
   - Use the "Export Data" button to download CSV reports
   - Data includes all complaint details and metadata

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Firestore Database
3. Update the configuration in `assets/js/app.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Customization
- **Colors**: Modify CSS variables in `assets/css/style.css`
- **Categories**: Update the categorization logic in `assets/js/app.js`
- **Priority Rules**: Adjust priority detection keywords
- **Form Fields**: Add or remove form fields as needed

## 🎨 Customization

### Styling
The application uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  /* ... more variables */
}
```

### Adding New Categories
Update the categorization function in `assets/js/app.js`:

```javascript
const keywords = {
  'maintenance': ['broken', 'repair', 'fix', ...],
  'cleanliness': ['dirty', 'clean', 'mess', ...],
  'electricity': ['power', 'electric', 'light', ...],
  'suggestion': ['suggest', 'improve', 'better', ...],
  'your-category': ['keyword1', 'keyword2', ...]
};
```

## 🔒 Security Considerations

### Production Deployment
- Implement proper Firebase Authentication
- Set up Firestore security rules
- Use environment variables for API keys
- Enable HTTPS for all communications
- Implement rate limiting for form submissions

### Data Privacy
- Complaints are stored securely in Firebase
- Personal information is optional
- Data can be exported and deleted as needed
- Consider GDPR compliance for EU users

## 🚀 Deployment

### Static Hosting
- **Netlify**: Drag and drop the folder to Netlify
- **Vercel**: Connect your GitHub repository
- **Firebase Hosting**: Use Firebase CLI to deploy
- **GitHub Pages**: Enable GitHub Pages in repository settings

### Environment Variables
For production, use environment variables for sensitive data:

```javascript
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  // ... other config
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Firebase**: For the backend infrastructure
- **Font Awesome**: For the beautiful icons
- **Google Fonts**: For the Inter font family
- **CSS Grid & Flexbox**: For the responsive layouts

## 📞 Support

If you have any questions or need help:
- Create an issue on GitHub
- Email: support@smartcomplaintbox.com
- Documentation: [Wiki](https://github.com/yourusername/Smart-Complaint-Box/wiki)

## 🔄 Changelog

### Version 1.0.0 (Current)
- Initial release
- Basic complaint submission and management
- Firebase integration
- Responsive design
- Admin dashboard

### Planned Features
- User authentication
- Email notifications
- Advanced analytics
- Mobile app version
- Multi-language support

---

**Made with ❤️ for better community service**
