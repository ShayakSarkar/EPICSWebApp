import pyrebase,flask,json,hashlib,pickle
from firebase_admin import firestore,credentials,initialize_app

cred=credentials.Certificate('demoproj1-846af-firebase-adminsdk-h5d3b-4f2f9b4fb0.json')
initialize_app(cred)

db=firestore.client()

f=open('./PatientData.dat','rb')
patient_data=pickle.load(f)
f=open('./HospitalData.dat','rb')
hospital_data=pickle.load(f)
f=open('./DoctorData.dat','rb')
doctor_data=pickle.load(f)

for obj in hospital_data:
    id=None
    for var in obj:
        id=var
    db.collection('Hospital').document(id).set(obj[id])    