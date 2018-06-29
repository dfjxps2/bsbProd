dhtmlxValidation = function() {
};
dhtmlxValidation.prototype = {
    trackInput : function(el, rule, callback_error, callback_correct) {
        dhtmlxEvent(el, "keyup", function(e) {
                    if (!dhtmlxValidation.checkInput(el, rule)) {
                        if (!callback_error || callback_error(el, el.value, rule))
                            el.className += " dhtmlx_live_validation_error"
                    } else {
                        el.className = el.className.replace(/[ ]*dhtmlx_live_validation_error/g, "");
                        if (callback_correct)
                            callback_correct(el, el.value, rule)
                    }
                })
    },
    checkInput : function(input, rule) {
        return this.checkValue(input.value, rule)
    },
    checkValue : function(value, rule) {
        if (!rule)
            return;
        if (typeof rule != "string" && rule.length) {
            var final_res = true;
            for (var i = 0; i < rule.length; i++) {
                var res = this.checkValue(value, rule[i]);
                final_res = final_res && res
            };
            return final_res
        };
        if (!this["is" + rule])
            alert("Incorrect validation rule: " + rule);
        return this["is" + rule](value)
    },
    isEmpty : function(value) {
        return value == ''
    },
    isNotEmpty : function(value) {
        return !value == ''
    },
    isValidBoolean : function(value) {
        return !!value.match(/^(0|1|true|false)$/)
    },
    isValidEmail : function(value) {
        return !!value.match(/(^[a-z]([a-z_\.]*)@([a-z_\.]*)([.][a-z]{3})$)|(^[a-z]([a-z_\.]*)@([a-z_\-\.]*)(\.[a-z]{2,3})$)/i)
    },
    isValidInteger : function(value) {
        return !!value.match(/(^-?\d+$)/)
    },
    isValidNumeric : function(value) {
        return !!value.match(/(^-?\d\d*[\.|,]\d*$)|(^-?\d\d*$)|(^-?[\.|,]\d\d*$)/)
    },
    isValidAplhaNumeric : function(value) {
        return !!value.match(/^[_\-a-z0-9]+$/gi)
    },
    isValidDatetime : function(value) {
        var dt = value.match(/^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/);
        return dt && !!(dt[1] <= 9999 && dt[2] <= 12 && dt[3] <= 31 && dt[4] <= 59 && dt[5] <= 59 && dt[6] <= 59) || false
    },
    isValidDate : function(value) {
        var d = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        return d && !!(d[1] <= 9999 && d[2] <= 12 && d[3] <= 31) || false
    },
    isValidTime : function(value) {
        var t = value.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
        return t && !!(t[1] <= 24 && t[2] <= 59 && t[3] <= 59) || false
    },
    isValidIPv4 : function(value) {
        var ip = value.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
        return ip && !!(ip[1] <= 255 && ip[2] <= 255 && ip[3] <= 255 && ip[4] <= 255) || false
    },
    isValidCurrency : function(value) {
        return value.match(/^\$?\s?\d+?[\.,\,]?\d+?\s?\$?$/) && true || false
    },
    isValidSSN : function(value) {
        return value.match(/^\d{3}\-?\d{2}\-?\d{4}$/) && true || false
    },
    isValidSIN : function(value) {
        return value.match(/^\d{9}$/) && true || false
    }
};
dhtmlxValidation = new dhtmlxValidation();
dhtmlXGridObject.prototype.enableValidation = function(mode, live) {
    mode = convertStringToBoolean(mode);
    if (mode) {
        this._validators = {
            data : []
        }
    } else
        this._validators = false;
    if (arguments.length > 1)
        this._validators._live = live;
    if (!this._validators._event)
        this._validators._event = this.attachEvent("onEditCell", this.validationEvent)
};
dhtmlXGridObject.prototype.setColValidators = function(vals) {
    if (!this._validators)
        this.enableValidation(true);
    if (typeof vals == "string")
        vals = vals.split(this.delim);
    this._validators.data = vals
};
dhtmlXGridObject.prototype.validationEvent = function(stage, id, ind, newval, oldval) {
    var v = this._validators;
    if (!v)
        return true;
    var rule = (v.data[ind] || this.cells(id, ind).getAttribute("validate")) || "";
    if (stage == 1 && rule) {
        var ed = this.editor || this._fake.editor;
        ed.cell.className = ed.cell.className.replace(/[ ]*dhtmlx_validation_error/g, "");
        if (v._live) {
            var grid = this;
            dhtmlxValidation.trackInput(ed.getInput(), rule, function(element, value, rule) {
                        return grid.callEvent("onLiveValidationError", [id, ind, value, element, rule])
                    }, function(element, value, rule) {
                        return grid.callEvent("onLiveValidationCorrect", [id, ind, value, element, rule])
                    })
        }
    };
    if (stage == 2)
        this.validateCell(id, ind, rule, newval);
    return true
};
dhtmlXGridObject.prototype.validateCell = function(id, ind, rule, value) {
    rule = rule || (this._validators.data[ind] || this.cells(id, ind).getAttribute("validate"));
    value = value || this.cells(id, ind).getValue();
    if (!rule)
        return;
    if (!dhtmlxValidation.checkValue(value, rule.split(","))) {
        if (this.callEvent("onValidationError", [id, ind, value, rule])) {
            this.cells(id, ind).cell.className += " dhtmlx_validation_error"
        };
        return false
    } else
        this.callEvent("onValidationCorrect", [id, ind, value, rule]);
    return true
};