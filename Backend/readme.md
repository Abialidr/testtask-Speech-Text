# delete venv folder from Backend directory and run this commands bellow to run the server

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 manage.py runserver
