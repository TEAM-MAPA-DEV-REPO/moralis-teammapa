var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _ParseUser = _interopRequireDefault(require("./ParseUser"));

var _ParseQuery = _interopRequireDefault(require("./ParseQuery"));

var _ParseObject = _interopRequireDefault(require("./ParseObject"));

var _ParseACL = _interopRequireDefault(require("./ParseACL"));

var _createSigningData = _interopRequireDefault(require("./createSigningData"));

var web3EnablePromise = null;

var MoralisDot = function () {
  function MoralisDot() {
    (0, _classCallCheck2.default)(this, MoralisDot);
  }

  (0, _createClass2.default)(MoralisDot, null, [{
    key: "web3IsInjected",
    value: function () {
      return Object.keys(window.injectedWeb3).length !== 0;
    }
  }, {
    key: "enable",
    value: function (opts) {
      var _window$injectedWeb, _window$injectedWeb$t;

      var type,
          _args = arguments;
      return _regenerator.default.async(function (_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              type = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'polkadot-js';

              if (!web3EnablePromise) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", web3EnablePromise);

            case 3:
              web3EnablePromise = (_window$injectedWeb = window.injectedWeb3) == null ? void 0 : (_window$injectedWeb$t = _window$injectedWeb[type]) == null ? void 0 : _window$injectedWeb$t.enable(opts);
              return _context.abrupt("return", web3EnablePromise);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, null, Promise);
    }
  }, {
    key: "authenticate",
    value: function (opts) {
      var _opts$name;

      var allAccounts, account, address, dotAddress, accounts, message, data, signature, authData, user;
      return _regenerator.default.async(function (_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _regenerator.default.awrap(MoralisDot.enable((_opts$name = opts == null ? void 0 : opts.name) != null ? _opts$name : 'Moralis'));

            case 2:
              MoralisDot.web3 = _context2.sent;
              _context2.next = 5;
              return _regenerator.default.awrap(MoralisDot.web3.accounts.get());

            case 5:
              allAccounts = _context2.sent;
              account = allAccounts[0];
              address = account == null ? void 0 : account.address;

              if (address) {
                _context2.next = 10;
                break;
              }

              throw new Error('Address not found');

            case 10:
              dotAddress = address;
              accounts = [dotAddress];
              message = MoralisDot.getSigningData();
              _context2.next = 15;
              return _regenerator.default.awrap((0, _createSigningData.default)(message));

            case 15:
              data = _context2.sent;
              _context2.next = 18;
              return _regenerator.default.awrap(MoralisDot.sign(address, data));

            case 18:
              signature = _context2.sent;
              authData = {
                id: dotAddress,
                signature: signature,
                data: data
              };
              _context2.next = 22;
              return _regenerator.default.awrap(_ParseUser.default.logInWith('moralisDot', {
                authData: authData
              }));

            case 22:
              user = _context2.sent;

              if (user) {
                _context2.next = 25;
                break;
              }

              throw new Error('Could not get user');

            case 25:
              _context2.next = 27;
              return _regenerator.default.awrap(user.setACL(new _ParseACL.default(user)));

            case 27:
              user.addAllUnique('dotAccounts', accounts);
              user.set('dotAddress', dotAddress);
              _context2.next = 31;
              return _regenerator.default.awrap(user.save());

            case 31:
              return _context2.abrupt("return", user);

            case 32:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, null, Promise);
    }
  }, {
    key: "link",
    value: function (account, options) {
      var message, user, dotAddress, DotAddress, query, dotAddressRecord, data, signature, authData;
      return _regenerator.default.async(function (_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              message = (options == null ? void 0 : options.signingMessage) || MoralisDot.getSigningData();
              _context3.next = 3;
              return _regenerator.default.awrap(_ParseUser.default.current());

            case 3:
              user = _context3.sent;
              dotAddress = account;
              DotAddress = _ParseObject.default.extend('_DotAddress');
              query = new _ParseQuery.default(DotAddress);
              _context3.next = 9;
              return _regenerator.default.awrap(query.get(dotAddress).catch(function () {
                return null;
              }));

            case 9:
              dotAddressRecord = _context3.sent;

              if (dotAddressRecord) {
                _context3.next = 20;
                break;
              }

              _context3.next = 13;
              return _regenerator.default.awrap((0, _createSigningData.default)(message));

            case 13:
              data = _context3.sent;
              _context3.next = 16;
              return _regenerator.default.awrap(MoralisDot.sign(dotAddress, data));

            case 16:
              signature = _context3.sent;
              authData = {
                id: dotAddress,
                signature: signature,
                data: data
              };
              _context3.next = 20;
              return _regenerator.default.awrap(user.linkWith('moralisDot', {
                authData: authData
              }));

            case 20:
              user.addAllUnique('dotAccounts', [dotAddress]);
              user.set('dotAddress', dotAddress);
              _context3.next = 24;
              return _regenerator.default.awrap(user.save());

            case 24:
              return _context3.abrupt("return", user);

            case 25:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, null, Promise);
    }
  }, {
    key: "unlink",
    value: function (account) {
      var _user$get;

      var accountsLower, DotAddress, query, dotAddressRecord, user, accounts, nextAccounts;
      return _regenerator.default.async(function (_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              accountsLower = account;
              DotAddress = _ParseObject.default.extend('_DotAddress');
              query = new _ParseQuery.default(DotAddress);
              _context4.next = 5;
              return _regenerator.default.awrap(query.get(accountsLower));

            case 5:
              dotAddressRecord = _context4.sent;
              _context4.next = 8;
              return _regenerator.default.awrap(dotAddressRecord.destroy());

            case 8:
              _context4.next = 10;
              return _regenerator.default.awrap(_ParseUser.default.current());

            case 10:
              user = _context4.sent;
              accounts = (_user$get = user.get('dotAccounts')) != null ? _user$get : [];
              nextAccounts = accounts.filter(function (v) {
                return v !== accountsLower;
              });
              user.set('dotAccounts', nextAccounts);
              user.set('dotAddress', nextAccounts[0]);
              _context4.next = 17;
              return _regenerator.default.awrap(user._unlinkFrom('moralisDot'));

            case 17:
              _context4.next = 19;
              return _regenerator.default.awrap(user.save());

            case 19:
              return _context4.abrupt("return", user);

            case 20:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, null, Promise);
    }
  }, {
    key: "sign",
    value: function (address, data) {
      var web3, _await$web3$signer$si, signature;

      return _regenerator.default.async(function (_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (web3EnablePromise) {
                _context5.next = 2;
                break;
              }

              throw new Error('Must enable MoralisDot');

            case 2:
              _context5.next = 4;
              return _regenerator.default.awrap(web3EnablePromise);

            case 4:
              web3 = _context5.sent;

              if (web3.signer) {
                _context5.next = 7;
                break;
              }

              throw new Error('No signer found');

            case 7:
              _context5.next = 9;
              return _regenerator.default.awrap(web3.signer.signRaw({
                address: address,
                data: stringToHex(data),
                type: 'bytes'
              }));

            case 9:
              _await$web3$signer$si = _context5.sent;
              signature = _await$web3$signer$si.signature;
              return _context5.abrupt("return", signature);

            case 12:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, null, Promise);
    }
  }, {
    key: "getSigningData",
    value: function () {
      return 'Moralis Authentication';
    }
  }]);
  return MoralisDot;
}();

var _default = MoralisDot;
exports.default = _default;

function stringToHex(value) {
  return toHexString(stringToU8a(value));
}

function stringToU8a(value) {
  var u8a = new Uint8Array(value.length);

  for (var i = 0; i < value.length; i++) {
    u8a[i] = value.charCodeAt(i);
  }

  return u8a;
}

function toHexString(byteArray) {
  return "0x" + Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}