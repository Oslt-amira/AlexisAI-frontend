export {};

declare global {
  interface User {
    id?: string;
    email: string;
    name?: string;
    createdAt?: Date;
    university?: string;
    fieldOfStudy?: string;
    image?: string;
    dateOfBirth: Date;
    currentFieldOfStudy?: string;
    isPro?: boolean;
    proEndsAt?: Date;
  }

  interface Conversation {
    id: string;
    limit: 20;
    has_more: boolean = false;
    data: any[];
  }

  interface ConversationMessage {
    id: string;
    role: "user" | "alexis";
    content: string;
    date: TimeStamp | number;
    conversationId?: string;
    moreInfo?: any;
    retriever_resources?: any;
    agent_thoughts?: any[] | null;
  }

  interface Interaction {
    id: string;
    query: string;
    answer: string;
    created_at: Date | number | TimeStamp;
    message_files?: any[];
    feedback?: any;
    retriever_resources?: any[] | null;
    conversation_id?: string;
    agent_thoughts?: any[] | null;

  }
}

export interface ConversationsHistory {
  limit: 40;
  has_more: boolean = false;
  data: GeneralConversationInfo[];
}

export interface GeneralConversationInfo {
  id: string;
  name: string;
  inputs: any[];
  status: any = "normal";
  introduction: string;
  created_at: number;
}
