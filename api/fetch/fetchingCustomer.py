import os
from concurrent.futures import ThreadPoolExecutor

import requests
from database.database import engine
from database.tableRelationships import (Clothes, Customer, PayementHistory,
                                         User)
from dotenv import load_dotenv
from loginTokenRetriever import loginToken
from passwordOperations import getPasswordHash
from sqlalchemy.orm import sessionmaker

load_dotenv()

TOKEN_API = os.getenv("TOKEN_API")
AUTH_EMAIL = os.getenv("AUTH_EMAIL")
AUTH_PASSWORD = os.getenv("AUTH_PASSWORD")
CUSTOMER_PASSWORD = os.getenv("FAKE_CUSTOMER_PASSWORD")

SessionFactory = sessionmaker(bind=engine)


def fetchingAllCustomer(access_token, database):
    url = 'https://soul-connection.fr/api/customers'

    headers = {
        'accept': 'application/json',
        'X-Group-Authorization': TOKEN_API,
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token["access_token"],
    }

    response = {}
    try:
        response = requests.get(url, json=None, headers=headers)
    except BaseException:
        access_token = loginToken()
        fetchingAllCustomer(access_token, database)

    if response.status_code == 401:
        access_token = loginToken()
        fetchingAllCustomer(access_token)

    customers_data = response.json()

    for customer_data in customers_data:
        user = User(
            password=getPasswordHash(CUSTOMER_PASSWORD),
            email=customer_data.get('email'),
            name=customer_data.get('name'),
            surname=customer_data.get('surname')
        )

        database.add(user)
        database.flush()

        customer = Customer(
            user_id=user.id
        )
        database.add(customer)
    database.commit()
    return {"message": "All customers have been fetched"}


def fetchCustomerDetailThread(customerId, headers, access_token):
    session = SessionFactory()

    try:
        url = f'https://soul-connection.fr/api/customers/{customerId.user_id}'
        getCustomerDetail(url, headers, customerId, session)

        if getCustomerImage(access_token, customerId, headers, session) != 200:
            getCustomerImage(access_token, customerId, headers, session)

        if getCustomerPaymentHistory(customerId, headers, session) != 200:
            getCustomerPaymentHistory(customerId, headers, session)

        if getClothesImage(customerId, session, headers) != 200:
            getClothesImage(customerId, session, headers)

        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error in thread for customer {customerId.id}: {e}")
    finally:
        session.close()


def fetchingCustomerDetail(access_token, database):
    headers = {
        'accept': 'application/json',
        'X-Group-Authorization': TOKEN_API,
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token["access_token"],
    }

    with ThreadPoolExecutor(
            max_workers=max(1, os.cpu_count() - 4)) as executor:
        futures = [
            executor.submit(fetchCustomerDetailThread, customerId,
                            headers, access_token)
            for customerId in database.query(Customer).all()
        ]

        for future in futures:
            try:
                future.result()
            except Exception as e:
                print(f"Error in thread: {e}")

    return {"message": "All customers have been fetched"}


def getCustomerDetail(url, headers, customerId, database):
    response = {}
    try:
        response = requests.get(url, headers=headers)
    except BaseException:
        getCustomerDetail(url, headers, customerId, database)

    if response.status_code == 401:
        # access_token = loginToken()
        getCustomerDetail(url, headers, customerId, database)
    if response.status_code != 200:
        getCustomerDetail(url, headers, customerId, database)
    customer_data = {}
    try:
        customer_data = response.json()
    except BaseException:
        # acccess_token = loginToken()
        # getCustomerDetail(url, headers, customerId, database)
        pass

    user = database.query(User).filter(
        User.id == customerId.user_id).first()
    user.email = customer_data.get('email')
    user.name = customer_data.get('name')
    user.surname = customer_data.get('surname')
    user.birthdate = customer_data.get('birth_date')
    user.gender = customer_data.get('gender')
    customer = database.query(Customer).filter(
        Customer.user_id == customerId.user_id).first()
    customer.description = customer_data.get('description')
    customer.astrologicalSign = customer_data.get('astrological_sign')
    customer.phone_number = customer_data.get('phone_number')
    customer.address = customer_data.get('address')


