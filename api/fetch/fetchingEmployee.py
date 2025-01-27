import os
from concurrent.futures import ThreadPoolExecutor
from random import choice

import requests
from database.tableRelationships import (Customer, Employee, EmployeeCustomer,
                                         User)
from dotenv import load_dotenv
from fetch.fetchingCustomer import SessionFactory
from loginTokenRetriever import loginToken
from passwordOperations import getPasswordHash
from sqlalchemy.orm import Session

load_dotenv()


TOKEN_API = os.getenv("TOKEN_API")
EMPLOYEE_PASSWORD = os.getenv("FAKE_EMPLOYEE_PASSWORD")


def getAllEmployees(access_token, db):
    url = 'https://soul-connection.fr/api/employees'

    headers = {
        'accept': 'application/json',
        'X-Group-Authorization': TOKEN_API,
        'Authorization': 'Bearer ' + access_token["access_token"],
    }
    response = {}
    try:
        response = requests.get(url, json=None, headers=headers)
    except BaseException:
        access_token = loginToken()
        getAllEmployees(access_token, db)

    if response.status_code == 401:
        access_token = loginToken()
        getAllEmployees(access_token, db)

    employeesData = response.json()

    for employee in employeesData:
        actualId = (employee.get('id')) + db.query(Customer).count()
        user = User(
            id=actualId,
            password=getPasswordHash(EMPLOYEE_PASSWORD),
            email=employee.get('email'),
            name=employee.get('name'),
            surname=employee.get('surname')
        )
        db.add(user)
        db.flush()

        employee = Employee(
            user_id=user.id,
        )
        db.add(employee)
    db.commit()


def fetchEmployeeDetail(employee, access_token, db):
    session = SessionFactory()

    headers = {
        'accept': 'application/json',
        'X-Group-Authorization': TOKEN_API,
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token["access_token"],
    }

    actualEmployeeId = (employee.user_id) - db.query(Customer).count()

    try:
        url = f'https://soul-connection.fr/api/employees/{actualEmployeeId}'
        response = requests.get(url, headers=headers)
        if response.status_code == 401:
            access_token = loginToken()
            return fetchEmployeeDetail(employee, access_token)

        employee_data = response.json()

        actualEmployee = session.query(Employee).filter(
            Employee.user_id == employee.user_id).first()
        if actualEmployee:
            user = db.query(User).filter(
                User.id == employee.user_id).first()
            user.email = employee_data.get('email')
            user.name = employee_data.get('name')
            user.surname = employee_data.get('surname')
            user.birthdate = employee_data.get('birth_date')
            user.gender = employee_data.get('gender')
            actualEmployee.work = employee_data.get("work")

        image_url = f'https://soul-connection.fr/api/employees/{actualEmployeeId}/image'
        image_response = requests.get(image_url, headers=headers)
        if image_response.status_code == 200:
            user.img_profil_content = image_response.content
        elif image_response.status_code == 401:
            access_token = loginToken()
            return fetchEmployeeDetail(employee, access_token)
        else:
            print(f"Failed to retrieve image for employee {employee.user_id}. Status code: {image_response.status_code}")

        session.commit()
    except Exception as e:
        print(f"Error fetching or updating employee {employee.user_id}: {e}")
        session.rollback()
    finally:
        session.close()


def getEmployeeDetail(access_token, db):
    employees = db.query(Employee).all()

    with ThreadPoolExecutor(max_workers=max(1, os.cpu_count() - 4)) as executor:
        futures = [
            executor.submit(fetchEmployeeDetail, employee, access_token, db)
            for employee in employees
        ]

        for future in futures:
            try:
                future.result()
            except Exception as e:
                print(f"Error in thread: {e}")

    return {"message": "All employee details fetched and updated successfully"}


def fillingEmployeeCustomerTable(db: Session):
    allEmployees = db.query(Employee).all()
    allCustomers = db.query(Customer).all()

    listOfAllEmployeesId = []

    for employeeId in allEmployees:
        listOfAllEmployeesId.append(employeeId.id)

    for customer in allCustomers:
        relation = EmployeeCustomer(
            employee_id=choice(listOfAllEmployeesId),
            customer_id=customer.id
        )
        db.add(relation)
    db.commit()
