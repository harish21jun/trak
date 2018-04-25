exports.createTrak = function(req, response,next) {
  var fs = require("fs");
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
  var request = require('request');
  var formidable = require('formidable');
  var jiraAPIRequest="";
  var jiraRequestBody="";


var jiraEnv = process.env.JIRA_URL;
var jiraEnvAuth = process.env.JIRA_AUTH;
var jiraProjectKey = "TOCP_ADR";

var jiraBrowseURI ="";
   var options = {
       url: jiraEnv+"/rest/api/2/issue",
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         "Authorization": jiraEnvAuth
       }
   };

var strDescription="";
var newpath="";
var descriptionObj="";
var summary="";
  var form = new formidable.IncomingForm();
  var filePath ="";
  form.parse(req, function (err, fields, files) {

    if(fields){
      summary = "New ADR " + fields.stack  + " for " + fields.release + " | " + fields.env + " | " + fields.project;
        descriptionObj = {
              "Requested By" : fields.requestorId,
              "WBS Code" : fields.wbs,
              "Stack" : fields.stack ,
              "Target Release"  : fields.release ,
              "Target Date": fields.date,
              "Environment"      : fields.env ,
              "Project Name"       : fields.project ,
              "Mediation Name"   : fields.mediation,
              "Artifact Server" : fields.server,
              "Artifact(s)" : fields.artifact,
              "Artifact Directory" : fields.dir,
              "Pre-Install Script(s)" : fields.prescript,
              "Post-Install Script(s)" : fields.postscript,
              "Deployment Instruction(s)" : fields.instruction
          };
          strDescription = JSON.stringify(descriptionObj, null, 2);
          //console.log(strDescription);
          jiraAPIRequest = {
                 "fields": {
                     "project": {
                         "key": jiraProjectKey + ""
                     },
                     "summary": summary,
                     "description": strDescription + "",
                     "issuetype": {
                         "name": "Task" + ""
                     },
                     "reporter" : {
                         "name" : fields.requestorId + ""
                     },

                     "customfield_10011" : fields.artifact + "" ,
                     "assignee" : {
                           "name" : "x185293"+ ""

                          }
                 }
             };

            jiraRequestBody = JSON.stringify(jiraAPIRequest);
            //console.log("jiraRequestBody"+jiraRequestBody);

        if(files.filetoupload.name){
         var oldpath = files.filetoupload.path;
         newpath = __dirname+"/" + files.filetoupload.name;
         console.log(newpath);
           fs.rename(oldpath, newpath, function (err) {
              if (err) throw err;
                });
      }
    }

var req = request.post(options, function (err, resp, body) {
  if (err) {
    console.log('Error!'+err);
  } else {
    console.log("Issue creation was successful");
    console.log('body: ' + body);
    var jsonRes = JSON.parse(body);
    console.log(jsonRes.key);
    jiraBrowseURI =   jiraEnv+"/browse"+"/"+jsonRes.key

  console.log("Checking for attachment");


//has Attachement
     if(newpath.toString().trim() != ''){
    var optionsToAttach = {
        url: jiraEnv+"/rest/api/2/issue/"+jsonRes.key+"/attachments",
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": jiraEnvAuth,
            "X-Atlassian-Token": "no-check"
        }
    };
    var req = request.post(optionsToAttach, function (err, resp, body) {
      if (err) {
        console.log('Error!'+err);
      } else {
        console.log("Attachement was successful");
        fs.unlink(newpath, (err) => {
           if (err) throw err;
             console.log(newpath+' was deleted');
             });
        response.render('created', {
         page : 'home',
         title: 'TOCP Trak',
         jiraBrowseURI:jiraBrowseURI,
         key:jsonRes.key,
         errors: []
         });
      }
    });
    var form1 = req.form();
    form1.append('file', fs.createReadStream(newpath));
   }
   else{
   console.log("No attachment");
   response.render('created', {
    page : 'home',
    title: 'TOCP Trak',
    jiraBrowseURI:jiraBrowseURI,
    key:jsonRes.key,
    errors: []
    });
  }
 }
});
req.write(jiraRequestBody);
});
};
