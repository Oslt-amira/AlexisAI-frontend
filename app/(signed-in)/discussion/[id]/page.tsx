import ChatWrapper from "@/components/chatUI/chat-wrapper";

export default function DiscussionPage({ params }: { params: { id: string } }) {
  return <ChatWrapper discussionId={params.id}/>
}
