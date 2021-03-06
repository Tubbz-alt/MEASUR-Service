//http redirect port was not able to be changed dynamically so if the port is changed for the https server will need to be changed in the code as listed below
const http = require('http'); // for redirect only
const https = require('https');
const fs = require('fs');
const options ={
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
};
var forceSSL = require('express-force-ssl');

var express = require('express');
var app = express();
var port = process.env.port || 8080;

var httpPort = process.env.httpPort || 80

var server = http.createServer(app);
app.set('forceSSLOptions', {
	enable301Redirects: true,
	trustXFPHeader: false,
	httpsPort: 8080,//requires a change if the port run is not 8080
	sslRequiredMessage: 'SSL Required.'
  });

var unsecureServer = http.createServer(app);
var secureServer = https.createServer(options, app);


var psat = require("./node_modules/amo-tools-suite/build/Release/psat.node");


var phast = require("./node_modules/amo-tools-suite/build/Release/phast.node");

var pumpheadtool = require('./src/pump/pumpheadtool.js');
var pump = require('./src/pump/pump.js');
var flowAndEnergyUsed = require('./src/processHeating/flowAndEnergyUsed.js');

var o2Enrichment = require('./src/processHeating/O2Enrichment.js');

var pumpachievableefficiency = require("./src/pump/pumpachievableefficiency.js");
var energyElectric = require('./src/processHeating/energyEquivalencyElectric.js');
var humidityRatio = require('./src/processHeating/humidityRatio.js');
var efficiencyImprovement = require('./src/processHeating/efficiencyImprovement.js');
var auxiliaryPowerLoss=require('./src/processHeating/auxiliaryPowerLoss.js');
var energyInputEAF=require('./src/processHeating/energyInputEAF.js');
var fan = require("./src/fan/fan.js");

var fan203 = require('./src/fan/fan203.js');

var atmosphere = require("./src/processHeating/atmosphere.js");
var gasCoolingLosses = require('./src/processHeating/gasCoolingLosses.js');
var leakageLosses = require('./src/processHeating/leakageLosses.js');
var liquidCoolingLosses = require('./src/processHeating/liquidCoolingLosses.js');
var waterCoolingLosses=require('./src/processHeating/waterCoolingLosses.js');

var router = express.Router();
var steam = require('./src/steam/SteamAssessment.js')

var motor = require('./src/motor/motorPerformance.js');
var motorNEMA = require('./src/motor/motorNEMA.js')
var motorEstFLA = require('./src/motor/motorEstFLA.js');


var processHeating = require('./src/processHeating/processHeatingAssessment.js')






router.get('/processHeating/atmosphere', function(req, res)
{
	atmosphere.CalculateAtmosphere(req, res);
});

router.get('/processHeating/gasCoolingLosses', function(req, res)
{
	gasCoolingLosses.CalculateGasCoolingLosses(req, res);
});

router.get('/processHeating/leakageLosses', function(req, res)
{
	leakageLosses.CalculateLeakageLosses(req, res);
});

router.get('/processHeating/liquidCoolingLosses', function(req, res)
{
	liquidCoolingLosses.CalculateLiquidCoolingLosses(req, res);
});

router.get('/processHeating/waterCoolingLosses', function(req, res)
{
	waterCoolingLosses.CalculateWaterCoolingLosses(req, res);
});

router.get('/processHeating/energyInputEAF', function(req, res)
{
	energyInputEAF.CalculateEnergyInputEAF(req, res);
});
router.get('/processHeating/auxiliaryPowerLoss', function(req, res)
{
	auxiliaryPowerLoss.CalculateAuxiliaryPowerLoss(req, res);
});
router.get('/motor/motorEstFLA', function(req, res)
{
	motorEstFLA.CalculateMotorEstFLA(req, res);
});
router.get('/steam/SteamAssessment', function(req, res)
{
	steam.SteamBaseline(req, res);
});

router.get('/processHeating/assessment', function(req, res)
{
	processHeating.BaseLineAssessment(req, res);
});

router.get('/processHeating/flowAndEnergyUsed', function(req, res)
{
	flowAndEnergyUsed.CalculateFlowAndEnergyUsed(req, res);
});

router.get('/motor/motorNEMA', function(req, res)
{
	motorNEMA.CalculateMotorNEMA(req, res);
});

router.get('/processHeating/efficiencyImprovement', function(req, res)
{
	efficiencyImprovement.CalculateEfficiencyImprovement(req, res);
});

router.get('/processHeating/humidityRatio', function(req, res)
{
	humidityRatio.CalculateHumidityRatio(req, res);
});

router.get('/processHeating/o2Enrichment', function(req, res)
{
	o2Enrichment.Calculateo2Enrichment(req, res);
});

router.get('/energyEquivalencyElectric/energyEquivalencyElectric', function(req, res)
{
	energyElectric.CalculateEnergyEquivalencyElectric(req, res);
});


router.get('/motor/motorPerformance', function(req, res)
{
	motor.CalculateMotorPerformance(req, res);
});

router.get('/pumpheadtool/suctionGaugeElevation', function(req, res)
{
	pumpheadtool.CalculateSuctionGaugeElevation(req, res);
});

router.get('/pumpachievableefficiency/pumpefficiency',function(req,res)
{
    pumpachievableefficiency.CalculatePumpEfficiency(req,res);
});

router.get('/pumpheadtool/suctionTankElevation', function(req, res)
{
	pumpheadtool.CalculateSuctionTankElevation(req, res);
});

router.get('/pump/assessment', function(req, res)
{
	pump.CalculateCurrentPumpEfficiency(req, res);
});

router.get('/pump/modifiedAssessment', function(req, res)
{
	pump.CalculateModifiedPumpEfficiency(req, res);
});

router.get('/fan/assessment',function(req,res)
{
	fan.CalculateFanExisting(req,res);
});

router.get('/fan/modifiedAssessment',function(req,res)
{
	fan.CalculateFanModified(req,res);
});

router.get('/fan/CalculateFanTraverseAnalysis', function(req, res)
{
	fan203.CalculateFanTraverseAnalysis(req,res);
});
app.use(forceSSL);
secureServer.listen(port);
server.listen(httpPort);
app.use('/', router);

console.log("Listening on port number: " + port +" for the https server and listening to " + httpPort+ " for the HTTP redirect server");
