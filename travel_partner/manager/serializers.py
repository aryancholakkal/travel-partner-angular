from rest_framework import serializers
from travel_app.models import Manager, Employee, Admin, TicketDetails


class TicketDetail_for_manager(serializers.ModelSerializer):
    employee_username = serializers.CharField(source='employee.username', read_only=True)
    class Meta:
        model = TicketDetails
        fields = ['id','employee_id', 'employee_username', 'manager_id', 'from_location', 'to_location', 'start_date', 'end_date', 'purpose_of_travel', 
                  'manager_ticket_status', 'additional_request_admin', 'additional_request_manager','additional_note_employee']
