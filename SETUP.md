# Quick Setup Guide

## 🚀 Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Environment File**
   ```bash
   cp .env.example .env
   ```

3. **Configure Environment Variables**
   Edit `.env` and set your backend API URL:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_BACKEND_URL=http://localhost:3000
   VITE_FRONTEND_URL=http://localhost:3001
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to `http://localhost:3001`

## ✅ What's Included

- ✅ React 18 with Vite
- ✅ React Router for navigation
- ✅ Tailwind CSS with custom color scheme
- ✅ Axios for API calls
- ✅ React Query for data fetching
- ✅ Responsive design
- ✅ Home page with hero and featured courses
- ✅ Courses page with filters and pagination
- ✅ Header and Footer components
- ✅ Loading and error states

## 🎨 Color Scheme

The app uses these colors from your design:
- Primary: `#424C61` (Dark blue)
- Secondary: `#A38B5D` (Gold/Bronze)
- Font Primary: `#121212`
- Stroke: `#F5F3ED`
- Shadow: `#E7E7E7`

## 📝 Next Steps

1. Make sure your backend API is running on port 3000
2. Test the API connection by checking the browser console
3. Customize components as needed
4. Add more pages/routes as required

## 🐛 Troubleshooting

- **Port already in use**: Change port in `vite.config.js`
- **API connection errors**: Check `.env` file and backend server
- **Build errors**: Run `npm install` again