def getCustomerImage(access_token, customerId, headers, database):
    customer = database.query(Customer).filter(
        Customer.user_id == customerId.user_id).first()
    image_url = f'https://soul-connection.fr/api/customers/{
            customer.user_id}/image'
    try:
        image_response = requests.get(image_url, headers=headers)
    except Exception as e:
        print(f"Error fetching image: {e}")
        getCustomerImage(access_token, customerId, headers, database)

    if image_response.status_code == 401:
        access_token = loginToken()
        getCustomerImage(access_token, customerId, headers, database)

    if image_response.status_code == 200:
        currentUser = database.query(User).filter(
            User.id == customer.user_id).first()
        currentUser.img_profil_content = image_response.content
    else:
        print(f"Failed to retrieve image. Status code: {image_response.status_code}")
        return image_response.status_code


def getCustomerPaymentHistory(customerId, headers, database):
    customer = database.query(Customer).filter(
        Customer.user_id == customerId.user_id).first()
    payement_history_url = f'https://soul-connection.fr/api/customers/{customer.user_id}/payments_history'
    payement_history_response = {}
    try:
        payement_history_response = requests.get(
            payement_history_url, headers=headers)
    except BaseException:
        getCustomerPaymentHistory(customerId, headers, database)
    if payement_history_response.status_code == 401:
        getCustomerPaymentHistory(customerId, headers, database)
    payement_history_datas = {}
    try:
        payement_history_datas = payement_history_response.json()
    except BaseException:
        # access_token = loginToken()
        # getCustomerPaymentHistory(customerId, headers, database)
        return payement_history_response.status_code
    if database.query(PayementHistory).filter(
            PayementHistory.customer_id == customer.id).first():
        database.query(PayementHistory).filter(
            PayementHistory.customer_id == customer.id).delete()
    for payment_history_date in payement_history_datas:
        payement_history = PayementHistory(
            customer_id=customer.id,
            id=payment_history_date.get('id'),
            date=payment_history_date.get('date'),
            amount=payment_history_date.get('amount'),
            comment=payment_history_date.get('comment'),
            payment_method=payment_history_date.get('payment_method')
        )
        if not database.query(PayementHistory).filter(
                PayementHistory.id == payement_history.id).first():
            database.add(payement_history)
        else:
            currentPayementHistory = database.query(PayementHistory).filter(
                PayementHistory.id == payement_history.id)
            currentPayementHistory.date = payement_history.date
            currentPayementHistory.amount = payement_history.amount
            currentPayementHistory.comment = payement_history.comment
            currentPayementHistory.payment_method = payement_history.payment_method
    return payement_history_response.status_code


def getClothesImage(customerId, database, headers):
    clothes_data = {}
    clothe_image_response = ""
    clothes_response = ""
    customer = database.query(Customer).filter(
        Customer.user_id == customerId.user_id).first()
    clothes_url = f'https://soul-connection.fr/api/customers/{
        customer.user_id}/clothes'
    try:
        clothes_response = requests.get(clothes_url, headers=headers)
    except BaseException:
        getClothesImage(customerId, database, headers)

    clothes_datas = {}
    if clothes_response.status_code == 401:
        access_token = loginToken()
        getClothesImage(customer, database, headers)
    try:
        clothes_datas = clothes_response.json()
    except BaseException:
        pass
    for clothes_data in clothes_datas:
        clothe_image_url = f'https://soul-connection.fr/api/clothes/{
            clothes_data.get("id")}/image'
        try:
            clothe_image_response = requests.get(clothe_image_url,
                                                 headers=headers)
        except BaseException:
            getClothesImage(customerId, database, headers)
        if not (isinstance(clothe_image_response, requests.models.Response)):
            pass
        if clothe_image_response.status_code == 401:
            access_token = loginToken()
            getClothesImage(customerId, database, headers)

        specificClothes = Clothes(
            customer_id=customer.id,
            id=clothes_data.get('id'),
            type=clothes_data.get('type'),
            img_content=clothe_image_response.content
        )
        if not database.query(Clothes).filter(
                Clothes.id == clothes_data.get('id')).first():
            database.add(specificClothes)
        else:
            currentClothe = database.query(Clothes).filter(
                Clothes.id == specificClothes.id)
            currentClothe.customer_id = specificClothes.customer_id
            currentClothe.type = specificClothes.type
            currentClothe.img_content = specificClothes.img_content
    return clothe_image_response.status_code
