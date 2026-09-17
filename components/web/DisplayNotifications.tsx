import { Notification } from "@/lib/models/Notification";
import { NotificationItem } from "./NotificationItems";

interface DisplayNotificationsProps {
  userId: string;
}

export async function DisplayNotifications({ userId }: DisplayNotificationsProps) {
  const notifications = await Notification.find({ sentTo: userId });
  if (notifications.length === 0) {
    return (
      <div className="w-80 rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-500 shadow-lg">
        You are all caught up
      </div>
    );
  }

  return (
    <div className="w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
      <div className="max-h-80 space-y-1 overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id.toString()}
            message={notification.message}
            groupId={notification.groupId.toString()}
            link={notification?.link}
          />
        ))}
      </div>
    </div>
  );
}
