"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ArrowLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { SubmitMessage } from "@/app/(private)/chat/submitMessage";
import Image from "next/image";
import { customFetch } from "@/app/components/customFetch";

export function LeftMessage({
  image,
  text,
}: {
  image: string;
  text: string;
}): JSX.Element {
  return (
    <div className="flex items-end">
      <Image
        alt="Image of user"
        src={`data:image/png;base64,${image}`}
        width={32}
        height={32}
        className="rounded-full"
      />
      <div className="ml-2 bg-gray-200 rounded-lg p-3 max-w-xs">
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
}

export function RightMessage({ text }: { text: string }): JSX.Element {
  return (
    <div className="flex items-end justify-end">
      <div className="mr-2 bg-blue-500 text-white rounded-lg p-3 max-w-xs">
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
}

export function SendButton({
  setMessage,
}: {
  setMessage: (message: string) => void;
}): JSX.Element {
  const { pending } = useFormStatus();

  return (
    <button
      aria-disabled={pending}
      type="submit"
      className="bg-blue-500 rounded-md text-white"
      onClick={() => setMessage("")}
    >
      {pending ? (
        "Submitting..."
      ) : (
        <>
          <PaperAirplaneIcon className="h-5 w-10 " />
          <span className="sr-only">Send message</span>
        </>
      )}
    </button>
  );
}

export function MainChat({
  selectedContact,
  toggleSidebar,
  contact,
  accessToken
}: {
  selectedContact: number;
  toggleSidebar: () => void;
  contact: {
    contact_id: number;
    senderId: number | undefined;
    name: string;
    image: string;
  };
  accessToken: string;
}): JSX.Element {
  const [state, action] = useFormState(SubmitMessage, undefined);
  const [message, setMessage] = useState<string>("");
  console.log("contact.contact_id", contact.contact_id);
  const [posts, setPosts] = useState<
    {
      id: number;
      contactId: number;
      senderId: number;
      message: string;
      date: string;
    }[]
  >([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await customFetch(
          `http://localhost:8000/api/chat/${contact.contact_id}`,
          accessToken
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: {
          id: number;
          contactId: number;
          senderId: number;
          message: string;
          date: string;
        }[] = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    fetchPosts();
  }, [contact.contact_id]);

  if (!posts) return <div>Loading...</div>;

  return (
    <>
      {/* Chat Header */}
      <header className="bg-white border-b p-4 flex items-center">
        <button className="md:hidden" onClick={toggleSidebar}>
          <ArrowLeftIcon className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </button>
        <div className="flex items-center">
          <Image
            alt="Image of user"
            src={`data:image/png;base64,${contact.image}`}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <h1 className="ml-3 text-xl font-semibold">{contact.name}</h1>
      </header>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {posts.map((post) => (
          <li key={post.id}>{post.message}</li>
        ))}
        <LeftMessage image={contact.image} text="Hey, how are you doing?" />
        <RightMessage text="I'm good, thanks! How about you?" />
        <LeftMessage image={contact.image} text="lol, I'm good too!" />
      </div>
      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <form className="flex space-x-2" action={action}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
            placeholder="Type a message ..."
          />
          {message && <SendButton setMessage={setMessage} />}
        </form>
      </div>
    </>
  );
}