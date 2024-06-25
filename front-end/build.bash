#!/bin/bash
ng build
sudo rm -r /var/www/html/*
sudo cp -r /dist/imagej-angular/. /var/www/html/