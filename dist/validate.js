"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dns = require("dns");
var emailRegexp = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/;
var hostnameSpecificRules = [
    {
        hostname: /g(oogle)?mail\.com/i,
        validate: function (username) {
            var length = username.split('+')[0].length;
            if (length < 6 || length > 30) {
                return false;
            }
            return true;
        },
    },
    {
        hostname: /yahoo\.(com|[a-z]{2})/i,
        validate: function (username) {
            if (username.length < 4) {
                return false;
            }
            return true;
        },
    }
];
function validUsernameForHostname(username, hostname) {
    for (var _i = 0, hostnameSpecificRules_1 = hostnameSpecificRules; _i < hostnameSpecificRules_1.length; _i++) {
        var rule = hostnameSpecificRules_1[_i];
        if (rule.hostname.test(hostname)) {
            return rule.validate(username);
        }
    }
    return true;
}
function dnsResolve(hostname, rrtype) {
    return new Promise(function (resolve, reject) {
        dns.resolve(hostname, rrtype, function (err, addresses) {
            resolve(err === undefined);
        });
    });
}
var EmailValidator = (function () {
    function EmailValidator() {
    }
    EmailValidator.prototype.validate = function (email) {
        email = email.toLowerCase();
        if (!emailRegexp.test(email)) {
            return Promise.resolve(false);
        }
        var emailParts = email.split('@');
        var username = emailParts[0];
        var hostname = emailParts[1];
        if (!validUsernameForHostname(username, hostname)) {
            return Promise.resolve(false);
        }
        return dnsResolve(hostname, 'MX').then(function (valid) {
            if (valid) {
                return true;
            }
            return dnsResolve(hostname, 'A');
        });
    };
    return EmailValidator;
}());
exports.default = EmailValidator;
//# sourceMappingURL=validate.js.map