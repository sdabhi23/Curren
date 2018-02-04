var express=require("express")
var app=express()
const https=require("https");
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
var router = express.Router();
var path    = require("path");

var names=require(__dirname+'/View/names.json');
var server = require('http').Server(app);

var url="https://api.fixer.io/latest?base=";//url for which exchange rate request is made




app.post("/webhook",function(req,res){
 
	
	var convert_to=req.body.result.parameters.convert_to[0]; // getting the POST data
	var amount=req.body.result.parameters.convert_from[0]["amount"];
	var convert_from=req.body.result.parameters.convert_from[0]["currency"];
		
	if (typeof(convert_to)==="undefined")
	{
		let output="Sorry, I couldn't get for which currency you want to convert.";
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({ 'speech': output, 'displayText': output }));

	}
	else
	{
	var exchange_rate;
	https.get(url+convert_from,resp=>
		{// make the get request to the api
			let data=""
			resp.on("data",(chunk)=>
			{// receives the data
				data+=chunk;
			});
			resp.on("end",()=>
			{// On end of the response calculate the final amount based on the parameters passed
				var response=(JSON.parse(data));
				exchange_rate=(response.rates[convert_to]);
				var c=exchange_rate*amount;
				if (isNaN(c))
				{
				 var output="Oh..Looks like both the currencies are same or somewhere I missed it..! Please try again..";
					// Return the results of the weather API to Dialogflow
					res.setHeader('Content-Type', 'application/json');
					 res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
					                                                                                  
				}
				else
				{
  				var ans=c.toFixed(4);
				var rand=Math.floor(Math.random() * Math.floor(4));
				switch(rand)
				{
					case 0:{
					var output=" "+amount+" " +names[convert_from]+" equals "+ans+" "+names[convert_to];
					break;
					}
					case 1:{
						var output="That will be "+ans+" "+names[convert_to];break;
					}
					case 2:{
						var output=" Answer is "+ans+" "+names[convert_to];break;
					}
					case 3:{
						var output=" "+amount+" " +names[convert_from]+" = "+ans+" "+names[convert_to];
						break;
						
					}	
					default:{
					var output=" "+amount+" " +names[convert_from]+" equals "+ans+" "+names[convert_to];
					}

				}

				// Return the results of the weather API to Dialogflow
				         res.setHeader('Content-Type', 'application/json');
				         res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
				}
			});

		}).on("error",err=>{
			var error="error"+err.message;	
			// If there is an error let the user know
			     res.setHeader('Content-Type', 'application/json');
			    res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
		});
	}
});
app.listen(8080,function(){
console.log("Server is running")});
