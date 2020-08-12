const Axios = require('axios');

/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  fetchAlljob: (req, res) => {
    Axios.get('https://a6-grp19-companyx.azurewebsites.net/jobs')
        .then((Response) => {
          console.log(Response.data);
          // const uniqueJobs = [...new Set(Response.data.map(x => x.id))];
          res.view('company-z/view', {jobs:Response.data});
        }).catch((err) => {
          return console.log(err.message);
        });
  },
  FetchParts: async (req, res) => {
    //checking user is logged in or not
    const userId = req.session.userId;
    console.log(userId);
    console.log(typeof userId);
    console.log(typeof userId === 'undefined');
    console.log(req.url);


    //if user is not logged in it will redirect to login page.
    if(typeof userId === 'undefined' || userId === ''){ return res.view('login', {url: req.path});}

    //* User will be logged in here.
    //Checking params if it is not empty.
    if(req.params.jobName === ''){ return console.log('Error'); }
    if(req.params.partId === ''){ return console.log('Error'); }
    if(req.params.qty === ''){ return console.log('Error'); }

    // Check if the order exists
    await Order.find({
      jobNameG19: req.params.jobName,
      userIdG19: userId.id,
      partIdG19: req.params.partId,
      resultG19: 1
    }).exec(async (err, order) => {
      if (err) { return res.serverError(err); }

      // if we have one record then we will reject it.
      if (typeof order !== 'undefined' && order.length > 0) {
        return res.view('company-z/error', {errorMessage:'ERROR!! Order alredy Exist..!!'});
      }
      // Else we will create one new record
      // Getting the data from the PartTable
      Axios.get('http://companyy-env.eba-2rb7qufu.us-east-1.elasticbeanstalk.com/parts/'+ req.params.partId)
        .then(async (response) => {
          console.log(response.data);
          if(response.data.success){
            // Check if we have enough qty to make the order.
            console.log('-----------------------------------');
            console.log(response.data.parts[0].qoh);
            console.log(req.params.qty);
            console.log(response.data.parts[0].qoh >= req.params.qty);
            console.log('-----------------------------------');

            // Checking if we have enough quantity
            if(response.data.parts[0].qoh >= req.params.qty){

              console.log('req.params.jobName ---> '+ req.params.jobName);
              console.log('userId.id ---> '+ userId.id);
              console.log('req.params.partId ---> '+ req.params.partId);
              console.log('req.params.qty ---> '+ req.params.qty);

              // if we have enough then create a record.
              var createOrder = await Order.create({
                jobNameG19: req.params.jobName,
                userIdG19: userId.id,
                partIdG19: req.params.partId,
                qtyG19: req.params.qty,
                resultG19: 1
              }).fetch();

              console.log(createOrder);

              // response from createOrder
              if(createOrder){
                console.log(createOrder);
                // Axios.all([
                // Change the QOH in partId Table
                // Axios.put('http://companyy-env.eba-2rb7qufu.us-east-1.elasticbeanstalk.com/update_part/'+ req.params.partId,{
                //   id: req.params.partId,
                //   partName: response.data.partName,
                //   qoh: response.data.parts[0].qoh-req.params.qty
                // }),
                Axios.post('http://companyy-env.eba-2rb7qufu.us-east-1.elasticbeanstalk.com/addOrder',{
                  partId: req.params.partId,
                  jobName: req.params.jobName,
                  userId: userId.id,
                  qnt: req.params.qty
                }).then((sendRecordX) => {
                  console.log('success----> ' + sendRecordX);
                }).catch((err) => {return console.log(err);});
                Axios.post('https://a6-grp19-companyx.azurewebsites.net/joborder',{
                  id: req.params.jobName,
                  partid: req.params.partId,
                  userid: userId.id,
                  quantity: req.params.qty
                }).then((sendRecordY) => {
                  console.log('success----> ' + sendRecordY);
                }).catch((err) => {return console.log(err);});
                // ]).then(Axios.spread(( sendRecordY, sendRecordX) => {
                //   // console.log('success----> ' + updatePartTable);
                //   // if(sendRecordY && sendRecordX.data){
                //   // }
                //   console.log('success----> ' + sendRecordX);
                //   console.log('success----> ' + sendRecordY);
                return res.view('company-z/success', {job:createOrder, txt:`Added the Job Post. Here it is:`});
                // })).catch((err) => { return res.serverError(err); });
              }
            } else {
              // if we do not have enough then create a record with result false.
              var createFalseOrder = await Order.create({
                jobNameG19: req.params.jobName,
                userIdG19: userId.id,
                partIdG19: req.params.partId,
                qtyG19: req.params.qty,
                resultG19: 0
              }).fetch();
              // Check if record created successfully
              if(createFalseOrder){
                return res.view('company-z/success', {job:createFalseOrder, txt:`Added the Job Post with result false. Here it is:`});
              }
            }
          }else{
            return res.view('company-z/error', {errorMessage:'We do not have any part with that id..!!'});
          }
        }).catch((err) => {return res.serverError(err);});
    });
  },
  displayFindPage: (req, res) => {
    res.view('company-z/find');
  },
  findJob: (req, res) => {
    if(typeof req.body.jobName === 'undefined' || req.body.jobName === ''){ return console.log(err.message); }
    Axios.post('https://a6-grp19-companyx.azurewebsites.net/jobs_by_id',{
      id: req.body.jobName
    }).then((resFindJob) => {
      if(typeof resFindJob !== 'undefined' && resFindJob.data.length > 0){
        return res.view('company-z/view', {jobs:resFindJob.data});
      } else{
        return res.view('company-z/error', {errorMessage:'No such Job exist.'});
      }
    }).catch((err) => { return res.serverError(err); });
  },
  getItems: (req, res) => {
    Axios.get(
      'https://4cydjjidid.execute-api.us-east-1.amazonaws.com/Dev',
      {headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
          'Access-Control-Allow-Headers': '*'
      }}
    ).then(itemRes => {
      if (itemRes.statusText === 'OK' && JSON.stringify(itemRes.data) !== '{}')  {
        console.log('__itemRes.data__', itemRes.data);
        res.view('company-z/view', { items: itemRes.data })
      } else {
        res.send({
          success: false,
          isError: false,
          message: 'Some problem in getting OK response.'
        })
      }
    }).catch(err => {
      console.log('__Error in fetching all items of supplier__', err);
    })
  },
  OrderItem: (req, res) => {
    // console.log('__req.params__', req.params);
    // console.log('__req.body__', req.body);
    const userId = req.session.userId;
    console.log(userId);
    if(typeof userId === 'undefined' || userId === ''){ 
      return res.view('login', {url: req.path});
    }
  }
};

