from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from rest_framework.permissions import AllowAny
from travel_app.models import TicketDetails
from .serializers import TicketDetail_for_employee
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
import json
from .permissions import *
from datetime import datetime
import logging
from travel_app.models import Employee

logger = logging.getLogger(__name__)

# employee
@api_view(['GET', 'POST', 'PATCH', 'DELETE', 'PUT'])
@permission_classes([IsEmployee])
def manage_employee_tickets(request, ticket_id=None):
    """
    Manage employee tickets with GET, POST, PATCH, and DELETE methods.
    Handles ticket creation, update, retrieval, and deletion.
    """
    if request.method == 'GET':
        try:
            leave_requests = TicketDetails.objects.filter(employee_id=request.user.employee.id, employee_cancel_status = False)
            serializer = TicketDetail_for_employee(leave_requests, many=True)
            return Response(serializer.data, status=HTTP_200_OK)
        except TicketDetails.DoesNotExist:
            logger.error("No tickets found for employee ID %s", request.user.employee.id)
            return Response({"error": "No tickets found"}, status=HTTP_404_NOT_FOUND)
    elif request.method == 'POST':
        try:
            data = request.data
            employee = request.user.employee
            manager_id = employee.manager_id
            
            new_ticket = TicketDetails.objects.create(
                employee_id=employee.id,
                manager_id=manager_id,
                date_of_request=datetime.today().strftime('%Y-%m-%d'),
                from_location=data.get("from_location"),
                to_location=data.get("to_location"),
                start_date=data.get("start_date"),
                end_date=data.get("end_date"),
                manager_ticket_status=data.get("manager_ticket_status", "Not Responded"),
                admin_ticket_status=data.get("admin_ticket_status", "Not Responded"),
                preferred_travel_mode=data.get("preferred_travel_mode", "Bus"),
                is_lodging_req=data.get("is_lodging_req", False),
                purpose_of_travel=data.get("purpose_of_travel"),
                additional_note_employee=data.get("additional_note_employee", ""),
                additional_request_admin=data.get("additional_request_admin", ""),
                additional_request_manager=data.get("additional_request_manager", ""),
                no_of_submission=data.get("no_of_submission", 1),
            )
            logger.info("Ticket created successfully for employee ID %s", employee.id)
            return Response(
                {"status": "success", "message": "Ticket created successfully", "ticket_id": new_ticket.id},
                status=HTTP_201_CREATED
            )
        except Exception as e:
            logger.error("Failed to create ticket for employee ID %s: %s", request.user.employee.id, str(e))
            return Response({"status": "failed", "message": str(e)}, status=HTTP_400_BAD_REQUEST)
    elif request.method == 'PATCH':
        try:
            data = request.data
            ticket_id = ticket_id or data.get("ticket_id")
            print("========================")
            print("Ticket Id : ", ticket_id)
            print("========================")
            if not ticket_id:
                logger.error("Ticket ID is required for updating ticket")
                return Response({"status": "failed", "message": "Ticket ID is required"}, status=HTTP_400_BAD_REQUEST)
            
            try:
                ticket = TicketDetails.objects.get(id=ticket_id, employee_id=request.user.employee.id)
                # print("========================")
                # print("Ticket Details : ", ticket.manager_id)
                # print("========================")
            except TicketDetails.DoesNotExist:
                logger.error("Ticket not found for ticket ID %s and employee ID %s", ticket_id, request.user.employee.id)
                return Response({"status": "failed", "message": "Ticket not found"}, status=HTTP_404_NOT_FOUND)
            ticket.manager_id = data.get("manager_id", ticket.manager_id)
            ticket.date_of_request = data.get("date_of_request", ticket.date_of_request)
            ticket.from_location = data.get("from_location", ticket.from_location)
            ticket.to_location = data.get("to_location", ticket.to_location)
            ticket.start_date = data.get("start_date", ticket.start_date)
            ticket.end_date = data.get("end_date", ticket.end_date)
            ticket.preferred_travel_mode = data.get("preferred_travel_mode", ticket.preferred_travel_mode)
            ticket.is_lodging_req = data.get("is_lodging_req", ticket.is_lodging_req)
            ticket.purpose_of_travel = data.get("purpose_of_travel", ticket.purpose_of_travel)
            ticket.additional_note_employee = data.get("additional_note_employee", ticket.additional_note_employee)
            print(ticket.from_location)
            ticket.no_of_submission = ticket.no_of_submission + 1
            
            ticket.save()
            
            logger.info("Ticket updated successfully for ticket ID %s and employee ID %s", ticket.id, request.user.employee.id)
            return Response(
                {"status": "success", "message": "Ticket updated successfully", "ticket_id": ticket.id},
                status=HTTP_200_OK
            )
        except Exception as e:
            logger.error("Failed to update ticket for ticket ID %s and employee ID %s: %s", ticket_id, request.user.employee.id, str(e))
            return Response({"status": "failed", "message": str(e)}, status=HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        if not ticket_id:
            logger.error("Ticket ID is required for deleting ticket")
            return Response({"status": "failed", "message": "Ticket ID is required"}, status=HTTP_400_BAD_REQUEST)
        
        try:
            ticket = get_object_or_404(TicketDetails, id=ticket_id, employee_id=request.user.employee.id)
            
            if ticket.manager_ticket_status == "Not Responded" and ticket.admin_ticket_status == "Not Responded":
                ticket.delete()
                logger.info("Ticket deleted successfully for ticket ID %s and employee ID %s", ticket_id, request.user.employee.id)
                return Response(
                    {"status": "success", "message": "Ticket deleted successfully"},
                    status=HTTP_200_OK
                )
            else:
                logger.error("Ticket cannot be deleted as it has been responded to for ticket ID %s and employee ID %s", ticket_id, request.user.employee.id)
                return Response(
                    {"status": "failed", "message": "Ticket cannot be deleted as it has been responded to"},
                    status=HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            logger.error("Failed to delete ticket for ticket ID %s and employee ID %s: %s", ticket_id, request.user.employee.id, str(e))
            return Response({"status": "failed", "message": str(e)}, status=HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        """
        Allows employees to cancel a travel request if:
        - The request is not already approved or rejected.
        - The request is eligible for cancellation.

        Args:
            request (HttpRequest): The request object from the authenticated employee.
            request_id (int): The ID of the travel request to be cancelled.

        Returns:
            Response (JSON): A message confirming the cancellation or an error message.
                - HTTP 200: Request cancelled successfully.
                - HTTP 400: Request cannot be cancelled (already approved/rejected).
                - HTTP 404: Travel request not found.
        """
        try:
            travel_request = TicketDetails.objects.get(id=ticket_id)
        except TicketDetails.DoesNotExist:
            return Response({"error": "Request not found.","status":"failed"}, status=HTTP_404_NOT_FOUND)
        
        # Check if travel date is in the past
        # if travel_request.start_date > date.today():
        #     return Response({"error": "Only past requests can be cancelled."}, status=HTTP_400_BAD_REQUEST)
        # Check if the request is already approved/rejected

        # Cancel the request
        if travel_request   .manager_ticket_status in ["Approved","Request Edit", "Not Responded"]:
            travel_request.employee_cancel_status = True
            travel_request.save()
        else:
            return Response ({"error": "Not allowed"}, status=HTTP_400_BAD_REQUEST)
    
        return Response({"message": "Request has been cancelled successfully.","status":"Successfully deleted"}, status=HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def employee_login(request):
    """
    Authenticate an employee and return a token if credentials are valid.
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        user = authenticate(username=data['username'], password=data['password'])
        if user is not None and hasattr(user,'employee'):
            employee = Employee.objects.get(user=user)
            manager = employee.manager.username if employee.manager else None 
            token, created = Token.objects.get_or_create(user=user)
            logger.info("Employee login successful for username %s", data['username'])
            return JsonResponse({'status': 'success', 'token': token.key, 'manager_username':manager})
        logger.error("Invalid credentials for username %s", data['username'])
        return JsonResponse({'status': 'failed', 'message': 'Invalid credentials'}, status=401)
    logger.error("Invalid request method for employee login")
    return JsonResponse({'status': 'failed', 'message': 'Invalid request method'}, status=400)


@csrf_exempt
@api_view(["GET"])
@permission_classes([IsEmployee])
def filter_dash(request):
    """
    Filter dashboard records based on date, place, and status.
    """
    if request.method == "GET":
        start_date = request.GET.get("startDate")
        print(start_date)
        end_date = request.GET.get("endDate")
        print(end_date)
        place = request.GET.get("place")
        print(place)
        status = request.GET.get("status")
        print(status)
        records = TicketDetails.objects.filter(employee_id=request.user.employee.id) 
        
        if start_date:
            records = records.filter(start_date__gte=start_date)
            print("start-date",start_date)
        if end_date:
            records = records.filter(start_date__lte=end_date)
            print("end-date", end_date)
        if place:
            records = records.filter(to_location__icontains=place)
            print("place",place)
        if status:
            records = records.filter(manager_ticket_status =status)         
        serializer = TicketDetail_for_employee(records, many=True)
        return Response(serializer.data, status=HTTP_200_OK) 
    return JsonResponse({"error": "Invalid request"}, status=400)


