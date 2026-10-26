import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';
import { Notification } from '../../models/Notification.js';

export class NotificationsController {
  static async getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const notifs = await Notification.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50);

      const mapped = notifs.map(n => ({
        id: n._id.toString(),
        title: n.title,
        message: n.message,
        type: n.type,
        read: n.read,
        timestamp: n.createdAt.toISOString(),
        actionUrl: n.actionUrl,
      }));

      res.json(mapped);
    } catch (err) {
      next(err);
    }
  }

  static async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;

      const notif = await Notification.findOneAndUpdate(
        { _id: id, userId: user._id },
        { read: true },
        { new: true }
      );

      if (!notif) {
        res.status(404).json({ success: false, message: 'Notification not found' });
        return;
      }

      res.json({ success: true, notification: notif });
    } catch (err) {
      next(err);
    }
  }

  static async markAllAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      await Notification.updateMany({ userId: user._id, read: false }, { read: true });
      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
      next(err);
    }
  }
}
