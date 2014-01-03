(function(context){
	"use strict";
	
	var _url,
	fn = {};
	
	var URLManipulator = function(url){
		if(url){
			_setURL(url);
		}
		else{
			try{
				_setURL(context.location.href);
			}
			catch(error){
				throw('Global context does not seem to be a navigator.');
			}
		}
	};
	
	fn.getURL = function(){
		return _url;
	};
	
	var _setURL = function(newURL){
		_url = newURL;
	};
	
	var _isString = function(value){
		return typeof '' === typeof value;
	};
	
	fn.setParameter = function(key, value){
		var self = this;
		
		var _changeFragment = function(fragment){
			if(_valueIsValid(fragment)){
				self.setFragment(fragment);
			}
		};
		
		var _changeParameter = function(key, value){
			var urlParts = _getURLParts(self.getURL());
			var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");
			
			if (_valueIsValid(value))
				_setURL(self.getURL().replace(re, '$1' + key + "=" + value.toString() + '$2$3'));
			else{
				_setURL(urlParts.url.replace(re, '$1$3').replace(/(&|\?)$/, ''));
				_changeFragment(urlParts.fragment);
			}
		};
		
		var _createParameter = function(key, value){
			var urlParts = _getURLParts(self.getURL());
			
			if(_valueIsValid(value)){
				var separator = self.getURL().indexOf('?') !== -1 ? '&' : '?';
				_setURL(urlParts.url + separator + key + '=' + value.toString());
				_changeFragment(urlParts.fragment);
			}
		};
		
		if(_isString(key)){
			if(this.parameterExists(key))
				_changeParameter(key, value);
			else
				_createParameter(key, value);
		}
		else{
			var parameters = key;
			for(var parameterKey in parameters){
				if(parameters.hasOwnProperty(parameterKey)){
					var parameterValue = parameters[parameterKey];
					
					if(this.parameterExists(parameterKey))
						_changeParameter(parameterKey, parameterValue);
					else
						_createParameter(parameterKey, parameterValue);
				}
			}
		}
	};
	
	fn.clearParameters = function(){
		var re = new RegExp("(.*)\\?.*", "i");
		var newURL = this.getURL().replace(re,'$1');
		_setURL(newURL);
	};
	
	var _valueIsValid = function(value){
		return typeof value !== 'undefined' && value !== null;
	};
	
	var _getURLParts = function(url){
		var hash = url.split('#');
		if(hash.length > 2){
			throw("Invalid URL format! It should not have more than one '#' symbol.");
		}
		return {"url":hash[0], "fragment":hash[1]};
	};
	
	fn.getParameter = function(key){
		if(this.parameterExists(key)){
			var re = new RegExp("[?|&]" + key + "=(.*?)(&|#|$)", "i");
			var matches = this.getURL().match(re);
			var value = matches[1];
			return value;
		}
		return;
	};
	
	fn.parameterExists = function(key){
		var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");
		if(key){
			return re.test(this.getURL());
		}
		return false;
	};
	
	fn.getFragment = function(){
		return _getURLParts(this.getURL()).fragment;
	};
	
	fn.setFragment = function(value){
		var appendToURL = '';
		if(_valueIsValid(value)){
			appendToURL = '#' + value;
		}
		_setURL(_getURLParts(this.getURL()).url + appendToURL);
	};
	
	fn.submit = function(){
		context.location.href = this.getURL();
	};
	
	URLManipulator.prototype = fn;
	context.URLManipulator = URLManipulator;
})(this);