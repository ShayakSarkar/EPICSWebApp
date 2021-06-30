import pyrebase,flask,json
from firebase_admin import firestore,credentials,initialize_app

cred=credentials.Certificate('./epicsfinal-firebase-adminsdk-h65dr-5274cf5546.json')
initialize_app(cred)

db=firestore.client()
data=db.collection('Patient').get()
for doc in data:
    print(doc.to_dict())