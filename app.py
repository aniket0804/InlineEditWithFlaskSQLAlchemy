from flask import Flask, render_template, redirect, request, session, abort, flash
import os
import json, ast
import simplejson

from sqlalchemy.orm import sessionmaker
from model.tabledef import *

app = Flask(__name__)

@app.route('/')
def main():
	return render_template('layout.html')

@app.route('/home')
def home():
	if not session.get('logged_in'):
		return render_template('login.html')
	else:
		return render_template('home.html',msg="You're logged in",user=session.get('inputEmail'))

@app.route('/login', methods=['GET','POST'])
def login():
	if request.method == 'POST':
		POST_EMAILID = str(request.form['inputEmail'])
		POST_PASSWORD = str(request.form['inputPassword'])
		Session = sessionmaker(bind=engine)
		s = Session()
		query = s.query(User).filter(User.username.in_([POST_EMAILID]), User.password.in_([POST_PASSWORD]))
		result = query.first()
		if result:
			session['logged_in'] = True
			session['inputEmail'] = request.form['inputEmail'].split('@')[0]
			return redirect('/home')
		else:
			flash('wrong password!')
	return home()


@app.route('/SavePlayers', methods=['GET','POST'])
def SavePlayers():
	Session = sessionmaker(bind=engine)
	s = Session()
	receivedict=request.form.to_dict()
	Country = s.query(Countries).get(receivedict['record[CountryID]'])
	if receivedict['record[ID]'] != "":
		Player = s.query(Players).get(receivedict['record[ID]'])
		Player.Name = receivedict['record[Name]']
		Player.CountryName = Country.Name
		Player.DateOfBirth = receivedict['record[DateOfBirth]']
		Player.IsActive = receivedict['record[IsActive]']
		print(Player.Name)
		s.commit()
	else:
		print("Received add request")
		Player = Players(receivedict['record[Name]'],Country.Name,receivedict['record[DateOfBirth]'],receivedict['record[IsActive]'])
		s.add(Player)
		s.commit()
	return "This function to add /save player"

@app.route('/DelPlayers', methods=['GET','POST'])
def DelPlayers():
	Session = sessionmaker(bind=engine)
	s = Session()
	receivedict=request.form.to_dict()
	Playerid = s.query(Players).get(receivedict['id'])
	s.delete(Playerid)
	s.commit()
	return "This function to Delete Player"



@app.route('/GetPlayers', methods=['GET','POST'])
def GetPlayers():
	Players1={"records":[{"ID":1,"Name":"Hristo Stoichkov","PlaceOfBirth":"Plovdiv, Bulgaria","DateOfBirth":"\/Date(-122954400000)\/","CountryID":18,"CountryName":"Bulgaria","IsActive":"false","OrderNumber":1},{"ID":2,"Name":"Ronaldo Luís Nazário de Lima","PlaceOfBirth":"Rio de Janeiro, Brazil","DateOfBirth":"\/Date(211842000000)\/","CountryID":12,"CountryName":"Brazil","IsActive":"false","OrderNumber":2},{"ID":3,"Name":"David Platt","PlaceOfBirth":"Chadderton, Lancashire, England","DateOfBirth":"\/Date(-112417200000)\/","CountryID":16,"CountryName":"England","IsActive":"false","OrderNumber":3},{"ID":4,"Name":"Manuel Neuer","PlaceOfBirth":"Gelsenkirchen, West Germany","DateOfBirth":"\/Date(512258400000)\/","CountryID":17,"CountryName":"Germany","IsActive":"true","OrderNumber":4},{"ID":5,"Name":"James Rodríguez","PlaceOfBirth":"Cúcuta, Colombia","DateOfBirth":"\/Date(679266000000)\/","CountryID":14,"CountryName":"Colombia","IsActive":"true","OrderNumber":5}],"total":7}
	Session = sessionmaker(bind=engine)
	s = Session()
	if request.args['page']:
		end = int(request.args['limit'])*int(request.args['page'])
		start = end - int(request.args['limit'])

	p1 = s.query(Players).offset(start).limit(int(request.args['limit'])).all()

	pname = request.args.get('name')
	pnation = request.args.get('nationality')
	if pname :
		print("pname executed")
		p1 = s.query(Players).filter(Players.Name.like("%" + request.args['name'] + "%")).offset(start).limit(end).all()
	if pnation:
		print("pnation executed")
		p1 = s.query(Players).filter(Players.CountryName.like("%" + request.args['nationality'] + "%")).offset(start).limit(end).all()
	if pname and pnation:
		print("pname and pnation executed")
		p1 = s.query(Players).filter(Players.Name.like("%" + request.args['name'] + "%")).filter(Players.CountryName.like("%" + request.args['nationality'] + "%")).offset(start).limit(end).all()

	count = s.query(Players).count()
	data=ast.literal_eval((str(p1)))
	Players2={"records":data, "total":count}
	print(Players2)
	print(count)
	return json.dumps(Players2)


@app.route('/GetCountries',methods=['GET','POST'])
def GetCountries():
	Session = sessionmaker(bind=engine)
	s = Session()
	p1 = s.query(Countries).distinct().all()
	count = s.query(Countries).count()
	data=ast.literal_eval((str(p1)))
	print(data)
	return json.dumps(data)

@app.route('/contact')
def contact():
	return render_template('contact.html')


@app.route('/about')
def about():
	return render_template('about.html')


@app.route("/logout")
def logout():
	session['logged_in'] = False
	return home()

if __name__ == '__main__':
	app.secret_key = os.urandom(12)
	app.run(debug=True)
