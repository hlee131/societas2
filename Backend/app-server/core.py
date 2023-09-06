from flask import session, app
from datetime import datetime
import os

class Status:
    def __init__(self, success, message):
        self.success = success
        self.message = message
    
    def __str__(self):
        return str({'success':self.success,'message':self.message})
    

getcurr = lambda: session.get('curr')
def setcurr(new):
    session['curr'] = new

def cprint(string):
    logpath = './res/log'
    if os.getcwd().endswith('app-server'):
        logpath = './../res/log'
    with open(logpath, 'r') as f:
        text = f.read()
    text += '\n'+f'{datetime.now()} --- {string}'
    with open(logpath, 'w') as f:
        f.write(text)