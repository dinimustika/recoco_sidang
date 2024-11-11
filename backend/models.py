import pandas as pd
import json
import re
import requests
import numpy as np

from sklearn.decomposition import NMF
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler, normalize

headers = {
    "x-rapidapi-key": "b6b5149870msh0fcb34678020bb0p1ae318jsn96ed84cba5ed",
    "x-rapidapi-host": "sky-scrapper.p.rapidapi.com"
}

def getHotels(entityID, checkin, checkout, guests, room):
    url = "https://sky-scrapper.p.rapidapi.com/api/v1/hotels/searchHotels"
    querystring = {"entityId":entityID,"checkin":checkin,"checkout":checkout,"adults":guests,"rooms":room,"limit":"20","sorting":"-relevance","currency":"IDR","market":"en-US","countryCode":"ID"}
    response = requests.get(url, headers=headers, params=querystring)
    print("get data hotel")
    return response.json()

def getPlaces(places):
    url = "https://sky-scrapper.p.rapidapi.com/api/v1/hotels/searchDestinationOrHotel"
    querystring = {"query":places}
    response = requests.get(url, headers=headers, params=querystring)
    return response.json()

def getDetail(hotelID, entityID):
    url = "https://sky-scrapper.p.rapidapi.com/api/v1/hotels/getHotelDetails"
    querystring = {"hotelId":hotelID,"entityId":entityID,"currency":"IDR","market":"en-US","countryCode":"ID"}           
    response = requests.get(url, headers=headers, params=querystring)
    print("get data detail")
    return response.json()

def getNearbyPlaces(hotelID, cityID, coordinates):
    url = "https://sky-scrapper.p.rapidapi.com/api/v1/hotels/nearbyMap"
    querystring = {"cityId":cityID,"latitude":coordinates[1],"longitude":coordinates[0],"currency":"IDR","market":"en-US","countryCode":"ID"}   
    response = requests.get(url, headers=headers, params=querystring)
    print("get data nearby")
    return response.json()

educations = ['Museum','School','Cultural Center','Aquarium']
business = ['Government building','Modern architecture']
shoppings = ['Entertainment']
religies = ['Place of Worship']
outdoor = ['Park','Amusement park']
kidsfriendly = ['Park','Amusement park']
others = ['Attractions']

historicalPlace = ["palace", "mansion", "temple", "pagoda", "museum"]
religiPlace = ["religiousbuilding"]
educationPlace = ["zoo", "museum", "gallery", "university", "politeknik","governmentbuilding","aquarium","exhibitioncenter"]
medicalPlace = ["rs", "clinic", "hospital", "rumah sakit", "klinik"]
shoppingPlace = ["shoppingmall"]
transitPlace = ["Airport", "station","TrainStation", "terminal", "train"]
naturePlace = ["hillpark", "hill", "highland", "mount", "gunung", "bukit", "beach", "springs", "waterfall","air terjun", "pemandian alam", "village", "island", "pulau", "peninsula", "garden"]

def extract_distances_and_check_kids(landmarks_text):
    kidsfr = []
    for landmark in landmarks_text:
        if any(keyword in landmark.lower() for keyword in kidsfriendly):
            kidsfr.append(1)
        else:
            kidsfr.append(0)
    return kidsfr

def extract_distances_and_check_shop(landmarks_text):
    shopping = []
    for landmark in landmarks_text:
        if any(keyword in landmark.lower() for keyword in shoppingPlace):
            shopping.append(1)
        else:
            shopping.append(0)
    return shopping

def extract_distances_and_check_shops(landmarks_text):
    shopping = []
    for landmark in landmarks_text:
        if any(keyword in landmark.lower() for keyword in shoppings):
            shopping.append(1)
        else:
            shopping.append(0)
    return shopping

def extract_distances_and_check_religi(landmarks_text):
    religi = []
    for landmark in landmarks_text:
        if any(keyword in landmark.lower() for keyword in religiPlace):
            religi.append(1)
        else:
            religi.append(0)
    return religi

def extract_distances_and_check_religis(landmarks_text):
    religi = []
    for landmark in landmarks_text:
        if any(keyword in landmark.lower() for keyword in religies):
            religi.append(1)
        else:
            religi.append(0)
    return religi

def extract_distances_and_check_education(landmarks_text):
    education = []    
    for landmark in landmarks_text:
        if any(keyword in landmark.lower() for keyword in educationPlace):
            education.append(1)
        else:
            education.append(0)
    return education

def extract_distances_and_check_educations(landmarks_text):
    education = []    
    for landmark in landmarks_text:
        if any(keyword in landmark.lower() for keyword in educations):
            education.append(1)
        else:
            education.append(0)
    return education

