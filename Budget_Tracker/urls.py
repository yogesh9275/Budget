"""
URL configuration for Budget_Tracker project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from Save_Money import views
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponseNotFound
urlpatterns = [
    path('', views.home, name='home'),
    path('Expense/',views.manage_expenses ,name='Expense'),
    path('get_expenses/',views.get_expenses_by_month ,name='get_Expense'),
    path('delete_expense/',views.delete_expense ,name='delete_Expense'),
    path('register/',views.Register, name='register'),
    path('login/',views.login, name='login'),
    path('admin/', admin.site.urls),
    path('favicon.ico', lambda request: HttpResponseNotFound())
]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
