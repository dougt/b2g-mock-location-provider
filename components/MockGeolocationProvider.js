
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");

const Ci = Components.interfaces;
const Cc = Components.classes;

let gLoggingEnabled = true;

function LOG(aMsg) {
  if (gLoggingEnabled)
  {
    aMsg = "*** MOCK GEO: " + aMsg + "\n";
    Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService).logStringMessage(aMsg);
    dump(aMsg);
  }
}

LOG("*******************************************************************");

function GeoCoordsObject(lat, lon, acc, alt, altacc) {
  this.latitude = lat;
  this.longitude = lon;
  this.accuracy = acc;
  this.altitude = alt;
  this.altitudeAccuracy = altacc;
}

GeoCoordsObject.prototype = {

  QueryInterface:  XPCOMUtils.generateQI([Ci.nsIDOMGeoPositionCoords]),

  classInfo: XPCOMUtils.generateCI({interfaces: [Ci.nsIDOMGeoPositionCoords],
                                    flags: Ci.nsIClassInfo.DOM_OBJECT,
                                    classDescription: "geo position coords object"}),
};

function GeoPositionObject(lat, lng, acc) {
  this.coords = new GeoCoordsObject(lat, lng, acc, 0, 0);
  this.address = null;
  this.timestamp = Date.now();
}

GeoPositionObject.prototype = {

  QueryInterface:   XPCOMUtils.generateQI([Ci.nsIDOMGeoPosition]),

  // Class Info is required to be able to pass objects back into the DOM.
  classInfo: XPCOMUtils.generateCI({interfaces: [Ci.nsIDOMGeoPosition],
                                    flags: Ci.nsIClassInfo.DOM_OBJECT,
                                    classDescription: "geo location position object"}),
};

function GeoPositionProvider() {
  this.timer = null;
  this.started = false;
}

GeoPositionProvider.prototype = {
  classID:          Components.ID("{77DA64D3-7458-4920-9491-86CC9914F904}"),
  QueryInterface:   XPCOMUtils.generateQI([Ci.nsIGeolocationProvider,
                                           Ci.nsITimerCallback]),
  startup:  function() {
    if (this.started)
      return;

    this.started = true;

    this.timer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
    this.timer.initWithCallback(this, 1000, this.timer.TYPE_REPEATING_SLACK);
  },

  watch: function(c) {
  },

  shutdown: function() { 
    LOG("shutdown called");

    if (this.timer != null) {
      this.timer.cancel();
      this.timer = null;
    }

    this.started = false;
  },

  setHighAccuracy: function(enable) {
  },

  notify: function (timer) {
      let newLocation = new GeoPositionObject(37.388120,
                                              -122.083026,
                                              10);

      let update = Cc["@mozilla.org/geolocation/service;1"].getService(Ci.nsIGeolocationUpdate);
      update.update(newLocation);
  },
};

this.NSGetFactory = XPCOMUtils.generateNSGetFactory([GeoPositionProvider]);