def extract_distances_and_check_historical(landmarks_text):
    historical = []
    for landmark in landmarks_text:
        if any(keyword in landmark.lower() for keyword in historicalPlace):
            historical.append(1)
        else:
            historical.append(0)
    return historical

def extract_distances_and_check_nature(landmarks_text):
    nature = []
    for landmark in landmarks_text:
        if any(keyword in landmark.lower() for keyword in naturePlace):
            nature.append(1)
        else:
            nature.append(0)
    return nature

def extract_distances_and_check_transit(landmarks_text):
    transit = []
    for landmark in landmarks_text:
        if any(keyword in landmark.lower() for keyword in transitPlace):
            transit.append(1)
        else:
            transit.append(0)
    return transit

def dataNilai(data, preferensi = ''):    
    data['nilai'] = 0
    business_list = ['business center','meeting room','meeting','hall','fax','wifi','internet','restaurant','rental car','laundry','desk','room service','shuttle service']
    leisure_list = ['pool','spa','concierge','entertainment','restaurant','coffee shop','laundry','rental car']
    medical_list = ['doctor','first aid','non-smoking','allergy-free','daily disinfection','front desk','wheelchair']     
    def count_facilities(facilities, preference):
        def contains_keyword(facility, keyword_list):
            return any(keyword.lower() in facility.lower() for keyword in keyword_list)

        facilities = facilities.split(', ')
        if preference in ['business', 'shopping']:
            return sum(contains_keyword(facility, business_list) for facility in facilities)
        elif preference == 'leisure':
            return sum(contains_keyword(facility, leisure_list) for facility in facilities)
        elif preference == 'medical':
            return sum(contains_keyword(facility, medical_list) for facility in facilities)
        else:
            return None  # Handle the case when preference is None or not recognized

    if(preferensi != ''):
        # Apply lambda function to count facilities based on preference
        data['nilai'] = data['amenities'].apply(lambda row: count_facilities(row[0]['description'], preferensi) if row and row[0]['description'] is not None else 0)
    else: 
        # Apply lambda function to count facilities
        data['nilai'] = data['amenities'].apply(lambda x: {
            'business': sum(facility in x for facility in business_list),
            'leisure': sum(facility in x for facility in leisure_list),
            'medical': sum(facility in x for facility in medical_list)
        })
        df = pd.DataFrame(data['nilai'])
        data['nilai'] = df
        
    print("data nilai")

    return data

def is_dominated(item1, item2):
    if 'price' in item1 and 'price' in item2:
        if item1['rating_value'] > item2['rating_value'] and item1['rawPrice'] < item2['rawPrice'] and item1['value'] > item2['value'] and item1['nilai'] > item2['nilai']:
            return True
    else:
        if item1['rating_value'] > item2['rating_value'] and item1['value'] > item2['value'] and item1['nilai'] > item2['nilai']:
            return True
    return False

def tujuan_preferensi(tujuan, dataLandmarksDF=None, dataTransportDF=None):
    filtered_and_sorted_dataframe = pd.DataFrame()
    if tujuan == "transit":        
        sorted_result = dataTransportDF.sort_values(
            by='linearDistance')

        filtered_sorted_result = sorted_result[sorted_result['linearDistance'] < 10000]

        filtered_and_sorted_dataframe = filtered_sorted_result.iloc[[0]]
        
    if tujuan == "shopping":
        result = dataLandmarksDF[dataLandmarksDF['poiType']=="ShoppingMall"]
        sorted_result = result.sort_values(
            by='linearDistance')

        filtered_sorted_result = sorted_result[(sorted_result['linearDistance'] < 10000) & (sorted_result['isShopping'] == 1)]

        filtered_and_sorted_dataframe = filtered_sorted_result.groupby('hotelId')[['entityId','linearDistance','isShopping']].min().reset_index()
        
    if tujuan == "nature":
        result = dataLandmarksDF
        result['isNature'] = result[['poiName']].apply(extract_distances_and_check_nature)
        sorted_result = result.sort_values(
            by='linearDistance')

        filtered_sorted_result = sorted_result[(sorted_result['linearDistance'] < 10000) & (sorted_result['isNature'] == 1)]

        filtered_and_sorted_dataframe = filtered_sorted_result.groupby('hotelId')[['entityId','linearDistance','isNature']].min().reset_index()
        
    if tujuan == "historical":
        result = dataLandmarksDF
        result['isHistorical'] = result[['poiType']].apply(extract_distances_and_check_historical)
        sorted_result = result.sort_values(
            by='linearDistance')

        filtered_sorted_result = sorted_result[(sorted_result['linearDistance'] < 10000) & (sorted_result['isHistorical'] == 1)]

        filtered_and_sorted_dataframe = filtered_sorted_result.groupby('hotelId')[['entityId','linearDistance','isHistorical']].min().reset_index()

    return filtered_and_sorted_dataframe

