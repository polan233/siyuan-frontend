import requests
import xmltodict
#https://api.map.baidu.com/place/v2/search
#?query=ATM机&tag=银行&region=北京&output=json&ak=您的ak //GET请求
# AK 6V6SUd9fsAoe1HuPhMVLisAGmQiA4inE


ak='6V6SUd9fsAoe1HuPhMVLisAGmQiA4inE'


#请求地址
url = "https://api.map.baidu.com/place/v2/search"
param = {"ak":"6V6SUd9fsAoe1HuPhMVLisAGmQiA4inE","query":"纽约","region":"美国"}

response = requests.get(url,params=param)
#获取请求状态码 200为正常
if(response.status_code == 200):
    #获取相应内容
    print("获取成功")
    content = response.text
    print(content)
    dict = xmltodict.parse(content)
    print(dict)
    data=dict['PlaceSearchResponse']['results']['result'][0]
    print(data)
    point=data['location']
    print(point)
else:
    print("请求失败!")

def searchChinaPoint(cityName):
    url = "https://api.map.baidu.com/place/v2/search"
    param = {"ak":"6V6SUd9fsAoe1HuPhMVLisAGmQiA4inE","query":cityName,"region":"全国"}
    response = requests.get(url,params=param)
    #获取请求状态码 200为正常
    if(response.status_code == 200):
        #获取相应内容
        print("获取成功")
        content = response.text
        print(content)
        dict = xmltodict.parse(content)
        print(dict)
        data=dict['PlaceSearchResponse']['results']['result']
        print(data)
        point=data['location']
        print(point)
        return point
    else:
        print("请求失败!")
        return {}
