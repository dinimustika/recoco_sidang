from flask import Flask, request, render_template, session, jsonify, Response
from flask_session import Session
import re
from models import *
from flask_paginate import Pagination, get_page_args
from datetime import datetime, timedelta
import mysql.connector
import os
import folium
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route('/')
def index():
    return None

@app.route('/getHotelList', methods=['POST','GET'])
def getHotelList():
    if request.method == "POST":
        location = request.form.get("location")
        checkin = request.form.get("checkin")
        checkout = request.form.get("checkout")
        guests = request.form.get("guests")
        rooms = request.form.get("rooms")
        preferensi = request.form.get("preferensi")
        
        dataHotels = getHotels(entityID=location, checkin=checkin, checkout=checkout, guests=guests, room=rooms)
        
        hotels = pd.DataFrame(dataHotels['data']['hotels'])
        coordinates = pd.DataFrame(dataHotels['data']['hotelsCoordinates'])
        
        dataDetailDFs = pd.DataFrame()

        for i in range(len(hotels)):
            detailTemp = getDetail(hotels['hotelId'][i], location)
            detailTemp['data']['hotelId'] = hotels['hotelId'][i]
            dataDetailDFs = pd.concat([dataDetailDFs, pd.DataFrame([detailTemp['data']])], ignore_index=True)
        
        dataLandmarksDF = pd.DataFrame()
        dataTransportDF = pd.DataFrame()
        
        for i in range(len(coordinates)):
            detailTemp = getNearbyPlaces(coordinates['hotelId'][i], location, [coordinates['longitude'][i],coordinates['latitude'][i]])
            for a in range(len(detailTemp['data']['transportations'])):
                detailTemp['data']['transportations'][a]['hotelId'] = coordinates['hotelId'][i]  
            dataTransportDF = pd.concat([dataTransportDF, pd.DataFrame(detailTemp['data']['transportations'])], ignore_index=True)
            for a in range(len(detailTemp['data']['poiInfo'])):
                detailTemp['data']['poiInfo'][a]['hotelId'] = coordinates['hotelId'][i]
            dataLandmarksDF = pd.concat([dataLandmarksDF, pd.DataFrame(detailTemp['data']['poiInfo'])], ignore_index=True)
            
        result = dataLandmarksDF
        result['poiName'] = result['poiName'].str.replace("'", "")
        result[['isShopping']] = result[['poiType']].apply(extract_distances_and_check_shop)
        result[['isShoppings']] = result[['poiName']].apply(extract_distances_and_check_shops)
        result['isShopping'] = ((result['isShopping'] == 1) | (result['isShoppings'] == 1)).astype(int)

        result[['isReligi']] = result[['poiType']].apply(extract_distances_and_check_religi)
        result[['isReligis']] = result[['poiName']].apply(extract_distances_and_check_religis)
        result['isReligi'] = ((result['isReligi'] == 1) | (result['isReligis'] == 1)).astype(int)

        result[['isEducation']] = result[['poiType']].apply(extract_distances_and_check_education)
        result[['isEducations']] = result[['poiName']].apply(extract_distances_and_check_educations)
        result['isEducation'] = ((result['isEducation'] == 1) | (result['isEducations'] == 1)).astype(int)

        result[['isHistorical']] = result[['poiType']].apply(extract_distances_and_check_historical)

        result[['isNature']] = result[['poiName']].apply(extract_distances_and_check_nature)

        result[['isKidsFriendly']] = result[['poiType']].apply(extract_distances_and_check_kids)
        
        mergedDFs = hotels.merge(result, on='hotelId', how='left', indicator=True)
        mergedDFs['rating_value'] = mergedDFs['rating'].apply(lambda x: float(x['value']) if isinstance(x, dict) and 'value' in x else None)
        mergedDataFrame = mergedDFs.groupby('hotelId')[['name','heroImage','rating_value','stars','distance','coordinates','rawPrice','price','images','cheapestOfferPartnerName','isEducation','isShopping','isHistorical','isNature','isReligi','isKidsFriendly']].max().reset_index()
        mergedDataFrame = mergedDataFrame.merge(dataTransportDF[['hotelId']], on='hotelId', how='left', indicator=True)
        mergedDataFrame['isTransit'] = (mergedDataFrame['_merge'] == 'both').astype(int)
        mergedDataFrame = mergedDataFrame.drop(columns=['_merge'])
        dataDistinct = mergedDataFrame.drop_duplicates(subset=['hotelId'])
        dataDistinct = dataDetailDFs[['hotelId','location','amenities','reviews','gallery']].merge(dataDistinct, on='hotelId', how='right', indicator=True)
        dataDistinct = dataDistinct.drop(columns=['_merge'])
        dataDistinct['location'] = dataDistinct['location'].apply(lambda x: (x['address']) if isinstance(x, dict) and 'address' in x else None)
        dataDistinct['amenities'] = dataDistinct['amenities'].apply(lambda x: (x['content']) if isinstance(x, dict) and 'content' in x else None)
        
        data_referensi = tujuan_preferensi(preferensi, dataLandmarksDF, dataTransportDF)
        default_value = [{'icon': None, 'description': None}]
        # data_referensi = data_referensi.groupby('hotelId')[['entityId','poiName','linearDistance']].max().reset_index()
        if data_referensi.empty:
            data_referensi = dataDistinct
            data_referensi['linearDistance'] = dataDistinct['distance'].str.extract(r'([\d,]+)').replace(',', '.', regex=True).astype(float)
        else:
            data_referensi = data_referensi.merge(dataDistinct, how="inner")
            
        data_referensi['amenities'] = data_referensi['amenities'].apply(lambda x: default_value if x == [] else x)
        data_referensi = dataNilai(data_referensi, preferensi=preferensi)
        
        skyline(data_referensi)
        
        data_result = nmf_process(data_referensi)
        
        return data_result.to_json()

@app.route('/searchLoc', methods=['GET'])
def searchLoc():
    location = request.form.get("location")
    dataLocation = getPlaces(location)
    return dataLocation


if __name__ == '__main__':
    app.run(debug=True)