def skyline(df, preferensi=None, filter=None):

    skyline_set = []

    normalized_price = (df['rawPrice'] - df['rawPrice'].min()) / (df['rawPrice'].max() - df['rawPrice'].min())
    normalized_rating = (df['rating_value'] - df['rating_value'].min()) / (df['rating_value'].max() - df['rating_value'].min())
    normalized_distance = (df['linearDistance'] - df['linearDistance'].min()) / (df['linearDistance'].max() - df['linearDistance'].min())
    
    # Define the weights for the attributes
    weight_price = 0.5
    weight_rating = 0.5
    weight_distance = 1/normalized_distance
    
    # Calculate the value attribute
    value = (weight_price * normalized_price) + (weight_rating * normalized_rating) + (weight_distance*normalized_distance)
    df['value'] = value
    for _, item in df.iterrows():
        is_skyline = True

        for skyline_item in skyline_set:
            if is_dominated(skyline_item, item):
                is_skyline = False
                break

        if is_skyline:
            skyline_set.append(item)
    
    # Add the value attribute to the dataset
    data = pd.DataFrame(skyline_set)
    
    if preferensi and preferensi != "0":
        data_distance = data[data[preferensi] == 1]
        if len(data_distance) == 0 or len(data_distance) <= 10:
            data_tambahan = data
            data_distance = pd.concat([data_tambahan, data_distance])
            data_distance.sort_values(by=['rating_value'], ascending=[False], inplace=True)
            return data_distance
        else:
            data_distance.sort_values(by=['rating_value'], ascending=[False], inplace=True)
            return data_distance
    else:
        if (filter):
            data.sort_values(by=filter, ascending=[True], inplace=True)
        else:
            data.sort_values(by=['rating_value'], ascending=[False], inplace=True)
        return data
    
def nmf_process(filtered_and_sorted_, tujuan=''):
    num_latent_factors = 5

    filtered_and_sorted_ = filtered_and_sorted_.fillna(0)

    # Apply NMF
    model = NMF(n_components=num_latent_factors,
                init='nndsvda', random_state=42)

    W = model.fit_transform(filtered_and_sorted_[
                                ['rating_value', 'rawPrice', 'value', 'nilai', 'linearDistance']])
    target_item_characteristics = np.array(
            [8, filtered_and_sorted_['rawPrice'].min(), 10, 0.6, 0.9])
    H = model.components_

    # Calculate similarity scores between the target item and all other items
    target_item_similarity_scores = cosine_similarity(
        [target_item_characteristics], W @ H.T)[0]
    top_n_recommendations = np.argsort(target_item_similarity_scores)[::-1]
    recommended_items = []
    for idx in top_n_recommendations:
        item_details = filtered_and_sorted_.iloc[idx]
        recommended_items.append(item_details)

    recommended_df = pd.DataFrame(recommended_items)

    recommended_df = recommended_df.astype({'rating_value': 'float'})
    recommended_df = recommended_df.drop_duplicates(subset=['name'])

    result = skyline(recommended_df)
    # result = result[result['rating_value'] >= 7]
    result = result.drop_duplicates(subset=['name'])
    result = result.sort_values(by=['linearDistance'])

    rating_threshold = 7.0
    distance_threshold = 20.0
    value_threshold = 0.5
    nilai_threshold = 5
    calculated_threshold = 5.0
    result['relevance_score'] = 0.0

    for item in result.index:
        relevance_score = 0
        if result['rating_value'][item] >= rating_threshold:
            relevance_score += 1
        if tujuan != '':
            if result[f'{tujuan}'][item] == 1:
                relevance_score += 1
            if result['linearDistance'][item] <= calculated_threshold:
                relevance_score += 1
        if result['linearDistance'][item] <= distance_threshold:
            relevance_score += 1
        if result['nilai'][item] >= nilai_threshold:
            relevance_score += 1
        if result['value'][item] >= value_threshold:
            relevance_score += 1
        result['relevance_score'][item] = relevance_score

    result.sort_values(by=['relevance_score', 'nilai',
                       'linearDistance', 'rating_value'], ascending=[False, False, True, False], inplace=True)
    result = result.drop_duplicates(subset=['name']).reset_index()
    result[['name', 'relevance_score', 'rating_value',
            'linearDistance', 'rawPrice','value']]

    return result[:10]
