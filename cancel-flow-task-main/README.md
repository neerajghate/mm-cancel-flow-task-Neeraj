# Migrate Mate Cancellation Flow

A comprehensive cancellation flow application with A/B testing, local database persistence, and security features.

## 🚀 Quick Start

```bash
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ✨ Features

### 🧪 A/B Testing
- **Deterministic A/B (50/50)**: Users are assigned to variant A or B on first entry
- **Variant A**: Sees downsell offer (50% off)
- **Variant B**: Skips downsell ($10 off instead)
- **Persistent Assignment**: Bucket assignment persists across sessions

### 💾 Local Database
- **Browser Storage**: Data persists in localStorage between sessions
- **Server Memory**: Fallback storage for server-side operations
- **Sample Data**: Pre-seeded with 3 users and active subscriptions
- **No External Dependencies**: Works offline without configuration

### 🔒 Security Features
- **Input Validation**: Zod-based schema validation
- **XSS Prevention**: HTML escaping and sanitization
- **CSRF Protection**: Token-based request validation
- **Rate Limiting**: Request throttling by IP
- **Security Headers**: Comprehensive HTTP security headers

### 📱 User Experience
- **Mobile Responsive**: Optimized for all device sizes
- **Progress Tracking**: Visual step indicators
- **Error Handling**: Comprehensive validation and error states
- **Accessibility**: ARIA labels and keyboard navigation

## 🗄️ Database Schema

### Users Table
```typescript
interface User {
  id: string;
  email: string;
  created_at: string;
}
```

### Subscriptions Table
```typescript
interface Subscription {
  id: string;
  user_id: string;
  monthly_price: number;
  status: 'active' | 'pending_cancellation' | 'cancelled';
  created_at: string;
  updated_at: string;
}
```

### Cancellations Table
```typescript
interface Cancellation {
  id: string;
  user_id: string;
  subscription_id: string;
  downsell_variant: 'A' | 'B';
  reason?: string;
  accepted_downsell: boolean;
  created_at: string;
}
```

## 🔄 A/B Testing Flow

1. **User Entry**: First-time users get randomly assigned to bucket A or B
2. **Variant A (50%)**: Sees downsell offer with 50% discount
3. **Variant B (50%)**: Skips downsell, goes directly to reason collection
4. **Persistence**: Assignment stored locally and reused on return visits
5. **Analytics**: All A/B interactions tracked for analysis

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Setup local database with sample data
npm run db:setup

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:setup` - Initialize local database

### Project Structure
```
src/
├── app/                 # Next.js app directory
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── services/           # Business logic services
└── constants/          # Configuration constants
```

## 🔍 Testing

### Local Database Testing
```bash
npm run db:setup
```

This will:
- Initialize sample data (3 users, 3 subscriptions)
- Test A/B testing functionality
- Verify database operations
- Confirm all features are working

### Manual Testing
1. Open the application in your browser
2. Click "Cancel Subscription" to start the flow
3. Test both "Yes, I found a job" and "Not yet" paths
4. Verify A/B testing works (check console for bucket assignment)
5. Complete the cancellation flow
6. Refresh the page to verify data persistence

## 📊 Monitoring

### Console Logging
- A/B test assignments and interactions
- Database operations (create, read, update)
- User actions and form submissions
- Error handling and validation

### Data Inspection
- Check browser localStorage for persistent data
- Monitor network requests (minimal, local only)
- Review console logs for debugging

## 🚀 Production Deployment

### Environment Variables
No external environment variables required for local database mode.

### Build Process
```bash
npm run build
npm run start
```

### Data Persistence
- **Development**: localStorage in browser
- **Production**: Can be easily migrated to real database
- **Migration**: DatabaseService abstracts storage layer

## 🔧 Customization

### A/B Testing Configuration
Edit `src/constants/config.ts` to modify:
- Distribution percentages
- Pricing variants
- Test parameters

### Database Schema
Modify `src/lib/localDb.ts` to add:
- New tables
- Additional fields
- Sample data

### Security Settings
Adjust `src/lib/security.ts` for:
- Rate limiting thresholds
- Validation rules
- Security headers

## 🐛 Troubleshooting

### Common Issues
1. **Data not persisting**: Check browser localStorage support
2. **A/B testing not working**: Clear localStorage and refresh
3. **Build errors**: Ensure all dependencies are installed

### Reset Database
```bash
# Clear all local data
npm run db:setup
```

### Debug Mode
Check browser console for:
- Database operations
- A/B test assignments
- Error messages
- Validation results

## 📈 Future Enhancements

### Database Migration
The local database can be easily replaced with:
- PostgreSQL/MySQL
- MongoDB
- Supabase/Firebase
- Custom API endpoints

### Analytics Integration
- Google Analytics
- Mixpanel
- Custom tracking
- A/B test results

### Performance Optimization
- Image optimization
- Code splitting
- Caching strategies
- Bundle optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
