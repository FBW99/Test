import React, { createContext, useContext, useEffect, useState } from "react";
import { SEED_INQUIRIES, SEED_NOTIFICATIONS } from "@/src/data/seedData";
import { readStorage, STORAGE_KEYS, writeStorage } from "@/src/services/storage";
import type { AppNotification, SupportInquiry, UserRole } from "@/src/types";

interface NotificationContextValue {
  notifications: AppNotification[];
  inquiries: SupportInquiry[];
  addNotification: (
    payload: Omit<AppNotification, "id" | "read" | "createdAt">
  ) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsReadForRole: (role: UserRole, userId?: string) => void;
  getNotificationsForUser: (role: UserRole, userId?: string) => AppNotification[];
  createSupportInquiry: (
    payload: Omit<SupportInquiry, "id" | "status" | "createdAt">
  ) => void;
  replyToInquiry: (inquiryId: string, adminReply: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    readStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS)
  );
  const [inquiries, setInquiries] = useState<SupportInquiry[]>(() =>
    readStorage<SupportInquiry[]>(STORAGE_KEYS.INQUIRIES, SEED_INQUIRIES)
  );

  useEffect(() => {
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.INQUIRIES, inquiries);
  }, [inquiries]);

  const addNotification = (
    payload: Omit<AppNotification, "id" | "read" | "createdAt">
  ) => {
    const item: AppNotification = {
      ...payload,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [item, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllAsReadForRole = (role: UserRole, userId?: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        const matches =
          (n.recipientRole === role || n.recipientRole === "all") &&
          (!n.recipientUserId || n.recipientUserId === userId);
        return matches ? { ...n, read: true } : n;
      })
    );
  };

  const getNotificationsForUser = (role: UserRole, userId?: string) => {
    return notifications.filter(
      (n) =>
        (n.recipientRole === role || n.recipientRole === "all") &&
        (!n.recipientUserId || n.recipientUserId === userId)
    );
  };

  const createSupportInquiry = (
    payload: Omit<SupportInquiry, "id" | "status" | "createdAt">
  ) => {
    const inquiry: SupportInquiry = {
      ...payload,
      id: `inq-${Date.now()}`,
      status: "Open",
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [inquiry, ...prev]);
    addNotification({
      recipientRole: "admin",
      title: `Customer Inquiry from ${payload.customerName}`,
      message: payload.subject,
      relatedOrderId: payload.orderId,
    });
  };

  const replyToInquiry = (inquiryId: string, adminReply: string) => {
    const target = inquiries.find((i) => i.id === inquiryId);
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === inquiryId
          ? { ...inq, adminReply, status: "Resolved" }
          : inq
      )
    );
    if (target) {
      addNotification({
        recipientRole: "customer",
        recipientUserId: target.customerId,
        title: `Herbiz Support Replied: ${target.subject}`,
        message: adminReply,
        relatedOrderId: target.orderId,
      });
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        inquiries,
        addNotification,
        markAsRead,
        markAllAsReadForRole,
        getNotificationsForUser,
        createSupportInquiry,
        replyToInquiry,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
