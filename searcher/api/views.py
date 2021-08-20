from django.http import HttpResponse
from django.http.response import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

import json

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

