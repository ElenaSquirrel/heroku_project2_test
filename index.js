var SERVER_NAME = 'patients-records-api'
var PORT = process.env.PORT || 8000;
var HOST = 'https://'+process.env.HOST_NAME || '127.0.0.1';
console.log('HOST='+HOST);
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var restify = require('restify')
  , server = restify.createServer({ name: SERVER_NAME})
  //var url = "mongodb://127.0.0.1:27017/"
  var url = process.env.MONGOLAB_URI_HOSPITAL;  

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources:')
  // console.log('http://127.0.0.1:8000/patients')
  // console.log('http://127.0.0.1:8000/records')
  // console.log('http://127.0.0.1:8000/patients/:id')
  // console.log('http://127.0.0.1:8000/patients/:id/records')
  // console.log('http://127.0.0.1:8000/patients/:id/recordType/:type')
  // console.log('http://127.0.0.1:8000/patients/all')
  // console.log('http://127.0.0.1:8000/patients/critical')
  console.log(HOST+':'+PORT+'/patients')
  console.log(HOST+':'+PORT+'/records')
  console.log(HOST+':'+PORT+'/patients/:id')
  console.log(HOST+':'+PORT+'/patients/:id/records')
  console.log(HOST+':'+PORT+'/patients/:id/recordType/:type')
  console.log(HOST+':'+PORT+'/patients/all')
  console.log(HOST+':'+PORT+'/patients/critical')
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())


//+/ GET critical
server.get('/patients/critical', function (req, res, next) {
  console.log('Start');
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("hospital");
    dbo.collection("patients").aggregate([
      { $lookup:
         {
           from: 'records',
           localField: '_id',
           foreignField: 'patient_id',
           as: 'recorddetails'
         }
      },
      {
        $unwind:'$recorddetails'
      },
      {
         $match:{'recorddetails.isCritical':true}
      }
    ]).toArray(function(err2, res2) {
      console.log('Finish');
      if (err2) throw err2;
      console.log(JSON.stringify(res2));
      res.send(201, res2);
      db.close();
    });
  })
});

//+/ Get all patients in the system/////////////////////////////////////////////////////////////////////////////////////////////////////////////

server.get('/patients', function (req, res, next) {
  console.log("START " + url);
MongoClient.connect(url, function(err,db){
  if(err) throw err;
  var dbo = db.db("hospital");
  dbo.collection("patients").find().toArray(function(err,result){
    if(err) throw err;
    console.log(result);
    res.send(200, result);
    db.close();
  });
 })
})

//+/ Get a single patient by id ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

server.get('/patients/:id', function (req, res, next) {
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital");
    var name = '_id';
    var id = req.params.id;
    var value = new ObjectId(id);
    var query = {};
    query[name] = value;
    dbo.collection("patients").findOne(query, function(err,result) {
      if(err) throw err;
      console.log(result);
      res.send(200, result);
      db.close();
    });
 })
})

//+/ Get patient's records by patient id////////////////////////////////////////////////////////////////////////////////////////////////////////

server.get('patients/:id/records', function (req, res, next) {
  console.log("Get patient's records by patient id");
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital");
    var name = 'patient_id';
    var id = req.params.id;
    var value = new ObjectId(id);
    var query = {};
    query[name] = value;
    dbo.collection("records").find(query).toArray(function(err,result) {
      if(err) throw err;
      console.log(result);
      res.send(result);
      db.close();
    });
 })
})


//+/ Get all records in the system//////////////////////////////////////////////////////////////////////////////////////////////////////////////

server.get('/records', function (req, res, next) {
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital");
    dbo.collection("records").find().toArray(function(err,result){
      if(err) throw err;
      console.log(result);
      res.send(result);
      db.close();
    });
   })
  })


//+/ POST - create a new patient ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

 server.post('/patients', function (req, res, next) {
console.log("1");
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
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital");
    dbo.collection("patients").insertOne(newPatient, function(err, res2) {
      if (err) throw err;
      console.log(newPatientJSON);
        res.send(201, newPatient);
        db.close();
    });
   })
})

//+/ POST - create new record for a patient by patient id and record type////////////////////////////////////////////////////////////////////////

