from sqlalchemy import *
from sqlalchemy import create_engine, ForeignKey
from sqlalchemy import Column, Date, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref

engine = create_engine('sqlite:///model/test.db',echo=True)
Base = declarative_base()

class User(Base):
	__tablename__ = "users"
	id = Column(Integer,primary_key=True)
	username = Column(String)
	password = Column(String)

	def __init__(self, username, password):
		self.username = username
		self.password = password

class Players(Base):
	__tablename__ = "Players"
	id = Column(Integer,primary_key=True)
	Name = Column(String)
	CountryName = Column(String)
	DateOfBirth = Column(String)
	IsActive = Column(String)

	def __init__(self, Name, CountryName, DateOfBirth, IsActive):
		self.Name = Name
		self.CountryName = CountryName
		self.DateOfBirth = DateOfBirth
		self.IsActive = IsActive

	def __repr__(self):
		return "{ \"ID\" : \"%d\", \"Name\" : \"%s\", \"CountryName\" : \"%s\", \"DateOfBirth\" : \"%s\", \"IsActive\" : \"%s\"}" % (self.id, self.Name, self.CountryName, self.DateOfBirth, self.IsActive)


class Countries(Base):
	__tablename__ = "Countries"
	id = Column(Integer, primary_key=True)
	Name = Column(String, unique=True)
	population = Column(Integer)
	flagUrl = Column(String)
	checked = Column(String)
	hasChildren = Column(String)
	children = Column(String)


	def __init__(self, Name, population, flagUrl, checked, hasChildren, children):
		self.Name = Name
		self.population = population
		self.flagUrl = flagUrl
		self.checked = checked
		self.hasChildren = hasChildren
		self.children = children

	def __repr__(self):
		return "{ \"id\" : \"%d\", \"text\" : \"%s\", \"population\" : \"%d\", \"flagUrl\" : \"%s\", \"checked\" : \"%s\", \"hasChildren\" : \"%s\", \"children\" : \"%s\"}" % (self.id, self.Name, self.population, self.flagUrl, self.checked, self.hasChildren, self.children)


#Create table
Base.metadata.create_all(engine)