from fastapi import Request
import jwt
from sqlalchemy.orm import Session
from sqlalchemy import desc

from schemas.chatSchemas import ChatDataSchema
from database.tableRelationships import Chat, Customer, Employee, User


def getChatData(req: Request, db: Session):
    finalReturn = []
    newHeader = req.headers.get("authorization")
    email = None
    user = None
    customer = None
    employee = None
    if newHeader:
        newHeader = newHeader.split(" ")[1]
        decoded = jwt.decode(newHeader, options={"verify_signature": False})
        email = decoded["sub"]
    listOfId = []
    if email is not None:
        user = db.query(User).filter(
            User.email == email).first()
    if user is not None:
        employee = db.query(Employee).filter(
            Employee.user_id == user.id).first()
        customer = db.query(Customer).filter(
            Customer.user_id == user.id).first()
    if employee is not None:
        chatOfEmployee = db.query(Chat).filter(
            Chat.employee_id == employee.id).order_by(desc(Chat.date)).all()
        for chat in chatOfEmployee:
            print(chat.customer_id)
            if chat.customer_id not in listOfId:
                customer = db.query(Customer).filter(
                    Customer.id == chat.customer_id).first()
                finalReturn.append(ChatDataSchema(
                    id=employee.user_id,
                    idOfOtherPerson=customer.user_id,
                    lastMessage=chat.message,
                    dateOfLastMessage=chat.date,
                    senderOfLastMessage=chat.senderId
                ))
                listOfId.append(chat.customer_id)
        return finalReturn
    if customer is not None:
        chatOfCustomer = db.query(Chat).filter(
            Chat.customer_id == customer.id).order_by(desc(Chat.date)).all()
        for chat in chatOfCustomer:
            if chat.employee_id not in listOfId:
                employee = db.query(Employee).filter(
                    Employee.id == chat.employee_id).first()
                finalReturn.append(ChatDataSchema(
                    id=customer.user_id,
                    idOfOtherPerson=employee.user_id,
                    lastMessage=chat.message,
                    dateOfLastMessage=chat.date,
                    senderOfLastMessage=chat.senderId
                ))
                listOfId.append(chat.employee_id)

    return finalReturn