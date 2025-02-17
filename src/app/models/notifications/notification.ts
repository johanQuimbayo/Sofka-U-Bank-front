export type NotificationTypes = "success" | "error"

type Notification = {
    type: NotificationTypes;
    message: string;
}

export default Notification