import firebase_admin,flask,json,hashlib,pyrebase
from firebase_admin import credentials,firestore,initialize_app

cred=credentials.Certificate('demoproj1-846af-firebase-adminsdk-h5d3b-4f2f9b4fb0.json')
initialize_app(cred)
db=firestore.client()

firebase_config = {
    'apiKey': "AIzaSyCZjGlRKSajbVwwIp1gnsuEiISnA-9sn2U",
    'databaseURL':'https://epicsfinal-default-rtdb.firebaseio.com/',
    'authDomain': "epicsfinal.firebaseapp.com",
    'projectId': "epicsfinal",
    'storageBucket': "epicsfinal.appspot.com",
    'messagingSenderId': "871316201787",
    'appId': "1:871316201787:web:7aac406cc234cc5bd2571e",
    'measurementId': "G-MCS7P04T27"
}

app=flask.Flask(__name__)
app.secret_key='as1921ibndssiuaboibr'

firebase=pyrebase.initialize_app(firebase_config)
auth_obj=firebase.auth()

def print_response(resp):
    print(resp.status)
    print(resp.headers)
    print(resp.data)

def write_details(data):
    for patient in data:
        pat_id=hashlib.md5(bytes(patient,'utf-8')).hexdigest()
        data[patient]['patid']=patient
        db.collection('Patient').document(pat_id).set(data[patient])
        print('set ',patient)
    
