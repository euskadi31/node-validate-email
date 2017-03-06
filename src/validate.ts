import * as dns from 'dns';

const emailRegexp = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/;

const hostnameSpecificRules = [
    {
        hostname: /g(oogle)?mail\.com/i,
        validate: (username: string): boolean => {
            const length = username.split('+')[0].length;
            if (length < 6 || length > 30) {
                return false;
            }

            return true;
        },
    },
    {
        hostname: /yahoo\.(com|[a-z]{2})/i,
        validate: (username: string): boolean => {
        if (username.length < 4) {
            return false;
        }

        return true;
    },
}];

function validUsernameForHostname(username: string, hostname: string): boolean {
    for (let rule of hostnameSpecificRules) {
        if (rule.hostname.test(hostname)) {
            return rule.validate(username);
        }
    }

    return true;
}

function dnsResolve(hostname: string, rrtype: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        dns.resolve(hostname, rrtype, (err, addresses) => {
            resolve(err === undefined);
        });
    });
}

export default class EmailValidator {
    constructor() {

    }

    public validate(email: string): Promise<boolean> {
        email = email.toLowerCase();

        if (!emailRegexp.test(email)) {
            return Promise.resolve(false);
        }

        const emailParts = email.split('@');
        const username = emailParts[0];
        const hostname = emailParts[1];

        if (!validUsernameForHostname(username, hostname)) {
            return Promise.resolve(false);
        }

        return dnsResolve(hostname, 'MX').then((valid) => {
            if (valid) {
                return true;
            }

            return dnsResolve(hostname, 'A');
        });
    }
}
