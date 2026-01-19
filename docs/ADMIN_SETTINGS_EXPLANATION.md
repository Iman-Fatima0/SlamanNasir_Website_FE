# Admin Dashboard Settings - Section Explanations

## Overview
The Admin Settings page (`/admin/settings`) is a centralized configuration panel where administrators can manage all platform-wide settings. It's organized into 6 main sections accessible via tabs.

---

## 1. **General Settings** (`general` tab)

**Purpose:** Core platform configuration and branding

**What it manages:**
- **Platform Name/Branding**
  - Site name (e.g., "Salman Nasir")
  - Logo upload/URL
  - Favicon
  - Brand colors
  
- **Basic Information**
  - Platform description
  - Contact email
  - Support email
  - Phone number
  - Physical address (if applicable)
  
- **Localization**
  - Default language
  - Timezone
  - Date format
  - Currency settings
  
- **Platform Status**
  - Maintenance mode toggle
  - Site visibility (public/private)
  - Registration enabled/disabled

**Current Implementation:** Placeholder form fields (not connected to backend)

**Backend Integration Needed:**
- `GET /admin/settings/general` - Fetch current general settings
- `PUT /admin/settings/general` - Update general settings

---

## 2. **Payments Settings** (`payments` tab)

**Purpose:** Configure payment gateways and financial settings

**What it manages:**
- **Payment Gateways**
  - Stripe API keys (publishable & secret)
  - PayPal configuration
  - Other payment providers (Square, Razorpay, etc.)
  - Enable/disable payment methods
  
- **Currency & Pricing**
  - Default currency
  - Currency symbol position
  - Tax settings (VAT, GST, etc.)
  - Tax rates by region
  
- **Payout Settings**
  - Instructor payout percentage
  - Payout schedule (weekly, monthly)
  - Minimum payout threshold
  - Payout method (bank transfer, PayPal, etc.)
  
- **Refund Policy**
  - Refund window (days)
  - Auto-refund rules
  - Refund processing time

**Current Implementation:** Placeholder form fields (not connected to backend)

**Backend Integration Needed:**
- `GET /admin/settings/payments` - Fetch payment configuration
- `PUT /admin/settings/payments` - Update payment settings
- Test payment gateway connection

---

## 3. **Emails Settings** (`emails` tab)

**Purpose:** Configure email templates and SMTP settings

**What it manages:**
- **SMTP Configuration**
  - SMTP host
  - SMTP port
  - SMTP username/password
  - Encryption (TLS/SSL)
  - From email address
  - From name
  
- **Email Templates**
  - Welcome email template
  - Course enrollment confirmation
  - Order receipt
  - Password reset email
  - Course completion certificate
  - Instructor notifications
  
- **Email Preferences**
  - Enable/disable email notifications
  - Email frequency settings
  - BCC admin on important emails
  
- **Email Testing**
  - Send test email
  - Preview templates

**Current Implementation:** Placeholder form fields (not connected to backend)

**Backend Integration Needed:**
- `GET /admin/settings/emails` - Fetch email configuration
- `PUT /admin/settings/emails` - Update email settings
- `POST /admin/settings/emails/test` - Send test email

---

## 4. **Storage Settings** (`storage` tab)

**Purpose:** Manage file storage and media settings

**What it manages:**
- **Storage Provider**
  - Local storage
  - AWS S3 configuration
  - Cloudinary settings
  - Google Cloud Storage
  - Azure Blob Storage
  
- **Storage Configuration**
  - Bucket/container name
  - Access keys
  - Region selection
  - CDN URL (if applicable)
  
- **File Upload Limits**
  - Max file size per upload
  - Allowed file types
  - Video file size limits
  - Image compression settings
  
- **Storage Usage**
  - Current storage used
  - Storage quota
  - File count
  - Cleanup options

**Current Implementation:** Placeholder form fields (not connected to backend)

