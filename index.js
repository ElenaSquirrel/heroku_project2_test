var SERVER_NAME = 'patients-records-api'
var PORT = 8000;
var HOST = '127.0.0.1';

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var restify = require('restify')
  , server = restify.createServer({ name: SERVER_NAME})
  var url = "mongodb://127.0.0.1:27017/"

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources:')
  console.log('/patients')
  console.log('/records')
  console.log('/patients/:id')
  console.log('/patients/:id/records')
  console.log('/patients/:id/recordType/:type')  
  console.log('/patients/all') 
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())


 


//* Get all patients in the system!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

server.get('/patients', function (req, res, next) {
MongoClient.connect(url, function(err,db){
  if(err) throw err;
  var dbo = db.db("hospital_4");
  dbo.collection("patients").find().toArray(function(err,result){
    if(err) throw err;
    console.log(JSON.stringify(result));
    res.send(200, result);
    db.close();
  });
 })
})

// Get a single patient by id !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
server.get('/patients/:id', function (req, res, next) {
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital_4");
    var name = '_id';
    var id = req.params.id;
    var value = new ObjectId(id);
    var query = {};
    query[name] = value;
    console.log(JSON.stringify(query));
    dbo.collection("patients").findOne(query, function(err,result) {
      if(err) throw err;
      console.log(JSON.stringify(result));
      res.send(200, result);
      db.close();
    });
 })
})


//* Get all records in the system!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 

server.get('/records', function (req, res, next) {
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital_4");
    dbo.collection("records").find().toArray(function(err,result){
      if(err) throw err;
      console.log(JSON.stringify(result));
      res.send(result);
      db.close();
    });
   })
  })

// Get a records by patient id

server.get('patients/:id/records', function (req, res, next) {
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital_4");
    var name = 'patient_id';
    var id = req.params.id;
    var value = id;
    var query = {};
    query[name] = value;
    console.log(JSON.stringify(query));
    dbo.collection("records").find(query).toArray(function(err,result) {
      if(err) throw err;
      console.log(JSON.stringify(result));
      res.send(result);
      db.close();
    });
 })
})

// POST - create a new patient !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

 server.post('/patients', function (req, res, next) {
  // Make sure name is defined
  // if (req.params.patient_id === undefined ) {
  //   // If there are any errors, pass them to next in the correct format
  //   return next(new restify.InvalidArgumentError('patient_id must be supplied'))
  // }
  if (req.params.firstName === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('firstName must be supplied'))
  }
  if (req.params.lastName === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('lastName must be supplied'))
  }
  if (req.params.dateOfBirth === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('dateOfBirth must be supplied'))
  }
  if (req.params.gender === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('gender must be supplied'))
  }
  if (req.params.address === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('address must be supplied'))
  }
  if (req.params.city === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('city must be supplied'))
  }
  if (req.params.province === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('province must be supplied'))
  }
  if (req.params.postalCode === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('postalCode must be supplied'))
  }
  if (req.params.doctor === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('doctor must be supplied'))
  }
  var newPatient = {
    //patient_id: req.params.patient_id,
    firstName: req.params.firstName, 
    lastName: req.params.lastName, 
    dateOfBirth: req.params.dateOfBirth,
    gender: req.params.gender, 
    address: req.params.address,
    city: req.params.city,
    province: req.params.province,
    postalCode: req.params.postalCode,
    doctor: req.params.doctor
	}
  var newPatientJSON = JSON.stringify(newPatient);
  console.log(newPatientJSON);
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital_4");
    dbo.collection("patients").insertOne(newPatient, function(err, res2) {
      if (err) throw err;
      console.log(newPatient._id);
        res.send(201, newPatient);
        db.close();
    });
   })
})

// POST - create new record for a patient by patient id and record type!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

server.post('/patients/:id/recordType/:type', function (req, res, next) {

  //Make sure name is defined
  if (req.params.id === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('patient id must be supplied'))
  }
  if (req.params.type === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('recordType must be supplied'))
  }
  if (req.params.recordValue === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('recordValue must be supplied'))
  }
  if (req.params.recordUom === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('recordUom must be supplied'))
  }

  var newRecord = {
    patient_id: req.params.id, 
    recordType: req.params.type, 
    recordValue: req.params.recordValue, 
		recordUom: req.params.recordUom
	}

  var newRecordJSON = JSON.stringify(newRecord);
  console.log(newRecordJSON);
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital_4");
    dbo.collection("records").insertOne(newRecord, function(err, res2) {
      if (err) throw err;
      console.log("record inserted");
      console.log(JSON.stringify(res2));
      var name1 = 'patient_id';
      var value1 = req.params.id;
      var name2 = 'recordType';
      var value2 = req.params.type;
      var name3 = 'recordUom';
      var value3 = req.params.recordUom;
      var query = {};
      query[name1] = value1;
      query[name2] = value2;
      query[name3] = value3;
      console.log(JSON.stringify(query));
      dbo.collection("records").findOne(query, function(err,result) {
        if(err) throw err;
        console.log(result);
        res.send(201, result);
        db.close();
      });
    });
   })
});

// Delete patient record by patient id and record type

server.del('/patients/:id/recordType/:type', function (req, res, next) {
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital_4");
    var name1 = 'patient_id';
    var value1 = req.params.id;
    var name2 = 'recordType';
    var value2 = req.params.type;
    var query = {};
    query[name1] = value1;
    query[name2] = value2;
    var id = "";
    console.log(JSON.stringify(query));
    dbo.collection("records").deleteOne(query, function(err, res2) {
      if (err) throw err;
      console.log("record deleted");
      console.log(JSON.stringify(res2));
      res.send(201, "ok")
      db.close();
    });
   })
  })

// Delete patient records by patient id  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

server.del('/patients/:id/records', function (req, res, next) {
  console.log("START DELETE");
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital_4");
    var name = 'patient_id';
    var value = req.params.id;
    var query = {};
    query[name] = value;
    var id = "";
    console.log(JSON.stringify(query));
    dbo.collection("records").deleteMany(query, function(err, res2) {
      if (err) throw err;
      console.log("records deleted");
      console.log(JSON.stringify(res2));
      res.send(201, "ok")
      db.close();
    });
   })
})

// Delete all patients and their records

server.del('/patients/all', function (req, res, next) {

  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital_4");
    dbo.collection("patients").deleteMany({}, function(err, res2) {
      if (err) throw err;
      console.log("patients deleted");
      console.log(JSON.stringify(res2));
      dbo.collection("records").deleteMany({}, function(err, res3) {
        if (err) throw err;
        console.log("records deleted");
        console.log(JSON.stringify(res3));
        res.send(201, "ok")
        db.close();
      });
    });
   })
})

// Delete patient by id and his/her records !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

server.del('/patients/:id', function (req, res, next) {
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital_4");
    var name = '_id';
    var id = req.params.id;
    var value = ObjectId(id);
    var query = {};
    query[name] = value;
    var id = "";
    console.log(JSON.stringify(query));
    dbo.collection("patients").deleteOne(query, function(err, res2) {
      if (err) throw err;
      console.log("1 record deleted");
      var name = 'patient_id';
      var value = req.params.id;
      var query = {};
      query[name] = value;
      console.log(JSON.stringify(res2));
      dbo.collection("records").deleteMany(query, function(err, res3) {
        if (err) throw err;
        console.log("records deleted");
        console.log(JSON.stringify(res3));
        res.send(201, "deleted")
        db.close();
      });
    });
   })
  })


