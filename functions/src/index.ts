import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { onSchedule } from 'firebase-functions/v2/scheduler';

admin.initializeApp();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-specific-password'
    }
});

export const checkDeadlines = onSchedule('every 1 hours', async (event) => {
    const now = new Date();
    const db = admin.firestore();
    
    const activities = await db.collection('activities')
        .where('isCompleted', '==', false)
        .get();

    for (const doc of activities.docs) {
        const activity = doc.data();
        const deadline = new Date(activity['deadline']);
        const dayBeforeDeadline = new Date(deadline);
        dayBeforeDeadline.setDate(deadline.getDate() - 1);

        // Check for day before notifications
        if (!activity['notificationsSent']['dayBefore'] && 
            isSameDay(now, dayBeforeDeadline)) {
            await sendEmail(activity, 'dayBefore');
            await doc.ref.update({
                'notificationsSent.dayBefore': true
            });
        }

        // Check for day of notifications
        if (!activity['notificationsSent']['dayOf'] && 
            isSameDay(now, deadline)) {
            await sendEmail(activity, 'dayOf');
            await doc.ref.update({
                'notificationsSent.dayOf': true
            });
        }
    }
});

function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

async function sendEmail(activity: any, type: 'dayBefore' | 'dayOf') {
    const user = await admin.auth().getUser(activity.userId);
    const deadline = new Date(activity['deadline']);
    
    const subject = type === 'dayBefore' 
        ? `Reminder: Activity due tomorrow - ${activity.title}`
        : `Reminder: Activity due today - ${activity.title}`;
    
    const text = type === 'dayBefore'
        ? `Your activity "${activity.title}" is due tomorrow at ${deadline.toLocaleTimeString()}.`
        : `Your activity "${activity.title}" is due today at ${deadline.toLocaleTimeString()}.`;

    await transporter.sendMail({
        from: 'your-email@gmail.com',
        to: user.email,
        subject,
        text
    });
} 