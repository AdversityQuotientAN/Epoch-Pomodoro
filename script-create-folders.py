import os

path = os.path.realpath(__file__)
dir = os.path.dirname(path) + r'\client\src'
os.chdir(dir)

folders = ['Components', 'Context', 'Handlers', 'Models', 'Pages', 'Routes', 'Services']

for folder in folders:
    try:
        os.mkdir(folder)
    except:
        pass
