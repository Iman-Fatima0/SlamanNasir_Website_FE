# Social Media Icons Setup

The user dashboard sidebar now includes social media icons (Gmail, Facebook, Instagram, and LinkedIn) that link to your profiles.

## Setup Instructions

1. Create a `.env` file in the root of your project (if it doesn't exist)

2. Add the following environment variables with your social media URLs:

```env
# Social Media URLs
VITE_SOCIAL_GMAIL_URL=https://mail.google.com/mail/?view=cm&fs=1&to=your-email@gmail.com
VITE_SOCIAL_FACEBOOK_URL=https://www.facebook.com/your-profile
VITE_SOCIAL_INSTAGRAM_URL=https://www.instagram.com/your-profile
VITE_SOCIAL_LINKEDIN_URL=https://www.linkedin.com/in/your-profile
```

3. Replace the placeholder URLs with your actual social media profile URLs

4. Restart your development server for the changes to take effect

## Notes

- Icons will only appear if the corresponding environment variable is set
- All links open in a new tab with `target="_blank"` and `rel="noopener noreferrer"` for security
- Icons have hover effects with brand-appropriate colors:
  - Gmail: Red on hover
  - Facebook: Blue on hover
  - Instagram: Gradient (purple-pink-orange) on hover
  - LinkedIn: Dark blue on hover
