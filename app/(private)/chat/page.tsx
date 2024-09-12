import { ChatUi } from "@/app/(private)/chat/chat-ui";
import { verifySession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { customFetch } from "@/app/components/customFetch";

export default async function Page() {
  const session: {
    isAuth: boolean;
    userId: number;
    role: string;
    accessToken: string;
  } = await verifySession();
  const userRole = session?.role;
  const accessToken: string = session?.accessToken;

  switch (userRole) {
    case "admin":
      redirect("/dashboard");
    case "coach":
      return await CoachesPage({ accessToken, userId: session.userId });
    case "customer":
      return await CustomerPage({ accessToken, userId: session.userId });
    default:
      redirect("/login");
  }
}

export async function CustomerPage({
  accessToken,
  userId,
}: {
  accessToken: string;
  userId: number;
}) {
  const contactData = await customFetch(
    "http://fastapi:8000/api/chat",
    accessToken
  );

  const userData = await customFetch(
    "http://fastapi:8000/api/customers" + userId,
    accessToken
  );
  const user = userData.json();

  const contactsReceive: {
    customer_id: number;
    employee_id: number;
    message: string;
    date: string;
    senderId: number;
  }[] = await contactData.json();

  let contactsList: {
    contact_id: number;
    message: string;
    date: string;
    senderId: number;
  }[] = [];
  if (contactsReceive[0] !== undefined) {
    contactsList = contactsReceive.map((contact) => ({
      contact_id: contact.employee_id,
      message: contact.message,
      date: contact.date,
      senderId: contact.senderId,
    }));
  } else {
    // contactsList = {
    //   contact_id: user,
    //   message: undefined,
    //   date: undefined,
    //   senderId: undefined,
    // };
  }

  let personalData: {
    id: number;
    name: string;
    image: string;
  }[] = [];

  for (const contact of contactsList) {
    let contactSum: {
      id: number;
      name: string;
      image: string;
    };
    const contactData = await customFetch(
      `http://fastapi:8000/api/employees/${contact.contact_id}`,
      accessToken
    );
    const contactInfo = await contactData.json();
    const imageData = await customFetch(
      `http://fastapi:8000/api/employees/${contact.contact_id}/image`,
      accessToken
    );
    const image = await imageData.json();

    contactSum = {
      id: contact.contact_id,
      name: contactInfo.name,
      image: image,
    };
    personalData.push(contactSum);
  }

  const contacts: {
    contact_id: number;
    message: string;
    date: string;
    senderId: number;
    name: string;
    image: string;
  }[] = contactsList.map((contact) => ({
    contact_id: contact.contact_id,
    message: contact.message,
    date: contact.date,
    senderId: contact.senderId,
    name:
      personalData.find((personal) => personal.id === contact.contact_id)
        ?.name || "",
    image:
      personalData.find((personal) => personal.id === contact.contact_id)
        ?.image || "",
  }));

  return <ChatUi contacts={contacts} accessToken={accessToken} userId={userId} role="customer" />;
}

export async function CoachesPage({
  accessToken,
  userId,
}: {
  accessToken: string;
  userId: number;
}) {
  const contactData = await customFetch(
    "http://fastapi:8000/api/chat/",
    accessToken
  );

  const userData = await customFetch(
    "http://fastapi:8000/api/employees/" + userId,
    accessToken
  );
  const user: {
    id: number;
    email: string;
    name: string;
    surname: string;
    birthdate: string;
    gender: string;
    work: string;
    customer_list: number[];
  } = await userData.json();

  const contactsReceive: {
    customer_id: number;
    employee_id: number;
    message: string;
    date: string;
    senderId: number;
  }[] = await contactData.json();

  let contactsList: {
    contact_id: number;
    message: string | undefined;
    date: string | undefined;
    senderId: number | undefined;
  }[] = [];

  user.customer_list.map((customer) => {
    contactsList.push({
      contact_id: customer,
      message: undefined,
      date: undefined,
      senderId: undefined,
    });
  });

  if (contactsReceive[0] !== undefined) {
    // contactsReceive.map((contact) => ({
    //   contactsList.filter((customer) => (
    //     customer.customer_id.includes(contact.customer_id)
    //   ))[0].message = contact.message,
    //   contactsList.filter((customer) => (
    //     customer.customer_id.includes(contact.customer_id)
    //   ))[0].date = contact.date,
    //   contactsList.filter((customer) => (
    //     customer.customer_id.includes(contact.customer_id)
    //   ))[0].senderId = contact.senderId
    // }));
  }

  let personalData: {
    id: number;
    name: string;
    image: string;
  }[] = [];

  for (const contact of contactsList) {
    let contactSum: {
      id: number;
      name: string;
      image: string;
    };
    const contactData = await customFetch(
      `http://fastapi:8000/api/customers/${contact.contact_id}`,
      accessToken
    );
    const contactInfo: {
      id: number;
      email: string;
      name: string;
      surname: string;
      birthdate: string;
      gender: string;
      description: string;
      astrologicalSign: string;
      phone_number: string;
      address: string;
    } = await contactData.json();
    const imageData = await customFetch(
      `http://fastapi:8000/api/customers/${contact.contact_id}/image`,
      accessToken
    );
    const image: string = await imageData.json();

    contactSum = {
      id: contact.contact_id,
      name: contactInfo.name + " " + contactInfo.surname,
      image: image,
    };
    personalData.push(contactSum);
  }

  const contacts: {
    contact_id: number;
    message: string | undefined;
    date: string | undefined;
    senderId: number | undefined;
    name: string;
    image: string;
  }[] = contactsList.map((contact) => ({
    contact_id: contact.contact_id,
    message: contact.message,
    date: contact.date,
    senderId: contact.senderId,
    name:
      personalData.find((personal) => personal.id == contact.contact_id)
        ?.name || "Name",
    image:
      personalData.find((personal) => personal.id == contact.contact_id)
        ?.image || "Image",
  }));

  return <ChatUi contacts={contacts} accessToken={accessToken} userId={userId} role="coaches" />;
}
