// services/petDetailsService.ts
import { PetDetailData } from "../types/mapTypes";

class PetDetailMapService {
  private baseUrl = "https://your-api.com/api";

  async getPetDetails(petId: string): Promise<PetDetailData> {
    try {
      const response = await fetch(`${this.baseUrl}/pets/${petId}/details`);
      if (!response.ok) throw new Error("Failed to fetch pet details");

      return await response.json();
    } catch (error) {
      console.error("Error fetching pet details:", error);
      throw error;
    }
  }

  async updatePetDetails(
    petId: string,
    updates: Partial<PetDetailData>
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/pets/${petId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update pet details");
    } catch (error) {
      console.error("Error updating pet details:", error);
      throw error;
    }
  }

  async markAsResolved(petId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/pets/${petId}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to mark as resolved");
    } catch (error) {
      console.error("Error marking as resolved:", error);
      throw error;
    }
  }
}

// services/contactService.ts
import { ContactRequest, Conversation, ChatMessage } from "../types/mapTypes";

class ContactService {
  private baseUrl = "https://your-api.com/api";

  async createContactRequest(
    request: Omit<ContactRequest, "id" | "status" | "createdAt">
  ): Promise<ContactRequest> {
    try {
      const response = await fetch(`${this.baseUrl}/contact-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...request,
          status: "pending",
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to create contact request");
      return await response.json();
    } catch (error) {
      console.error("Error creating contact request:", error);
      throw error;
    }
  }

  async logContactAttempt(contactInfo: any): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/contact-attempts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...contactInfo,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Error logging contact attempt:", error);
      // No throw aquí para no bloquear el flujo principal
    }
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/users/${userId}/conversations`
      );
      if (!response.ok) throw new Error("Failed to fetch conversations");

      return await response.json();
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  }

  async sendMessage(
    conversationId: string,
    message: Omit<ChatMessage, "id" | "createdAt">
  ): Promise<ChatMessage> {
    try {
      const response = await fetch(
        `${this.baseUrl}/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...message,
            createdAt: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");
      return await response.json();
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
}

// services/reportService.ts
import { Report } from "../types/mapTypes";

class ReportService {
  private baseUrl = "https://your-api.com/api";

  async createReport(report: Omit<Report, "id">): Promise<Report> {
    try {
      const response = await fetch(`${this.baseUrl}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) throw new Error("Failed to create report");
      return await response.json();
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  }

  async getReportsByUser(userId: string): Promise<Report[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/reports`);
      if (!response.ok) throw new Error("Failed to fetch reports");

      return await response.json();
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  }
}

// services/notificationService.ts
import { Notification } from "../types/mapTypes";

class NotificationService {
  private baseUrl = "https://your-api.com/api";

  async sendNotification(
    notification: Omit<Notification, "id" | "createdAt">
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...notification,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to send notification");
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/users/${userId}/notifications`
      );
      if (!response.ok) throw new Error("Failed to fetch notifications");

      return await response.json();
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/notifications/${notificationId}/read`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) throw new Error("Failed to mark notification as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }
}

// Exportar instancias singleton
export const petDetailMapService = new PetDetailMapService();
export const contactService = new ContactService();
export const reportService = new ReportService();
export const notificationService = new NotificationService();
