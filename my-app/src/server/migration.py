import pyrebase,flask,json,hashlib,pickle
from firebase_admin import firestore,credentials,initialize_app

cred=credentials.Certificate('./epicsfinal-firebase-adminsdk-h65dr-5274cf5546.json')
initialize_app(cred)

db=firestore.client()

HospitalData=db.collection('Hospital').get()
PatientData=db.collection('Patient').get()
DoctorData=db.collection('Doctor').get()

f=open('./PatientData.dat','wb')
lh=[{doc.id:doc.to_dict()} for doc in PatientData]
pickle.dump(lh,f)

f=open('./HospitalData.dat','wb')
lh=[{doc.id:doc.to_dict()} for doc in HospitalData]
pickle.dump(lh,f)

f=open('./DoctorData.dat','wb')
lh=[{doc.id:doc.to_dict()} for doc in DoctorData]
pickle.dump(lh,f)