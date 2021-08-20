from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('bloger/search', views.bloger_search, name='bloger_search'),
    path('bloger/send_email', views.send_email, name='send_email'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
