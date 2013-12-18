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
	
	fn.setParameter = function(key, value){
		var hash = this.getURL().split('#');
		
		if(this.parameterExists(key)){
			var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");
			
			if (_valueIsValid(value)){
				_setURL(this.getURL().replace(re, '$1' + key + "=" + value.toString() + '$2$3'));
			}
			else{
				_setURL(hash[0].replace(re, '$1$3').replace(/(&|\?)$/, ''));
				if (typeof hash[1] !== 'undefined' && hash[1] !== null){
					_setURL(this.getURL() + '#' + hash[1]);
				}
			}
		}
		else{
			if(_valueIsValid(value)){
				var separator = this.getURL().indexOf('?') !== -1 ? '&' : '?';
				_setURL(hash[0] + separator + key + '=' + value.toString());
				if (typeof hash[1] !== 'undefined' && hash[1] !== null){
					_setURL(this.getURL() + '#' + hash[1]);
				}
			}
		}
	};
	
	var _valueIsValid = function(value){
		return typeof value !== 'undefined' && value !== null;
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
		var hash = this.getURL().split('#');
		return hash[1];
	};
	
	fn.submit = function(){
		context.location.href = this.getURL();
	};
	
	URLManipulator.prototype = fn;
	context.URLManipulator = URLManipulator;
})(this);