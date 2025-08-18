# A/B Testing Implementation for Downsell Step

## Overview

This document explains the A/B testing implementation for the downsell step in the cancel flow, as described in Dylan's video transcript. The system ensures that 50% of users see the downsell offer (50% off) while 50% skip it entirely.

## How It Works

### 1. A/B Test Bucket Assignment

- **Bucket A (50% of users)**: Sees the downsell step
- **Bucket B (50% of users)**: Skips the downsell step entirely
- **Assignment**: Randomly assigned on first visit, persisted in localStorage
- **Distribution**: 50/50 split (configurable in `AB_TESTING_CONFIG.DEFAULT_DISTRIBUTION`)

### 2. User Flow

#### For Bucket A (Downsell Shown):
```
Initial → Downsell (50% off offer) → Reason → Final Reason → Done
Step 1     Step 2                    Step 3   Step 4        Step 5
```

#### For Bucket B (Downsell Skipped):
```
Initial → Reason → Final Reason → Done
Step 1     Step 2   Step 3        Step 4
```

### 3. Step Counting Logic

The progress indicators automatically adjust based on whether the user saw the downsell:

- **With Downsell**: Shows "Step X of 4" (4 total steps)
- **Without Downsell**: Shows "Step X of 3" (3 total steps)

## Implementation Details

### Key Files Modified

1. **`src/hooks/useCancelFlow.ts`**
   - Enhanced A/B testing logic
   - Added console logging for debugging
   - Improved error handling

2. **`src/components/DownsellStep.tsx`**
   - Added progress indicator (Step 2 of 4)
   - Added A/B testing indicator badge
   - Enhanced visual design

3. **`src/components/ReasonStep.tsx`**
   - Dynamic step counting based on `sawDownsell` prop
   - Updated progress indicators

4. **`src/components/ModalRouter.tsx`**
   - Passes `sawDownsellThisSession` to ReasonStep
   - Handles routing logic for both paths

### A/B Testing Logic

```typescript
const handleStillLooking = () => {
  if (AB_TESTING_CONFIG.FORCE_DOWNSELL || abBucket === BUSINESS_CONFIG.AB_BUCKETS.A) {
    // Bucket A: Show downsell (50% of users)
    setSawDownsellThisSession(true);
    setModalStage(BUSINESS_CONFIG.MODAL_STAGES.DOWNSELL);
    AnalyticsService.trackAction('downsell_shown', { bucket: abBucket });
  } else {
    // Bucket B: Skip downsell (50% of users)
    setSawDownsellThisSession(false);
    setModalStage(BUSINESS_CONFIG.MODAL_STAGES.REASON);
    AnalyticsService.trackAction('downsell_skipped', { bucket: abBucket });
  }
};
```

### Configuration

```typescript
export const AB_TESTING_CONFIG = {
  DEFAULT_DISTRIBUTION: 0.5, // 50% chance for each bucket
  FORCE_DOWNSELL: false, // Toggle while testing A/B
} as const;

export const BUSINESS_CONFIG = {
  AB_BUCKETS: {
    A: 'A', // sees downsell
    B: 'B', // skips downsell
  },
  // ... other config
} as const;
```

## Testing the Implementation

### 1. Open Browser Console
- Press F12 → Console tab
- Look for A/B testing logs

### 2. Test Different Scenarios

#### Test Bucket A (Downsell Shown):
1. Click "Cancel Migrate Mate"
2. Select "Not yet, I'm still looking"
3. Should see downsell step with "Step 2 of 4"
4. Look for console log: "A/B Test: Showing downsell to user (Bucket A)"

#### Test Bucket B (Downsell Skipped):
1. Clear localStorage: `localStorage.removeItem('mm_cancel_ab')`
2. Refresh page
3. Click "Cancel Migrate Mate"
4. Select "Not yet, I'm still looking"
5. Should skip directly to reason step with "Step 2 of 3"
6. Look for console log: "A/B Test: Skipping downsell for user (Bucket B)"

### 3. Force Specific Bucket

To test a specific bucket, you can manually set it:
```javascript
// Force Bucket A (see downsell)
localStorage.setItem('mm_cancel_ab', 'A')

// Force Bucket B (skip downsell)
localStorage.setItem('mm_cancel_ab', 'B')
```

## Analytics & Tracking

The system tracks:
- Which bucket each user is assigned to
- Whether downsell was shown or skipped
- User actions within each bucket
- Form completion rates for comparison

## Benefits

1. **Data-Driven Decisions**: Compare conversion rates between buckets
2. **User Experience**: Test if downsell helps retain users
3. **Revenue Impact**: Measure if 50% off offer increases retention
4. **Scientific Approach**: Proper A/B testing methodology

## Future Enhancements

1. **Dynamic Distribution**: Adjust split based on performance
2. **Multi-Variant Testing**: Test different offer amounts
3. **Personalization**: Consider user behavior for bucket assignment
4. **Real-time Analytics**: Dashboard for monitoring A/B test performance

## Notes

- A/B test bucket is persisted in localStorage to maintain consistency
- Users won't see different experiences on subsequent visits
- The system gracefully handles storage errors with fallback to Bucket A
- Console logging can be removed in production for cleaner code