**Backend Integration Needed:**
- `GET /admin/settings/storage` - Fetch storage configuration
- `PUT /admin/settings/storage` - Update storage settings
- `GET /admin/settings/storage/usage` - Get storage statistics

---

## 5. **Security Settings** (`security` tab)

**Purpose:** Security and authentication configuration

**What it manages:**
- **Authentication**
  - Password requirements (min length, complexity)
  - Session timeout
  - Two-factor authentication (2FA) requirements
  - OAuth providers (Google, Facebook, etc.)
  
- **Security Policies**
  - Account lockout after failed attempts
  - IP whitelist/blacklist
  - Rate limiting settings
  - CSRF protection
  
- **API Security**
  - API key management
  - Rate limiting for API
  - CORS settings
  
- **Security Logs**
  - View login attempts
  - Failed authentication logs
  - Suspicious activity alerts

**Current Implementation:** Placeholder form fields (not connected to backend)

**Backend Integration Needed:**
- `GET /admin/settings/security` - Fetch security settings
- `PUT /admin/settings/security` - Update security settings
- `GET /admin/settings/security/logs` - Get security logs

---

## 6. **Legal Settings** (`legal` tab)

**Purpose:** Legal documents and compliance settings

**What it manages:**
- **Legal Documents**
  - Terms of Service (ToS) editor
  - Privacy Policy editor
  - Cookie Policy
  - Refund Policy
  - User Agreement
  
- **Compliance**
  - GDPR compliance toggle
  - Cookie consent settings
  - Data retention policies
  - Right to deletion settings
  
- **Legal Information**
  - Company name
  - Business registration number
  - Tax ID
  - Legal address
  - Contact for legal matters

**Current Implementation:** Placeholder form fields (not connected to backend)

**Backend Integration Needed:**
- `GET /admin/settings/legal` - Fetch legal documents
- `PUT /admin/settings/legal` - Update legal documents
- Rich text editor for document editing

---

## Current State

**What's Working:**
- ✅ Tab navigation between sections
- ✅ UI layout with sidebar and content area
- ✅ Dark theme styling
- ✅ Basic form structure

**What's Missing:**
- ❌ Backend API integration
- ❌ Actual form fields for each section
- ❌ Data fetching and saving
- ❌ Validation
- ❌ Success/error notifications
- ❌ Rich text editor for legal documents
- ❌ File upload for logos/storage
- ❌ Test functionality (email, payment gateway)

---

## Next Steps for Full Implementation

1. **Create Settings API Service**
   ```javascript
   // src/services/settings.service.js
   AdminService.getSettings(category) // 'general', 'payments', etc.
   AdminService.updateSettings(category, data)
   ```

2. **Add API Endpoints to Constants**
   ```javascript
   ADMIN: {
     SETTINGS: '/admin/settings',
     SETTINGS_CATEGORY: (category) => `/admin/settings/${category}`,
   }
   ```

3. **Implement Form Components**
   - Create reusable form components for each section
   - Add validation
   - Add file upload components
   - Add rich text editor for legal documents

4. **Add State Management**
   - Use React Query for data fetching
   - Handle form state
   - Show loading/success/error states

5. **Add Testing Features**
   - Test email sending
   - Test payment gateway connection
   - Preview email templates

---

## Example Data Structure

Each settings category would typically return/accept:

```javascript
// General Settings
{
  platformName: "Salman Nasir",
  logoUrl: "https://...",
  contactEmail: "contact@example.com",
  defaultLanguage: "en",
  timezone: "UTC",
  maintenanceMode: false
}

// Payment Settings
{
  stripePublishableKey: "pk_...",
  stripeSecretKey: "sk_...",
  defaultCurrency: "USD",
  taxRate: 0.08,
  instructorPayoutPercentage: 70
}

// Email Settings
{
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  smtpUser: "noreply@example.com",
  fromEmail: "noreply@example.com",
  fromName: "Salman Nasir"
}
```

