from wtforms import Form, StringField, TextAreaField, FloatField, SubmitField, validators
from wtforms.validators import InputRequired, Email
from wtforms.fields.html5 import EmailField

class LoginForm(Form):
	email = TextField('Email address', validators=[
		Required('Please provide a valid email address'),
		Length(min=6, message=(u'Email address too short')),
		Email(message=(u'That\'s not a valid email address.'))])
	password = PasswordField('Pick a secure password', validators=[
		Required(),
		Length(min=6, message=(u'Please give a longer password'))])
