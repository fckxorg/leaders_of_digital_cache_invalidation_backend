from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('bloger/search', views.bloger_search, name='bloger_search'),
    path('bloger/send_email', views.send_email, name='send_email'),
    path('bloger/accept', views.accept_invite, name='accept_invite'),
    path('trip/accept', views.accept_trip, name='accept_trip'),
    path('trip/get', views.get_trips, name='get_trips'),
    path('attraction/get', views.get_attractions, name='get_attractions'),
    path('trip/bloger', views.get_blogers_by_trip, name='get_blogers_by_trip'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
