# Generated by Django 3.2.5 on 2021-08-21 16:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_rename_growth_attraction_curr_interest'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='trip',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.trip'),
        ),
    ]