if __name__=='__main__':

    @app.route('/send_patient_data/',methods=['POST'])
    def send_patient_details():
        data=flask.request.get_json(force=True)
        print(data)
        resp=flask.jsonify({'message': 'success'})
        resp.headers['Access-Control-Allow-Origin']='http://localhost:3000'
        resp.headers['Access-Control-Allow-Credentilas']='true'
        write_details(data)
        return resp
        
    @app.route('/get_patient_details/',methods=['GET'])
    def get_patient_details():
        print('get_patient_details',flask.session)
        docid=flask.session['docid']
        doc_obj=db.collection('Doctor').document(docid).get().to_dict()
        patids=doc_obj['patids']
        print('patients are: ',patids)
        hashed_patids=[hashlib.md5(bytes(i.strip(),'utf-8')).hexdigest() for i in patids]

        print('printing patient details')
        patient_details=dict()
        for hashed_id in hashed_patids:
            patient=db.collection('Patient').document(hashed_id).get().to_dict()
            patient_details[patient['patid']]=dict()
            patient_details[patient['patid']]['name']=patient['name']
            patient_details[patient['patid']]['age']=patient['age']
            patient_details[patient['patid']]['current_medications']=patient['current_medications']
            patient_details[patient['patid']]['medical_history']=patient['medical_history']
            patient_details[patient['patid']]['blood_group']=patient['blood_group']
            print(patient)
        print(patient_details)    
        
        print('hashed patids: ',hashed_patids)
        resp=flask.jsonify({'patient_details': patient_details})
        resp.headers['Access-Control-Allow-Origin']='http://localhost:3000'
        resp.headers['Access-Control-Allow-Credentials']='true'
        resp.headers['Status']='200'
        return resp

    @app.route('/doc_login/',methods=['POST'])
    def doc_login():
        json_obj=flask.request.get_json(force=True)
        print('[server.py::signin()]: request data: ',json_obj)
        try:
            auth_obj.sign_in_with_email_and_password(json_obj['username'],json_obj['password'])
            print('[server.py::signin()]: signin successful: ')
            resp=flask.jsonify({'message': 'success'})
            resp.headers['Access-Control-Allow-Origin']='http://localhost:3000'
            resp.headers['Access-Control-Allow-Credentials']='true'
            flask.session['docid']=hashlib.md5(bytes(json_obj['username'],'utf-8')).hexdigest()
            print('generated docid: ',flask.session['docid'])
            print(flask.session)
            return resp
        except Exception as exception:
            print('[server.py::login()]: ',exception)
            resp=flask.jsonify({'message': 'error'})
            resp.headers['Access-Control-Allow-Origin']='http://localhost:3000'
            resp.headers['Access-Control-Allow-Credentials']='true'
            return resp

    @app.route('/doc_signup/',methods=['POST'])
    def doc_signup():
        json_obj=flask.request.get_json(force=True)
        print('[server.py::signup()]: request data: ',json_obj)
        print('signing up...')
        try:
            auth_obj.create_user_with_email_and_password(json_obj['username'],json_obj['password'])
            print('[server.py::signup()]: signup successful')
            resp=flask.jsonify({'message': 'success'})
            resp.headers['Access-Control-Allow-Origin']='http://localhost:3000'
            resp.headers['Access-Control-Allow-Credentials']='true'
            print_response(resp)
            flask.session['docid']=hashlib.md5(bytes(json_obj['username'],'utf-8')).hexdigest()
            print('generated session hospid',flask.session['docid'])
            return resp
        except Exception as exception:
            print(exception)
            resp=flask.jsonify({'message': 'error'})
            resp.headers['Access-Control-Allow-Origin']='http://localhost:3000'
            resp.headers['Access-Control-Allow-Credentials']='true'
            print_response(resp)
            return resp
    
    @app.route('/get_hospital_details/',methods=['GET'])
    def get_hospital_details():
        print('get_hospital_data')
        print(flask.session)
        print('[server.py::get_hospital_details()]: ',flask.session)
        resp=flask.jsonify({'message': 'success'})
        db_result=db.collection('Hospital').document(flask.session['hospid']).get()
        resp=flask.jsonify(db_result.to_dict())
        resp.headers['Access-Control-Allow-Origin']='http://localhost:3000'
        resp.headers['Access-Control-Allow-Credentials']='true'
        return resp
    
    @app.route('/send_hospital_details/',methods=['OPTIONS'])
    def send_hospital_details_options():
        resp=flask.make_response()
        resp.headers['Access-Control-Allow-Origin']='*'
        resp.headers['Access-Control-Allow-Headers']="Content-Type"
        return resp

    @app.route('/send_hospital_details/',methods=['POST'])
    def send_hospital_details():
        print(flask.session)
        json_obj=flask.request.get_json(force=True)
        print('[server.py::send_hospital_details()]: request data',json_obj)
        db.collection('Hospital').document(flask.session['hospid']).set(json_obj)
        resp=flask.make_response('response')
        resp.headers['Access-Control-Allow-Origin']='http://localhost:3000'
        resp.headers['Access-Control-Allow-Credentials']='true'
        return resp

    @app.route('/signup/',methods=['POST'])
    def signup():
        json_obj=flask.request.get_json(force=True)
        print('[server.py::signup()]: request data: ',json_obj)
        print('signing up...')
        try:
            auth_obj.create_user_with_email_and_password(json_obj['username'],json_obj['password'])
            print('[server.py::signup()]: signup successful')
            resp=flask.jsonify({'message': 'success'})
            resp.headers['Access-Control-Allow-Origin']='http://localhost:3000'
            resp.headers['Access-Control-Allow-Credentials']='true'
            print_response(resp)
            flask.session['hospid']=hashlib.md5(bytes(json_obj['username'],'utf-8')).hexdigest()
            print('generated session hospid',flask.session['hospid'])
            return resp
        except Exception as exception:
            print(exception)
            resp=flask.jsonify({'message': 'error'})
            resp.headers['Access-Control-Allow-Origin']='http://localhost:3000'
            resp.headers['Access-Control-Allow-Credentials']='true'
            print_response(resp)
            return resp

    @app.route('/login/',methods=['POST'])
    def login():
        json_obj=flask.request.get_json(force=True)
        print('[server.py::signin()]: request data: ',json_obj)
        try:
            auth_obj.sign_in_with_email_and_password(json_obj['username'],json_obj['password'])
            print('[server.py::signin()]: signin successful: ')
            resp=flask.jsonify({'message': 'success'})
            resp.headers['Access-Control-Allow-Origin']='http://localhost:3000'
            resp.headers['Access-Control-Allow-Credentials']='true'
            flask.session['hospid']=hashlib.md5(bytes(json_obj['username'],'utf-8')).hexdigest()
            print('generated hospid: ',flask.session['hospid'])
            print(flask.session)
            return resp
        except Exception as exception:
            print('[server.py::login()]: ',exception)
            resp=flask.jsonify({'message': 'error'})
            resp.headers['Access-Control-Allow-Origin']='http://localhost:3000'
            resp.headers['Access-Control-Allow-Credentials']='true'
            return resp

    app.run(debug=True)