from django.db import models

class Bloger(models.Model):
    name = models.CharField(max_length=200)
    email = models.CharField(max_length=200, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    link = models.CharField(max_length=2048) # Max length of an URL
    photo = models.CharField(max_length=2048) # Link to the photo

    avg_likes = models.IntegerField()
    avg_views = models.IntegerField(blank=True, null=True)
    subs = models.IntegerField()
    network = models.CharField(max_length=20)
    wellness = models.FloatField()

    refused = models.BooleanField()
    refuse_date = models.DateField()

    def __str__(self):
        return self.name


class Trip(models.Model):
    blogers = models.ManyToManyField(Bloger, blank=True)
    
    date_start = models.DateField()
    date_end = models.DateField()

    name = models.CharField(max_length=200)
    description = models.CharField(max_length=2048)

    def __str__(self):
        return self.name

    def serialize(self):
        return {
            "name": self.name,
            "description": self.description,
            "date_start" : self.date_start,
            "date_end" : self.date_end
        }

class Post(models.Model):
    link = models.CharField(max_length=2048)
    description = models.CharField(max_length=512)
    date = models.DateField()

    likes = models.IntegerField()
    views = models.IntegerField(blank=True, null=True)

    comm_positive = models.FloatField()
    comm_neutral = models.FloatField()
    comm_negative = models.FloatField()

    bloger = models.ForeignKey(Bloger, on_delete=models.CASCADE)
    trip = models.OneToOneField(Trip, on_delete=models.CASCADE)

    def __str__(self):
        return self.description

class Attraction(models.Model):
    lat = models.FloatField()
    lng = models.FloatField()

    name = models.CharField(max_length=200)
    photo = models.CharField(max_length=2048)

    curr_interest = models.IntegerField()
    base_interest = models.IntegerField()

    def __str__(self):
        return self.name

    def serialize(self):
        return {
            'lat': self.lat, 
            'lng': self.lng, 
            'name' : self.name, 
            'photo' : self.photo, 
            'curr_interest' : self.curr_interest, 
            'base_interest' : self.base_interest
        }

