from django.http import HttpResponse
from django.http.response import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

import json
from email.message import EmailMessage
import smtplib
from string import Template

def index(request):
    return render(request, 'index.html')

@csrf_exempt
def bloger_search(request):
    data = json.loads(request.body.decode('utf-8'))
    # data will be processed here later on
    print(data) 
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
                    "payment": "100",
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
                    "payment": "50",
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
        email = bloger['email']
        message = EmailMessage()
        message.set_content(Template(letter).substitute(name=bloger['name'], trip=bloger['trip'], date_start=bloger['date_start'], date_end=bloger['date_end']))

        message['Subject'] = 'Поездка в Самару'
        message['From'] = sender_email
        message['To'] = email
        
        print('Sending message to ' + email + '...\t', end='')
        server.send_message(message)
        print('sent')

    server.close()
    return HttpResponse(200)
