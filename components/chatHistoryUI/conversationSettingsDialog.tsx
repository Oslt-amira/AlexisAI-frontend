import React, { useEffect, useState } from "react";
import { ConversationsHistory, GeneralConversationInfo } from "@/types/global";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

import { Input } from "../ui/input";
import { deleteConversation, renameConversation } from "@/lib/api";
import { useToast } from "../ui/use-toast";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useParams, useRouter } from "next/navigation";

interface ConversationSettingsDialogProps {
  children: React.ReactNode;
  conversation: GeneralConversationInfo;
  action: string;
  conversations: ConversationsHistory;
  setConversations: React.Dispatch<
    React.SetStateAction<ConversationsHistory | null>
  >;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const ConversationSettingsDialog: React.FC<ConversationSettingsDialogProps> = ({
  children,
  conversation,
  action,
  conversations,
  setConversations,
  setIsOpen,
}) => {
  const [name, setName] = useState<string>("");
  const { toast } = useToast();
  const [user] = useLocalStorage<User | null>("user", null);

  const router = useRouter();

  const params = useParams<{ id: string }>();

  const handleRename = async () => {
    try {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.Try again .",
      });
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.Try again .",
      });
    }
  };
  const handleDelete = async () => {
    const userId = user?.id?.toString();
    const response = await deleteConversation(userId, conversation.id);
    if (response.error) {
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.Try again .",
      });
    } else {
      if (conversation.id === params?.id) {
        router.push("/discussion");
      }
      toast({
        title: "Conversation deleted successfully!",
        description: "This action is permanent.",
      });
      if (conversations) {
        const updatedConversations = {
          ...conversations,
          data: conversations.data.filter(
            (conv) => conv.id !== conversation.id
          ),
        };
        setConversations(updatedConversations);
      }
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>

      {action === "rename" ? (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename conversation</AlertDialogTitle>
            <AlertDialogDescription>
              <Input
                type="text"
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600"
                defaultValue={conversation.name}
                onChange={(event) => setName(event.target.value)}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className=" bg-purple-900 hover:bg-purple-900/90 font-medium"
              disabled={!name}
              onClick={() => {
                handleRename();
                setIsOpen(false);
              }}
            >
              Rename
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              conversation and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className=" bg-purple-900 hover:bg-purple-900/90 font-medium"
              onClick={() => {
                handleDelete();
                setIsOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

export default ConversationSettingsDialog;
