# 🔐 Secure Database with localStorage Persistence

A Next.js application demonstrating a secure, persistent database implementation using localStorage with encryption, Row Level Security (RLS), and comprehensive security features.

## ✨ Features

- **🔐 Secure Database**: In-memory database with localStorage persistence
- **🛡️ Row Level Security (RLS)**: Users can only access their own data
- **🔒 CSRF Protection**: Built-in CSRF token validation
- **✅ Input Validation**: Zod schema validation for all inputs
- **🔐 Data Encryption**: localStorage data is encrypted at rest
- **📊 A/B Testing**: Deterministic but secure A/B variant assignment
- **🔄 Data Persistence**: Data survives page refreshes and browser sessions
- **🚀 Progressive Flow**: Multi-step cancellation flow with state management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/neerajghate/mm-cancel-flow-task-Neeraj.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:setup
   ```
   This will create a `database-setup.html` file. Open it in your browser and click "Initialize Database" to set up localStorage.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in your terminal)

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:setup` - Initialize localStorage database
- `npm run test:security` - Test security implementation

## 🏗️ Architecture

### Database Layer
- **`SecureDatabase`**: Main database class with RLS policies
- **`RLSPolicies`**: Row Level Security enforcement
- **`PersistenceLayer`**: Interface for data persistence
- **`LocalStoragePersistence`**: localStorage implementation with encryption

### Security Features
- **Row Level Security**: Users can only access their own data
- **CSRF Protection**: Token-based CSRF prevention
- **Input Validation**: Zod schema validation
- **Data Encryption**: XOR encryption for localStorage data
- **Secure RNG**: Crypto API for A/B testing and token generation

### Data Models
- **User**: Basic user information
- **Subscription**: User subscription details
- **Cancellation**: Cancellation flow data with A/B variants

## 🔧 Database Setup Process

1. **Run `npm run db:setup`**
   - Verifies project structure
   - Creates `database-setup.html` setup page

2. **Open `database-setup.html` in browser**
   - Click "Initialize Database" to create seed data
   - Data is encrypted and stored in localStorage
   - Check status to verify setup

3. **Start application**
   - App automatically loads from localStorage
   - Falls back to seed data if localStorage is empty

## 📊 Data Persistence

### What Gets Stored
- **Users**: Email, ID, timestamps
- **Subscriptions**: Status, pricing, user association
- **Cancellations**: Flow data, A/B variants, reasons
- **CSRF Tokens**: Security tokens with expiration

### Storage Location
- **Browser**: localStorage (encrypted)
- **Scope**: Per-browser, per-domain
- **Persistence**: Survives page refreshes and browser sessions

### Data Migration
- Automatic version checking
- Graceful fallback to seed data
- Migration support for schema changes

## 🛡️ Security Implementation

### Row Level Security (RLS)
```typescript
// Users can only access their own data
static canAccessUser(userId: string, context: RLSContext): boolean {
  return context.is_authenticated && context.current_user_id === userId;
}
```

### CSRF Protection
- Token generation on session start
- Validation on all state-changing operations
- Automatic token expiration (24 hours)

### Input Validation
- Zod schemas for all data types
- Sanitization to prevent XSS
- Length and type validation

## 🔄 A/B Testing

### Implementation
- Deterministic but secure variant assignment
- Uses crypto API for randomness
- Fallback to hash-based assignment
- Persistent across sessions

### Variants
- **Bucket A**: Sees downsell offers
- **Bucket B**: Skips downsell (direct to cancellation)

## 📁 Project Structure

```
src/
├── lib/
│   ├── database.ts          # Secure database implementation
│   ├── persistence.ts       # localStorage persistence layer
│   ├── validation.ts        # Input validation schemas
│   └── userSession.ts       # User session management
├── components/               # React components
├── hooks/                   # Custom React hooks
└── app/                     # Next.js app router
scripts/
└── setup-database.js        # Database setup script
```

## 🧪 Testing

### Security Testing
```bash
npm run test:security
```
Tests for:
- RLS policies implementation
- CSRF token generation/validation
- Input validation schemas
- Data sanitization functions

### Manual Testing
1. **Data Persistence**: Refresh page, verify data remains
2. **Security**: Check browser dev tools for encrypted localStorage
3. **Flow**: Complete cancellation flow, verify state persistence

## 🚨 Troubleshooting

### Common Issues

**"Database not initialized"**
- Run `npm run db:setup`
- Open `database-setup.html` and click "Initialize Database"

**"localStorage not available"**
- Ensure you're running in a browser (not SSR)
- Check if localStorage is enabled in your browser

**"Data not persisting"**
- Verify localStorage is working in browser dev tools
- Check console for encryption/decryption errors

### Debug Mode
- Check browser console for detailed logging
- Use `database-setup.html` to inspect localStorage state
- Verify encryption keys match between setup and app

## 🔮 Future Enhancements

- **Backend Integration**: Replace localStorage with real database
- **Multi-User Support**: Extend RLS for multiple users
- **Advanced Encryption**: Use proper encryption libraries
- **Data Sync**: Cloud synchronization for cross-device access
- **Audit Logging**: Track all data access and modifications

## 📝 License

This project is for assessment purposes. Please refer to your assignment requirements for usage guidelines.

## 🤝 Contributing

This is a take-home assessment project. Please follow the assignment guidelines for any modifications or improvements.
