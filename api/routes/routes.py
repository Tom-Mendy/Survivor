from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from crud.clothes.clothesGet import getAllClothesImgs
from fetch.fetchingEvents import fetchingAllEvents
from fetch.fetchingEncounter import getAllEncounters, getEncounterById
from fetch.fetchingTips import fetchingAllTips
from fetch.fetchingCustomer import fetchingAllCustomer, fetchingCustomerDetail
from loginTokenRetriever import loginToken
from fetch.fetchingEmployee import (getAllEmployees, getEmployeeById,
                                    getEmployeeImg)
from database.tableRelationships import Employee
from schemas.employeeSchemas import EmployeePersonalInfoSchema
from crud.customers.customerGet import getAllRealCustomers
from crud.employees.employeesGet import (getAllRealEmployees,
                                         getAnEmployeePersonalInfos,
                                         getCurrentEmployeeImg)
from schemas.customerSchemas import CustomerBasicSchema
from crud.encounters.encountersGet import getEncounterForCustomer
from schemas.encounterSchemas import EncounterByCustomerSchema
from schemas.clothesSchemas import ClothesAllSchema

from database.database import get_db


router = APIRouter()

access_token = loginToken()


class SeedState:
    def __init__(self):
        self._is_seeded = False

    def seed_database(self, db: Session):
        if not db.query(Employee).first():
            getAllEmployees(access_token, db)
            getEmployeeById(access_token, db)
            getEmployeeImg(access_token, db)
            fetchingAllCustomer(access_token, db)
            fetchingCustomerDetail(access_token, db)
            fetchingAllTips(access_token, db)
            getAllEncounters(access_token, db)
            getEncounterById(access_token, db)
            fetchingAllEvents(access_token, db)
            self._is_seeded = True
            with open("seeded.txt", "w") as f:
                f.write("Database seeded")
            return {"message": "Database seeded successfully"}
        else:
            self._is_seeded = True

    def check_seeded(self):
        if self._is_seeded is False:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database is not yet seeded, please try again later."
            )


def get_seed_state():
    return SeedState()


router.mount("/static/employees", StaticFiles(
    directory="/app/api/images/employees/"), name="employees")


router.mount("/static/clothes", StaticFiles(
    directory="/app/api/images/clothes"), name="clothes")


@router.on_event("startup")
def startup_event():
    seed_state = SeedState()
    with next(get_db()) as db:
        seed_state.seed_database(db)


@router.get("/api/encounters/customer/{customer_id}",
            response_model=list[EncounterByCustomerSchema],
            tags=["encounters"],
            )
def getEmployeesEncounter(customer_id: int, db: Session = Depends(
        get_db)) -> list[EncounterByCustomerSchema]:
    return getEncounterForCustomer(db, customer_id)


@router.get("/api/employees/", response_model=list[EmployeePersonalInfoSchema],
            tags=["employees"],
            )
def getEmployees(db: Session = Depends(get_db)) -> list[
        EmployeePersonalInfoSchema]:
    return getAllRealEmployees(db)


@router.get("/api/customers/", response_model=list[CustomerBasicSchema],
            tags=["customers"],
            )
def getCustomers(db: Session = Depends(get_db)) -> list[
        CustomerBasicSchema]:
    return getAllRealCustomers(db)


@router.get("/api/employees/{employee_id}",
            response_model=EmployeePersonalInfoSchema,
            tags=["employees"],
            )
def getAnEmployeeInfos(employee_id: int, db: Session = Depends(
        get_db)) -> EmployeePersonalInfoSchema:
    return getAnEmployeePersonalInfos(db, employee_id)


@router.get("/api/employees/{employee_id}/image",
            tags=["employees"],
            )
def getTheCurrentEmployeeImg(employee_id: int, db: Session = Depends(
        get_db)):
    return getCurrentEmployeeImg(db, employee_id)


@router.get("/api/clothes",
            tags=["clothes"], response_model=list[ClothesAllSchema])
def getClothes(db: Session = Depends(get_db)) -> list[ClothesAllSchema]:
    return getAllClothesImgs(db)
