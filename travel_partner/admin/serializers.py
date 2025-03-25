from rest_framework import serializers
from travel_app.models import Manager, Employee, Admin, TicketDetails



class TicketDetail_for_admin(serializers.ModelSerializer):
    manager_username = serializers.CharField(source='manager.username', read_only=True)
    employee_username = serializers.CharField(source='employee.username', read_only=True)
    class Meta:
        model = TicketDetails
        fields = ['id','employee_id', 'manager_username','employee_username','manager_id', 'from_location', 'to_location', 'start_date', 'end_date',
                  'additional_note_employee', 'purpose_of_travel', 'manager_ticket_status']

class manager_list_serializer(serializers.ModelSerializer):
    class Meta:
        model = Manager
        fields = ['username', 'id', 'email']

class Employee_list_serializer(serializers.ModelSerializer): 
    manager_username = serializers.CharField(source='manager.username', read_only=True)
    class Meta:
        model = Employee
        fields = ['username', 'id', 'manager_username', 'email']