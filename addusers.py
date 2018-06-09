import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model.tabledef import *
 
#engine = create_engine('sqlite:///test.db', echo=True)
 
# create a Session
Session = sessionmaker(bind=engine)
session = Session()

user = User("admin@devils.com","admin")
session.add(user)
session.commit()


''' 
user = User("python@devils.com","python")
session.add(user)
 
user = User("devil@devils.com","devil")
session.add(user)

player = Players("Chun Lee","China","08-04-1991","true")
session.add(player)
'''
'''
player = Players("http://apps-internal.bom1.gupshup.me:8086/applications/sendData?sender=$sender&vmn=$extension","Australia","05-06-1992","true")
session.add(player)
'''

country = Countries("India",1373541278,"http://code.gijgo.com/flags/24/India.png","false","false","null")
session.add(country)

country = Countries("West Indies",1373541278,"http://code.gijgo.com/flags/24/WI.png","false","false","null")
session.add(country)

country = Countries("Australia",1373541278,"http://code.gijgo.com/flags/24/Australia.png","false","false","null")
session.add(country)

country = Countries("England",1373541278,"http://code.gijgo.com/flags/24/England.png","false","false","null")
session.add(country)

country = Countries("Pakistan",1373541278,"http://code.gijgo.com/flags/24/Pakistan.png","false","false","null")
session.add(country)

country = Countries("South Africa",1373541278,"http://code.gijgo.com/flags/24/SA.png","false","false","null")
session.add(country)

country = Countries("SriLanka",1373541278,"http://code.gijgo.com/flags/24/SriLanka.png","false","false","null")
session.add(country)

country = Countries("NewZealand",1373541278,"http://code.gijgo.com/flags/24/NewZealand.png","false","false","null")
session.add(country)

country = Countries("Bangladesh",1373541278,"http://code.gijgo.com/flags/24/Bangladesh.png","false","false","null")
session.add(country)

country = Countries("Afghanistan",1373541278,"http://code.gijgo.com/flags/24/Afghanistan.png","false","false","null")
session.add(country)

country = Countries("Ireland",1373541278,"http://code.gijgo.com/flags/24/Ireland.png","false","false","null")
session.add(country)

# commit the record the database
session.commit()

