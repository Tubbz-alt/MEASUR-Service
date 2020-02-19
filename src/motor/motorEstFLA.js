var psat = require("../../node_modules/amo-tools-suite/build/Release/psat.node");
var express = require('express');
exports.CalculateMotorEstFLA = function(req,res)
{
	var motorEstFLA =
	{	load_factor: 1,
		motor_rated_power: 1,
		motor_rated_speed: 1,
		efficiency_class:1,
		efficiency: 1,
		line_frequency: 1,
		motor_rated_voltage: 1
	};

	var errorMessage = "";
	



	if(req.query.motorRatedPower && parseFloat(req.query.motorRatedPower) >= 0)
	{
		motorEstFLA.motor_rated_power = parseFloat(req.query.motorRatedPower);
	}
	else
	{
		errorMessage += "Motor Rated Power was sent an incorrect value.";
	}
	if(req.query.motorRatedSpeed && parseFloat(req.query.motorRatedSpeed) >= 0)
	{
		motorEstFLA.motor_rated_speed = parseFloat(req.query.motorRatedSpeed);
	}
	else
	{
		errorMessage += "Motor Rated Speed was sent an incorrect value.";
	}

if(req.query.efficiencyClass  && parseFloat(req.query.efficiencyClass) >= 0 &&parseFloat(req.query.efficiencyClass) <=3)
	{
		motorEstFLA.efficiency_class = parseFloat(req.query.efficiencyClass);
		
		if(parseFloat(motorEstFLA.efficiency_class)==3)
		{
			if(req.query.efficiency && parseFloat(req.query.efficiency) >= 0)
			{
				motorEstFLA.efficiency = parseFloat(req.query.efficiency);
			}
			else
			{
				errorMessage += "Efficiency was sent an incorrect value.";
			}
		}
	}
	else
	{
		errorMessage += "Efficiency class was sent an incorrect value.";
	}
	if(req.query.lineFrequency && parseFloat(req.query.lineFrequency) >= 0 && req.query.lineFrequency <=1)
	{
		motorEstFLA.line_frequency = parseFloat(req.query.lineFrequency);
	}
	else
	{
		errorMessage += "Line Frequency was sent an incorrect value. ";
		
	}
	if(req.query.motorRatedVoltage && parseFloat(req.query.motorRatedVoltage) >= 0)
	{
		motorEstFLA.motor_rated_voltage = parseFloat(req.query.motorRatedVoltage);
	}
	else
	{
		errorMessage += "Motor Rated Voltage was sent an incorrect value.";
	}
	
	
	
	
var MotorPer = psat.nema(motorEstFLA);
res.json([MotorPer,errorMessage]);
}