server.post('/patients/:id/recordType/:recordType', function (req, res, next) {

  //Make sure name is defined
  if (req.params.id === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('patient id must be supplied'))
  }
  if (req.params.recordType === undefined ) {
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
  if (req.params.isCritical === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('isCritical must be supplied'))
  }

  var newRecord = {
    patient_id: ObjectId(req.params.id), 
    recordType: req.params.recordType, 
    recordValue: req.params.recordValue, 
    recordUom: req.params.recordUom,
    isCritical: Boolean(req.params.isCritical=='true')
	}

  var newRecordJSON = JSON.stringify(newRecord);
  console.log(newRecordJSON);
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital");
    dbo.collection("records").insertOne(newRecord, function(err, res2) {
      if (err) throw err;
      console.log("record inserted");
      console.log(JSON.stringify(res2));
      var name1 = 'patient_id';
      var value1 = ObjectId(req.params.id);
      var name2 = 'recordType';
      var value2 = req.params.recordType;
      var name3 = 'recordUom';
      var value3 = req.params.recordUom;
      var name4 = 'isCritical';
      var value4 = Boolean(req.params.isCritical=='true');
      var query = {};
      query[name1] = value1;
      query[name2] = value2;
      query[name3] = value3;
      query[name4] = value4;
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

//+/ Delete all patients and their records //////////////////////////////////////////////////////////////////////////////////////////////////////

server.del('/patients/all', function (req, res, next) {
  console.log("patients/all");
    MongoClient.connect(url, function(err,db){
      if(err) throw err;
      var dbo = db.db("hospital");
  
      dbo.collection("patients").deleteMany({}, function(err, res2) {
        if (err) throw err;
        console.log("patients deleted");
        dbo.collection("records").deleteMany({}, function(err, res3) {
          if (err) throw err;
          console.log("records deleted");
          res.send(201, "deleted")
          db.close();
        });
      });
     })
  })
//+/ Delete patient's records by patient id and record type//////////////////////////////////////////////////////////////////////////////////////
// Delete all Blood Pressure or all Respiratory Rate ...
server.del('/patients/:id/recordType/:recordType', function (req, res, next) {
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital");
    var name1 = 'patient_id';
    var value1 = ObjectId(req.params.id);
    var name2 = 'recordType';
    var value2 = req.params.recordType;
    var query = {};
    query[name1] = value1;
    query[name2] = value2;
    dbo.collection("records").deleteMany(query, function(err, res2) {
      if (err) throw err;
      console.log("record deleted");
      res.send(201, "deleted")
      db.close();
    });
   })
  })


// Delete a single patient by patient id //////////////////////////////////////////////////////////////////////////////////////////////////

server.del('/patients/:id', function (req, res, next) {
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital");
    var name = '_id';
    var value = ObjectId(req.params.id);
    var query = {};
    query[name] = value;
    dbo.collection("patients").deleteOne(query, function(err, res2) {
      if (err) throw err;
      console.log("patient deleted");
      res.send(201, "patient deleted")
      db.close();
    });
   })
  })

//+/ Delete patient's records by patient id /////////////////////////////////////////////////////////////////////////////////////////////////////

server.del('/patients/:id/records', function (req, res, next) {
  console.log("START DELETE");
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital");
    var name = 'patient_id';
    var value = ObjectId(req.params.id);
    var query = {};
    query[name] = value;
    console.log(JSON.stringify(query));
    dbo.collection("records").deleteMany(query, function(err, res2) {
      if (err) throw err;
      console.log("records deleted");
      res.send(201, "deleted")
      db.close();
    });
   })
})

//+/ Delete single record by record id /////////////////////////////////////////////////////////////////////////////////////////////////////

server.del('/records/:id', function (req, res, next) {
  console.log("START DELETE");
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital");
    var name = '_id';
    var value = ObjectId(req.params.id);
    var query = {};
    query[name] = value;
    console.log(JSON.stringify(query));
    dbo.collection("records").deleteOne(query, function(err, res2) {
      if (err) throw err;
      console.log("record deleted");
      res.send(201, "deleted")
      db.close();
    });
   })
})

//+/ Update a patient by their id
server.put('/patients/:id', function (req, res, next) {

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
//var newPatientJSON = JSON.stringify(newPatient);
MongoClient.connect(url, function(err,db){
  if(err) throw err;
  var dbo = db.db("hospital");
  //var myquery = { patient_id: req.params.patient_id };
  var myquery = { _id: ObjectId(req.params.id) };
  console.log("query=" + JSON.stringify(myquery));
  var newPatient_updated = {$set:newPatient};
  //var newPatientJSON1 = JSON.stringify(newPatient1);
  dbo.collection("patients").updateOne(myquery, newPatient_updated, function(err, res2) {
    if (err) throw err;
    console.log("patient updated");
    console.log(newPatient);
    res.send(201, newPatient);
    db.close();
  });
 })
})


//+/ Update a record by record id
server.put('records/:id', function (req, res, next) {
console.log("record update");
  // if (req.params._id === undefined ) {
  //   // If there are any errors, pass them to next in the correct format
  //   return next(new restify.InvalidArgumentError('record id must be supplied'))
  // }

  // if (req.params.patient_id === undefined ) {
  //   // If there are any errors, pass them to next in the correct format
  //   return next(new restify.InvalidArgumentError('patient id must be supplied'))
  // }
  if (req.params.recordType === undefined ) {
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
  if (req.params.isCritical === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('isCritical must be supplied'))
  }

  var newRecord = {
   // _id: ObjectId(req.params._id),
    recordType: req.params.recordType, 
    recordValue: req.params.recordValue, 
    recordUom: req.params.recordUom,
    isCritical: Boolean(req.params.isCritical=='true')
	}
  //var newPatientJSON = JSON.stringify(newPatient);
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("hospital");
    var myquery = { _id: ObjectId(req.params.id) };
    var newRecord_updated = {$set:newRecord};
    dbo.collection("records").updateOne(myquery, newRecord_updated, function(err, res2) {
      if (err) throw err;
      console.log("record updated");
      console.log(newRecord);
      res.send(201, newRecord);
      db.close();
    });
   })
  })

  
  
