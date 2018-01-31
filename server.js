var express=require("express")
var app=express()
const https=require("https");
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
var router = express.Router();

var server = require('http').Server(app);

var url="https://api.fixer.io/latest?base=";//url for which exchange rate request is made

//var path = require('path');
//var rt=path.join(__dirname, 'currency-names.json');
//var names=require(rt);
var names=JSON.parse('{"USD":"US dollars","CAD": "Canadian dollars","EUR": "euros","AED":"UAE dirhams","AFN":"Afghan Afghanis","ALL":"Albanian lekë","AMD":"Armenian drams","ARS":  "Argentine pesos", "AUD":"Australian dollars", "AZN":"Azerbaijani manats","BAM": "Bosnia-Herzegovina convertible marks", "BDT": "Bangladeshi takas", "BGN":"Bulgarian leva", "BHD":"Bahraini dinars","BIF":"Burundian francs",  "BND":"Brunei dollars", "BOB":"Bolivian bolivianos","BRL": "Brazilian reals","BWP": "Botswanan pulas", "BYR":"Belarusian rubles", "BZD":"Belize dollars", "CDF":"Congolese francs","CHF":"Swiss francs","CLP":"Chilean pesos","CNY":"Chinese yuan", "COP":"Colombian pesos","CRC":"Costa Rican colóns",  "CVE": "Cape Verdean escudos","CZK":"Czech Republic korunas", "DJF":"Djiboutian francs", "DKK":"Danish kroner", "DOP":"Dominican pesos", "DZD":"Algerian dinars", "EEK":"Estonian kroons","EGP": "Egyptian pounds","ERN":"Eritrean nakfas", "ETB":"Ethiopian birrs","GBP":"British pounds sterling", "GEL": "Georgian laris","GHS":"Ghanaian cedis","GNF":"Guinean francs","GTQ":"Guatemalan quetzals","HKD": "Hong Kong dollars","HNL":"Honduran lempiras",  "HRK": "Croatian kunas", "HUF":"Hungarian forints", "IDR": "Indonesian rupiahs","ILS":"Israeli new sheqels", "INR":"Indian rupees",  "IQD":"Iraqi dinars","IRR": "Iranian rials", "ISK":"Icelandic krónur","JMD":"Jamaican dollars",  "JOD":"Jordanian dinars","KES": "Kenyan shillings", "JPY":"Japanese yen", "KHR":  "Cambodian riels", "KMF": "Comorian francs", "KRW":  "South Korean won", "KWD":"Kuwaiti dinars","KZT":"Kazakhstani tenges","LBP": "Lebanese pounds", "LKR": "Sri Lankan rupees", "LTL":"Lithuanian litai", "LVL":"Latvian lati",  "LYD": "Libyan dinars", "MAD":"Moroccan dirhams","MDL": "Moldovan lei","MGA":"Malagasy Ariaries", "MKD":"Macedonian denari",  "MMK":"Myanma kyats",  "MOP":"Macanese patacas",    "MUR":"Mauritian rupees",  "MXN":"Mexican pesos","MYR": "Malaysian ringgits", "MZN":"Mozambican meticals", "NAD": "Namibian dollars","NGN": "Nigerian nairas","NIO": "Nicaraguan córdobas", "NOK":"Norwegian kroner", "NPR":"Nepalese rupees","NZD": "New Zealand dollars","OMR":"Omani rials", "PAB":"Panamanian balboas","PEN":"Peruvian nuevos soles","PHP":"Philippine pesos","PKR":"Pakistani rupees", "PLN":"Polish zlotys","PYG":"Paraguayan guaranis", "QAR":"Qatari rials", "RON":"Romanian lei", "RSD": "Serbian dinars","RUB":"Russian rubles", "RWF":"Rwandan francs","SAR": "Saudi riyals","SDG":"Sudanese pounds", "SEK": "Swedish kronor","SGD":"Singapore dollars","SOS":"Somali shillings","SYP":"Syrian pounds","THB":"Thai baht","TND": "Tunisian dinars","TOP": "Tongan paʻanga","TRY": "Turkish Lira", "TTD":"Trinidad and Tobago dollars","TWD": "New Taiwan dollars","TZS":"Tanzanian shillings", "UAH":"Ukrainian hryvnias","UGX":"Ugandan shillings","UYU": "Uruguayan pesos","UZS":"Uzbekistan som","VEF":"Venezuelan bolívars", "VND": "Vietnamese dong","XAF":"CFA francs BEAC","XOF":"CFA francs BCEAO","YER":"Yemeni rials","ZAR":"South African rand","ZMK": "Zambian kwachas"}');



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
