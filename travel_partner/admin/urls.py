from django.urls import path
from . import views

urlpatterns = [    
    path('login/', views.admin_login),
    path('dashboard/', views.view_dashboard_admin),
    path('manage-manager/', views.manage_managers),
    path('manage-employee/', views.manage_employees),   
    path('close-ticket/', views.close_ticket),
    path('approve-ticket/', views.approve_ticket_admin),    
    path('filter/', views.filter_dash),
    path('request_edit/<int:ticket_id>/', views.request_edit,),
    # path('add_admin/', views.add_admin),
]