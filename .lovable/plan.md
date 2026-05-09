Build a polished demo Sales Management app for Nashi Gold Jewellery focused on the salesman experience only.

## Scope

The app will be a frontend demo with realistic sample data. It will not include real login, database storage, or admin screens in this first version.

## App structure

Create a single-page mobile-friendly dashboard with four main sections:

```text
Nashi Gold Jewellery Sales App
├── Home dashboard summary
├── Attendance
├── Sales Target
├── Profile
└── Notice
```

Navigation will use clear tabs/cards so a salesman can quickly move between sections.

## 1. Home dashboard

Add a branded landing dashboard showing:
- Salesman greeting and employee ID
- Today’s attendance status
- Weekly target progress
- Monthly target progress
- Latest notice preview
- Quick action buttons for Check In / Check Out and viewing targets

## 2. Attendance

Build a simple attendance tracker with:
- Check In button
- Check Out button
- Current day status: Not checked in, Checked in, or Checked out
- Display of check-in and check-out time
- Personal attendance history table/list with sample dates and statuses

Because this is demo-only, the check-in/check-out action will update the screen locally during the current session.

## 3. Sales Target

Build weekly and monthly target cards showing:
- Assigned target amount
- Achieved sales amount
- Remaining balance
- Progress bar and percentage
- Clear visual status, such as “On Track” or “Needs Attention”

Use jewellery-sales-style sample numbers in Indian Rupees.

## 4. Profile

Build a profile screen showing sample salesman details:
- Name
- Employee ID
- Contact number
- Email
- Branch/location
- Role
- Joining date

Since this is demo-only, profile data will be static sample data.

## 5. Notice

Build a notice/announcements section with sample admin updates:
- Notice title
- Date
- Message body
- Priority/status badge where useful

Include notices relevant to a jewellery sales team, such as target updates, store policy reminders, offers, and training updates.

## Visual design

Use a premium jewellery-brand look suitable for “Nashi Gold Jewellery”:
- Warm gold accents
- Clean cream/light background
- Dark text for readability
- Elegant cards with subtle shadows
- Mobile-first layout that also looks good on desktop

## Technical details

- Replace the current placeholder home page in `src/pages/Index.tsx`.
- Use React state for demo check-in/check-out behavior.
- Use Tailwind CSS and existing UI components where helpful.
- Keep everything frontend-only for this version.
- No authentication, database, or admin role system will be added yet.
- Ensure the design works responsively across mobile and desktop.