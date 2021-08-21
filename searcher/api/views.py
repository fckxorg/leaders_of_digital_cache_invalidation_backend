from django.http import HttpResponse
from django.http.response import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .models import Bloger, Trip, Attraction, Post

from datetime import datetime
import json
from email.message import EmailMessage
import smtplib
from string import Template

from .analytics import filters as f 
from .analytics import sentiment_analysis as sa
from .analytics import datetime_analysis as da 

def index(request):
    return render(request, 'index.html')

def accept_invite(request):
    return render(request, 'accept.html')

@csrf_exempt
def accept_trip(request):
    data = json.loads(request.body.decode('utf-8'))
    bloger = Bloger.objects.get(name=data['name'])
    trip = Trip.objects.get(name=data['trip'])

    bloger.refused = False
    trip.blogers.add(bloger) 
    
    bloger.save()
    trip.save()

    return HttpResponse(200)

def post_form(request):
    return render(request, 'material.html')

@csrf_exempt
def send_posts(request):
    data = json.loads(request.body.decode('utf-8'))

    bloger = Bloger.objects.get(name=data['name'])
    trip = Trip.objects.get(name=data['trip'])
    links = data["links"].split('\n')
    
    for link in links:
        post_data = sa.pull_post_data(link)
        new_post = Post(
                link=link, 
                description=post_data['text'],
                date=post_data['taken_at'],
                likes=post_data['likes'],
                views=post_data['views'],
                comm_positive=post_data['user_reaction']['positive'],
                comm_neutral=post_data['user_reaction']['neutral'],
                comm_negative=post_data['user_reaction']['negative'],
                bloger=bloger,
                trip=trip
                ) 
        new_post.save()

    return HttpResponse(200)

# TODO integrate with scarper and analytics
@csrf_exempt
def bloger_search(request):
    data = json.loads(request.body.decode('utf-8'))
    users = []
   # f.filter_users(data, users)
    # data will be processed here later on
    #TODO save blogers into database
    # mock response
    return JsonResponse (
        {
            "blogers" : 
            [
                {
                    "name": "boristab",
                    "email": "boristab23@gmail.com",
                    "phone": None,
                    "link": "https://instagram.com/boristab",
                    "avg_likes": "30",
                    "avg_view": None,
                    "subs": 150,
                    "network": "instagram",
                    "photo": "https://sun9-45.userapi.com/impg/fIqPDdxMV-eMN0Kiw19XtU33RpspNbcu2RSBjg/rNuT4rolW9o.jpg?size=1620x2160&quality=96&sign=5e7dc0050f8a7aded4a53a91e7a66948&type=album",
                    "welness": "0.99"
                },
                {
                    "name": "fckxorg",
                    "email": "max.kokryashkin@gmail.com",
                    "phone": "+79859517358",
                    "link": "https://instagram.com/fckxorg",
                    "avg_likes": "80",
                    "avg_view": 10000,
                    "subs": 200,
                    "network": "youtube",
                    "photo": "https://sun9-80.userapi.com/impg/uV_xX0PkqE6v6dOIRTs-rFLh01Z0xInSjCHkDA/YQoZJxydmZY.jpg?size=1620x2160&quality=96&sign=0c234234dc22b2c64c17857e4a6d3293&type=album",
                    "welness": "0.70"
                }
            ]
        }
    )

@csrf_exempt
def send_email(request):
    data = json.loads(request.body.decode('utf-8'))

    sender_password = None
    sender_email = None
    
    with open('creds', 'r') as creds:
        sender_email = creds.readline()
        sender_password = creds.readline()
    print(sender_email)

    letter = data['template']

    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.ehlo()
    server.login(sender_email, sender_password)

    for bloger in data['blogers']:
        print(bloger['name'])
        recipient = Bloger.objects.get(name=bloger['name'])
        recipient.refused = True
        recipient.refuse_date = datetime.today()
        recipient.save()

        message = EmailMessage()
        message.set_content(Template(letter).substitute(name=bloger['name']))

        message['Subject'] = data['subject']
        message['From'] = sender_email
        message['To'] = recipient.email
        
        print('Sending message to ' + recipient.email + '...\t', end='')
        server.send_message(message)
        print('sent')

    server.close()
    return HttpResponse(200)

# TODO integrate with analytics module
def get_attractions(request):
    attractions = Attraction.objects.all()
    
    for attraction in attractions:
        nearby = da.get_geoposition_instagram_posts(attraction.lat, attraction.lng, 30)
        counter = da.calculate_daily_stats(nearby)
        attraction.base_interest = 0
        attraction.curr_interest = counter[datetime.today().replace(hour=0, minute=0, second=0, microsecond=0)]
        attraction.save()

    response = {'attractions' : [attraction.serialize() for attraction in attractions]}
    return JsonResponse(response)

def get_trips(request):
    trips = list(Trip.objects.all())
    response = {'trips' : [trip.serialize() for trip in trips]}
    return JsonResponse(response)

@csrf_exempt
def get_blogers_by_trip(request):
    data = json.loads(request.body.decode('utf-8'))
    trip = Trip.objects.get(name=data['name'])
    blogers = list(trip.blogers.all())
    response = {'blogers' : []}
    
    for bloger in blogers:
        response['blogers'].append({
            'name': bloger.name,
            'photo' : bloger.photo,
            'link' : bloger.link,
            'welness' : bloger.wellness
        })
    
    return JsonResponse(response)

@csrf_exempt
def get_post_by_trip_bloger(request): 
    data = json.loads(request.body.decode('utf-8'))

    trip = Trip.objects.get(name=data['trip'])
    bloger = Bloger.objects.get(name=data['name'])

    posts = Post.objects.filter(bloger=bloger, trip=trip)

    response = {'posts' : [post.serialize() for post in posts]}
    return JsonResponse(response)

