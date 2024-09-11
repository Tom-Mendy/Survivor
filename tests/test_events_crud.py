from unittest.mock import MagicMock
from fastapi import HTTPException
import pytest

from api.crud.employees.employeesGet import Employee
from api.crud.events.eventsGet import Events, getListOfAllEvents
from api.schemas.eventsSchemas import EmployeeEventsSchema


def test_get_list_of_all_events_success():
    # Mock the database session
    db_mock = MagicMock()

    # Mock the events and employee
    event1 = Events(id=1, name="Event 1", date="2024-09-11", duration=2,
                    max_participants=100,
                    location_x="50", location_y="40", type="Workshop",
                    employee_id=1, location_name="Location A")
    event2 = Events(id=2, name="Event 2", date="2024-09-12", duration=3,
                    max_participants=50, location_x="60", location_y="45",
                    type="Conference", employee_id=2,
                    location_name="Location B")

    employee1 = Employee(id=1, user_id=101)
    employee2 = Employee(id=2, user_id=102)

    # Mock db.query().all() to return events
    db_mock.query.return_value.all.return_value = [event1, event2]

    # Mock db.query().filter().first() for employees
    db_mock.query.return_value.filter.return_value.first.side_effect = [employee1, employee2]

    # Call the function under test
    result = getListOfAllEvents(db=db_mock)

    # Expected output
    expected = [
        EmployeeEventsSchema(id=1, name="Event 1", date="2024-09-11",
                             duration=2, max_participants=100,
                             location_x="50", location_y="40", type="Workshop",
                             employee_id=101, location_name="Location A"),
        EmployeeEventsSchema(id=2, name="Event 2", date="2024-09-12",
                             duration=3, max_participants=50, location_x="60",
                             location_y="45", type="Conference",
                             employee_id=102, location_name="Location B")
    ]

    assert [dict(r) for r in result] == [dict(e) for e in expected]


def test_get_list_of_all_events_no_events():
    db_mock = MagicMock()

    db_mock.query.return_value.all.return_value = []

    with pytest.raises(HTTPException) as exc_info:
        getListOfAllEvents(db=db_mock)

    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "No events found"
