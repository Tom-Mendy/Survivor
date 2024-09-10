import base64
import random
from fastapi import HTTPException
from sqlalchemy.orm import Session

from schemas.employeeSchemas import EmployeePersonalInfoSchema
from database.tableRelationships import Customer, Employee, EmployeeCustomer


def getAllRealEmployees(db: Session):
    employees = db.query(Employee).all()
    listOfAllEmployees = []

    for employee in employees:
        listOfAllEmployees.append(
            {
                "id": employee.id,
                "name": employee.name,
                "surname": employee.surname,
                "email": employee.email,
                "birthdate": employee.birthdate,
                "gender": employee.gender,
                "work": employee.work,
                "customer_list": []
            }
        )
    return listOfAllEmployees


def getAnEmployeePersonalInfos(db: Session, employee_id: int):
    actualEmployee = db.query(Employee).filter(
        Employee.id == employee_id).first()
    relationEmployeeCustomers = db.query(EmployeeCustomer).filter(
        EmployeeCustomer.employee_id == employee_id).all()
    employeeInfos = EmployeePersonalInfoSchema(
        id=actualEmployee.id,
        email=actualEmployee.email,
        name=actualEmployee.name,
        surname=actualEmployee.surname,
        birthdate=actualEmployee.birthdate,
        gender=actualEmployee.gender,
        work=actualEmployee.work,
        customer_list=[relation.customer_id for relation in relationEmployeeCustomers if relation.employee_id == employee_id]
    )
    return employeeInfos


def getCurrentEmployeeImg(db: Session, employee_id: int):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return base64.b64encode(employee.img_profil_content).decode("utf-8")


def getListOfCustomerForEmployee(db: Session, employee_id: int):
    # actualEmployee = db.query(Employee).filter(
        # Employee.id == employee_id).first()
    allCustomers = db.query(Customer).all()
    listOfCustomers = []
    listOfAllCustomersId = []

    for customerId in allCustomers:
        listOfAllCustomersId.append(customerId.id)

    for i in range(random.randint(3, 15)):
        listOfCustomers.append(random.choice(listOfAllCustomersId))
    return listOfCustomers
