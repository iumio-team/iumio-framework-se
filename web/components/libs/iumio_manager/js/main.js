
/*
 * This is an iumio Framework component
 *
 * (c) RAFINA DANY <danyrafina@gmail.com>
 *
 * iumio Framework - iumio Components
 *
 * To get more information about licence, please check the licence file
 */

/**
 * iumio Framework Manager main JS
 **/


/**
 * Check if string does not contain any specials characters
 * @param str String to analyse
 * @returns {boolean} If string is valid
 */
var isValidStr = function (str) {
    return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
};

/**
 * Format a date
 * @param date Date to format
 * @returns {string} Date formatted
 */
var formatDate = function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

/**
 * Open or close a modal
 * @param instruction To close or open
 */
var modal = function (instruction) {
    $("#modalManager").modal(instruction)
};

/**
 * Modal operation is a success
 */
var operationSuccess = function () {
    var selecttorModal = $("#modalManager");
    selecttorModal.find(".modal-body").html("<h4 class='text-center'>Operation is a success</h4>");
    selecttorModal.find(".btn-close").html("Close");
    selecttorModal.find(".btn-valid").hide();
};

/**
 * Modal operation is an error
 */
var operationError = function (data) {
    var selecttorModal = $("#modalManager");
    selecttorModal.find(".modal-body").html("<h4 class='text-center'>An error was detected</h4>");
    if (typeof data["responseJSON"] !== "undefined" && typeof data["msg"] !== "undefined")
        selecttorModal.find(".modal-body").append("<h5 class='text-center' style='color: red'><em>"+data["responseJSON"]["msg"]+"</em></h5>");
    selecttorModal.find(".btn-close").html("Close");
    selecttorModal.find(".btn-valid").hide();
};


var noapp = false;

/**
 * get debug log (limited to 10 values)
 */
var getLogs = function () {
    var selector = $('.lastlog, .errorlastlog');
    if (typeof selector.attr("attr-href") === "undefined")
        return (1);

    $.ajax({
        url : selector.attr("attr-href"),
        type : 'GET',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                var results = data['results'];
                selector.html("");
                if (results.length === 0)
                    return (selector.append("<li>No logs</li>"));

                $.each(results, function (index, value) {
                    var datelog = formatDate(new Date(value['time'] * 1000));
                    selector.append("<li style='padding-top: 10px;'><ul><li>Date : "+datelog+"</li><li>IP : "+value['client_ip']+"</li> <li>UIDIE : <a href='"+value['log_url']+"'>"+value['uidie']+"</a> </li> <li>Message :  "+value['explain']+"</li></ul></li>");
                })

            }
        },
        error : function (data) {
            operationError(data);
        }
    });
};


/**
 * get routing file list
 */
var getRoutingList = function () {
    var selector = $('.routinglist');
    if (typeof selector.attr("attr-href") === "undefined")
        return (1);

    $.ajax({
        url : selector.attr("attr-href"),
        type : 'GET',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                var results = data['results'];
                selector.html("");
                selector.html("");
                if (results.length === 0)
                    return (selector.append("<tr><td colspan='6'>No routing file</td></tr>"));

                $.each(results, function (index, value) {
                    selector.append("<tr>" +
                        "<td>"+value['name']+"</td>" +
                        "<td>"+value['app']+"</td>" +
                        "<td>"+value['count_route']+"</td>" +
                        "<td><button class=' btn-info btn showrouting' attr-href='"+value['view']+"' attr-appname='"+value["app"]+"' attr-filename='"+value["name"]+"'>VI</button></td>"+
                        "<td><button class='btn-info btn todeleterouting' attr-href='"+value['remove']+"' attr-appname='"+value["app"]+"' attr-filename='"+value["name"]+"'>DE</button></td>"+
                        "</tr>");
                });

            }
        },
        error : function (data) {
            operationError(data);
        }
    });
};

/**
 * Infinite scroll for logs for dev
 */
$('.iumio-unlimited-log-display').bind('scroll', function(){
    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight)
        getUnlimitedLogs();
});

/**
 * Infinite scroll for logs for prod
 */
$('.iumio-unlimited-log-display2').bind('scroll', function(){
    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight)
        getUnlimitedLogs2();
});



/**
 * get debug log (unlimited) with min-max
 */
var pos = 0;
var call = 0;
var ajaxlogs = false;
var getUnlimitedLogs = function () {
    var selector = $('.logslist');
    if (typeof selector.attr("attr-href") === "undefined")
        return (1);
    if (ajaxlogs === true)
        return (1);
    ajaxlogs = true;
    $.ajax({
        url : selector.attr("attr-href"),
        type : 'POST',
        data : {'pos' : pos},
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                var results = (data['results']);
                if (results.length === 0 && call === 0)
                    return (selector.append("<tr><td colspan='6'>No logs</td></tr>"));

                $.each(results, function (index, value) {
                    var dateLog = formatDate(new Date(value['time'] * 1000));
                    selector.append("<tr>" +
                        "<td><a href='"+value['log_url']+"'>"+value['uidie']+"</a></td>" +
                        "<td>"+dateLog+"</td>" +
                        "<td>"+value['code']+"</td>" +
                        "<td>"+value['client_ip']+"</td>" +
                        "<td>"+value['method']+"</td>" +
                        "</tr>");
                });
                pos += results.length;
                $(".iumiocountlog").html(pos);
                call++;
                ajaxlogs = false;
                if (results.length <= 0)
                    return (1);


            }
        },
        error : function (data) {
            $(".loader-iumio-m").hide();
            operationError(data);
        }
    })
};

/**
 * get debug log (unlimited) with min-max for prod
 */
var pos2 = 0;
var call2 = 0;
var ajaxlogs2 = false;
var getUnlimitedLogs2 = function () {
    var selector = $('.logslist2');

    if (typeof selector.attr("attr-href") === "undefined")
        return (1);
    if (ajaxlogs2 === true)
        return (1);
    ajaxlogs2 = true;
    $.ajax({
        url : selector.attr("attr-href"),
        type : 'POST',
        data : {'pos' : pos2},
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                var results = (data['results']);
                if (results.length === 0 && call === 0)
                    return (selector.append("<tr><td colspan='6'>No logs</td></tr>"));

                $.each(results, function (index, value) {
                    var dateLog = formatDate(new Date(value['time'] * 1000));
                    selector.append("<tr>" +
                        "<td><a href='"+value['log_url']+"'>"+value['uidie']+"</a></td>" +
                        "<td>"+dateLog+"</td>" +
                        "<td>"+value['code']+"</td>" +
                        "<td>"+value['client_ip']+"</td>" +
                        "<td>"+value['method']+"</td>" +
                        "</tr>");
                });
                pos2 += results.length;
                $(".iumiocountlog2").html(pos2);
                call2++;
                ajaxlogs2 = false;
                if (results.length <= 0)
                    return (1);


            }
        },
        error : function (data) {
            $(".loader-iumio-m2").hide();
            operationError(data);
        }
    })
};


/**
 * get databases list
 */
var getDatabasesList = function () {
    var selector = $('.databaseslist');
    if (typeof selector.attr("attr-href") === "undefined")
        return (1);
    $.ajax({
        url : selector.attr("attr-href"),
        type : 'GET',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                var results = data['results'];
                selector.html("");
                if (results.length === 0)
                    return (selector.append("<tr><td colspan='6'>No database configuration</td></tr>"));

                $.each(results, function (index, value) {
                    selector.append("<tr>" +
                        "<td>"+index+"</td>" +
                        "<td>"+value['db_name']+"</td>" +
                        "<td>"+value['db_host']+"</td>" +
                        "<td>"+value['db_driver']+"</td>" +
                        "<td><button class=' btn-info btn toeditdatabase' attr-href='"+value['edit']+"' attr-href2='"+value['edit_save']+"' attr-dbconfig='"+index+"'>ED</button></td>"+
                        "<td><button class='btn-info btn todeletedatabase' attr-href='"+value['remove']+"' attr-dbconfig='"+index+"'>DE</button></td>"+
                        "</tr>");
                });
            }
        },
        error : function (data) {
            operationError(data);
        }
    });
};

/**
 * get smarty configuration list
 */
var getAllSmartyConfigs = function () {

    var selector = $('.smartyconfigs');
    if (typeof selector.attr("attr-href") === "undefined")
        return (1);
    $.ajax({
        url : selector.attr("attr-href"),
        type : 'GET',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                var results = data['results'];
                selector.html("");
                if (results.length === 0)
                    return (selector.append("<tr><td colspan='4'>No smarty configurations</td></tr>"));

                $.each(results, function (index, value) {
                    selector.append("<tr>" +
                        "<td>"+index+"</td>" +
                        "<td>"+((value['debug'] === true)? "Enabled" : "Disabled") +"</td>" +
                        "<td>"+((value['cache'] === 1)? "Enabled" : "Disabled")+"</td>" +
                        "<td>"+value['console_debug']+"</td>" +
                        "<td><button class=' btn-info btn editsmartyconfig' attr-href='"+value['edit']+"' attr-href2='"+value['save']+"' attr-config='"+index+"'>ED</button></td>"+
                        "</tr>");
                });
            }
        },
        error : function (data) {
            operationError(data);
        }
    });
};


/**
 * get app list
 */
var simpleapps = null;
var getAppListSimple = function () {

    var selector = $('.applist');
    if (typeof selector.attr("attr-href") === "undefined")
        return (1);
    $.ajax({
        url : selector.attr("attr-href"),
        type : 'GET',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                var results = data['results'];
                selector.html("");
                if (results.length === 0)
                    return (selector.append("<tr><td colspan='6'>No apps</td></tr>"));

                $.each(results, function (index, value) {
                    selector.append("<tr>" +
                        "<td>"+index+"</td>" +
                        "<td>"+value['name']+"</td>" +
                        "<td>"+value['enabled']+"</td>" +
                        "<td>"+((value['prefix'] !== "")? "/"+value['prefix'] : "no prefix")+"</td>" +
                        "<td>"+value['class']+"</td>" +
                        "<td><button class=' btn-info btn toeditapp' attr-href2='"+value['link_edit_save']+"' attr-appname='"+value['name']+"' attr-prefix='"+value['prefix']+"' attr-enabled='"+value['enabled']+"'>ED</button></td>"+
                        "<td><button class='btn-info btn deleteapp' attr-href='"+value['link_remove']+"' attr-appname='"+value['name']+"'>DE</button></td>"+
                        "<td><button class='btn-info btn exportapp' attr-href='"+value['link_export']+"' attr-appname='"+value['name']+"'>EXP</button></td>"+
                        "</tr>");
                });
                simpleapps = results;

            }
        },
        error : function (data) {
            operationError(data);
        }
    })
};

/**
 * get all cache environment
 */
var getAllCacheEnv = function () {

    var selector = $('.getAllEnvCache');
    if (typeof selector.attr("attr-href") === "undefined")
        return (1);
    $.ajax({
        url : selector.attr("attr-href"),
        type : 'GET',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                var results = data['results'];
                selector.html("");
                if (results.length === 0)
                    return (selector.append("<tr><td colspan='6'>No cache directory</td></tr>"));

                $.each(results, function (index, value) {
                    selector.append("<tr>" +
                        "<td>"+value['name']+"</td>" +
                        "<td>"+value['path']+"</td>" +
                        "<td>"+value['size']+"</td>" +
                        "<td "+((value['perms'] === true)? 'style="background-color:#2ECC40;color:white;text-align:center"' : 'style="background-color:rgb(255, 65, 65);color:white;text-align:center"')+">"+value['nperms']+"</td>" +
                        "<td>"+value['status']+"</td>" +
                        "<td><button class='btn-info btn clearcachespec' attr-href='"+value['clear']+"' attr-env='"+value['env']+"'>CL</button></td>"+
                        "</tr>");
                });

            }
        },
        error : function (data) {
            operationError(data);
        }
    })
};

/**
 * get all assets
 */
var getAllAssets = function () {

    var selector = $('.getAllAssets');
    if (typeof selector.attr("attr-href") === "undefined")
        return (1);
    $.ajax({
        url : selector.attr("attr-href"),
        type : 'GET',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                var results = data['results'];
                selector.html("");
                if (results.length === 0)
                    return (selector.append("<tr><td colspan='6'>No assets</td></tr>"));

                $.each(results, function (index, value) {
                    /**
                     * 0 : AppName
                     * 1 : Have assets (1 ==> contains assets, 0 ==> not exist,  2 ==> Empty)
                     * 3 : Perms on Dev
                     * 4 : Perms on Prod
                     * 5 : Status dev (0==> "Need to publish (redColor)", 1==> "OK (Green Color)")
                     * 6 : Status prod (0==> "Need to publish (redColor)", 1==> "OK (Green Color)")
                     * 7 : Action (Modal with url clear prod and dev , url publish prod and dev)
                     */
                    if (value['haveassets'] === 1) {
                        selector.append("<tr>" +
                            "<td>" + index + "</td>" +
                            "<td>" + value['name'] + "</td>" +
                            "<td>" + ((value['haveassets'] === 1) ? "Yes" : ((value['haveassets'] === 2) ? "Empty" : "No")) + "</td>" +
                            "<td>" + value['dev_perms'] + "</td>" +
                            "<td>" + value['prod_perms'] + "</td>" +
                            //"<td "+((value['perms'] === true)? 'style="background-color:#2ECC40;color:white;text-align:center"' : 'style="background-color:red;color:white;text-align:center"')+">"+value['nperms']+"</td>" +
                            "<td " + ((value['haveassets'] === 1) ? (((value['status_dev'] === 1) ? 'style="background-color:#2ECC40;color:white;"' : 'style="background-color:rgb(255, 65, 65);color:white;text-align:center"') + ">" + ((value['status_dev'] === 1) ? 'OK' : 'Need to publish')) : "Unavailable") + "</td>" +
                            "<td " + ((value['haveassets'] === 1) ? ((value['status_prod'] === 1) ? 'style="background-color:#2ECC40;color:white;"' : 'style="background-color:rgb(255, 65, 65);color:white;text-align:center"') + ">" + ((value['status_prod'] === 1) ? 'OK' : 'Need to publish') : "") + "</td>" +
                            ((value['haveassets'] === 1) ? "<td><button class='btn-info btn showoptionsassets' attr-href-clear-dev='" + value['clear']['dev'] + "' attr-href-clear-prod='" + value['clear']['prod'] + "' attr-href-publish-dev='" + value['publish']['dev'] + "'  attr-href-publish-prod='" + value['publish']['prod'] + "'  attr-href-clear-all='" + value['clear']['all'] + "' attr-href-publish-all='" + value['publish']['all'] + "' attr-appname='" + value['name'] + "' >AC</button></td>" : "<td>Unavailable</td>") +
                            "</tr>");
                    }
                });

            }
        },
        error : function (data) {
            operationError(data);
        }
    })
};


/**
 * get all compile environment
 */
var getAllCompileEnv = function () {

    var selector = $('.getAllEnvCompile');
    if (typeof selector.attr("attr-href") === "undefined")
        return (1);
    $.ajax({
        url : selector.attr("attr-href"),
        type : 'GET',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                var results = data['results'];
                selector.html("");
                if (results.length === 0)
                    return (selector.append("<tr><td colspan='6'>No compiled directory</td></tr>"));

                $.each(results, function (index, value) {
                    selector.append("<tr>" +
                        "<td>"+value['name']+"</td>" +
                        "<td>"+value['path']+"</td>" +
                        "<td>"+value['size']+"</td>" +
                        "<td "+((value['perms'] === true)? 'style="background-color:#2ECC40;color:white;text-align:center"' : 'style="background-color:rgb(255, 65, 65);color:white;text-align:center"')+">"+value['nperms']+"</td>" +
                        "<td>"+value['status']+"</td>" +
                        "<td><button class='btn-info btn clearcompilespec' attr-href='"+value['clear']+"' attr-env='"+value['env']+"'>CL</button></td>"+
                        "</tr>");
                });

            }
        },
        error : function (data) {
            operationError(data);
        }
    })
};




/**
 * Create on app
 */

var createOneApp = function (href) {
    var name           = $("input[type=text][name=appname]").val();
    var template       = $("input[type=checkbox][name=template]:checked" ).val();
    var enabled      = $( "input[type=checkbox][name=enabled]:checked" ).val();
    var prefix           = $("input[type=text][name=prefix]").val();
    var selecttorModal = $("#modalManager");

    if (name === "")
    {
        selecttorModal.find(".onealert").html("Oups! Enter an app name");
        selecttorModal.find(".onealert").show();
        return (false);
    }

    if (name === "App" || name.length <= 3 || !isValidStr(name))
    {
        selecttorModal.find(".onealert").html("Oups! Error on app name. <br>Your app name must to end with 'App' keyword (example TestApp) ");
        selecttorModal.find(".onealert").show();
        return (false);
    }
    var p2    = name[name.length - 1];
    var p1    = name[name.length - 2];
    var a     = name[name.length - 3];
    var conca = a + p1 + p2;

    if (conca !== "App" && isValidStr(name)) {
        selecttorModal.find(".onealert").html("Oups! Error on app name. <br>Your app name must to end with 'App' keyword (example TestApp) ");
        selecttorModal.find(".onealert").show();
        return (false);
    }

    if (typeof template !== "undefined")
        template = "yes";
    else
        template = "no";

    if (typeof enabled !== "undefined")
        enabled = "yes";
    else
        enabled = "no";

    selecttorModal.find(".onealert").hide();

    $.ajax({
        url : href,
        type : 'POST',
        dataType : 'json',
        data : {"name" : name, "template" : template, "enabled" : enabled, "prefix" : prefix},
        success : function(data){
            if (data['code'] === 200)
            {
                getAppListSimple();
                if (data['code'] === 200)
                    operationSuccess();
                else
                    operationError();
            }
            else
                operationError();
        },
        error : function (data) {
            operationError(data);
        }
    })
};


/**
 * save database configuration
 */

var saveDatabaseConfiguration = function (href) {
    var name           = $("input[type=text][name=name]").val();
    var host           = $("input[type=text][name=host]").val();
    var user           = $("input[type=text][name=user]").val();
    var password       = $("input[type=text][name=password]").val();
    var port           = $("input[type=number][name=port]").val();
    var driver         = $("input[type=text][name=driver]").val();

    var selecttorModal = $("#modalManager");

    if (name === ""  || host === ""  || user === ""  || password === ""  || driver === "" )
    {
        selecttorModal.find(".onealert").html("Oups! An error was detected");
        selecttorModal.find(".onealert").show();
        return (false);
    }

    selecttorModal.find(".onealert").hide();

    $.ajax({
        url : href,
        type : 'POST',
        dataType : 'json',
        data : {"name" : name, "host" : host, "user" : user, "password" : password, "port" : port, "driver" : driver},
        success : function(data){
            if (data['code'] === 200)
            {
                getDatabasesList();
                if (data['code'] === 200)
                    operationSuccess();
                else
                    operationError();
            }
            else
                operationError();
        },
        error : function (data) {
            operationError(data);
        }
    });
};

/**
 * save smarty configuration
 */

var saveSmartyConfiguration = function (href) {
    var debug           = $("input[type=checkbox][name=debug]:checked").val();
    var cache           = $("input[type=checkbox][name=cache]:checked").val();
    var compile         = $("input[type=checkbox][name=compile]:checked").val();
    var force           = $("input[type=checkbox][name=force]:checked").val();
    var sdebug          = $("input[type=checkbox][name=sdebug]:checked").val();
    var console         = $("input[type=checkbox][name=console]:checked").val();


    var selecttorModal = $("#modalManager");

    if (typeof debug !== "undefined")
        debug = true;
    else
        debug = false;

    if (typeof cache !== "undefined")
        cache = 1;
    else
        cache = 0;

    if (typeof compile !== "undefined")
        compile = true;
    else
        compile = false;

    if (typeof force !== "undefined")
        force = true;
    else
        force = false;

    if (typeof sdebug !== "undefined")
        sdebug = true;
    else
        sdebug = false;

    if (typeof console !== "undefined")
        console = "on";
    else
        console = "off";


    selecttorModal.find(".onealert").hide();

    $.ajax({
        url : href,
        type : 'POST',
        dataType : 'json',
        data : {"debug" : debug, "cache" : cache, "compile" : compile, "force" : force, "sdebug" : sdebug, "console" : console},
        success : function(data){
            if (data['code'] === 200)
            {
                getDatabasesList();
                if (data['code'] === 200)
                {
                    operationSuccess();
                    var selecttorModal = $("#modalManager");
                    selecttorModal.find(".btn-close").hide();
                    setTimeout(function () {
                        location.reload();
                    }, 5000)
                }
                else
                    operationError();
            }
            else
                operationError();
        },
        error : function (data) {
            operationError(data);
        }
    });
};


/**
 * save edit app
 */

var saveApp = function (href) {
    var prefix           = $("input[type=text][name=prefix]").val();
    var enabled           = $("input[type=checkbox][name=enabled]:checked").val();


    var selecttorModal = $("#modalManager");

    if (typeof enabled !== "undefined")
        enabled = "yes";
    else
        enabled = "no";

    selecttorModal.find(".onealert").hide();

    $.ajax({
        url : href,
        type : 'POST',
        dataType : 'json',
        data : {"prefix" : prefix, "enabled" : enabled},
        success : function(data){
            if (data['code'] === 200)
            {
                getDatabasesList();
                if (data['code'] === 200)
                {
                    getAppListSimple();
                    operationSuccess();
                }
                else
                    operationError();
            }
            else
                operationError();
        },
        error : function (data) {
            operationError(data);
        }
    });
};


/**
 * create database configuration
 */

var createDatabaseConfiguration = function (href) {
    var config         = $("input[type=text][name=config]").val();
    var name           = $("input[type=text][name=name]").val();
    var host           = $("input[type=text][name=host]").val();
    var user           = $("input[type=text][name=user]").val();
    var password       = $("input[type=text][name=password]").val();
    var port           = $("input[type=number][name=port]").val();
    var driver         = $("input[type=text][name=driver]").val();

    var selecttorModal = $("#modalManager");

    if (config === ""  || name === ""  || host === ""  || user === ""  || password === ""  || driver === "" )
    {
        selecttorModal.find(".onealert").html("Oups! An error was detected");
        selecttorModal.find(".onealert").show();
        return (false);
    }

    selecttorModal.find(".onealert").hide();

    $.ajax({
        url : href,
        type : 'POST',
        dataType : 'json',
        data : {"config" : config, "name" : name, "host" : host, "user" : user, "password" : password, "port" : port, "driver" : driver},
        success : function(data){
            if (data['code'] === 200)
            {
                getDatabasesList();
                if (data['code'] === 200)
                    operationSuccess();
                else
                    operationError();
            }
            else
                operationError();
        },
        error : function (data) {
            operationError(data);
        }
    });
};



/**
 * Switch app to defalt
 * @param url Url to switch app
 */
var getSwitchApp = function (url) {

    $.ajax({
        url : url,
        type : 'GET',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                getAppListSimple();
                operationSuccess();
            }
        },
        error : function (data) {
            operationError(data);
        }
    })
};



/**
 * Build the class map
 * @param url Url to build class map
 */
var autoBuildManager = function (url) {

    $.ajax({
        url : url,
        type : 'GET',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                //getRoutingList();
                operationSuccess();
            }
        },
        error : function (data) {
            operationError(data);
        }
    })
};

/**
 * Clear the class map
 * @param url Url to clear class map
 */
var autoClearManager = function (url) {

    $.ajax({
        url : url,
        type : 'GET',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                //getRoutingList();
                operationSuccess();
            }
        },
        error : function (data) {
            operationError(data);
        }
    })
};

/**
 * remove a routing file
 * @param url Url to remove routing file
 */
var removeRouting = function (url) {

    $.ajax({
        url : url,
        type : 'GET',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                getRoutingList();
                operationSuccess();
            }
        },
        error : function (data) {
            operationError(data);
        }
    })
};

/**
 * Dashboard Statistics
 * @param url Url to have dashboard stats
 */
var dashboardStatistics = function () {

    var selector = $('.dashboardStats');
    if (typeof selector.attr("attr-href") === "undefined")
        return (1);
    $.ajax({
        url : selector.attr("attr-href"),
        type : 'POST',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                var rs = data['results'];
                $('.dashb-app').html(rs['apps']['number']);
                $('.dashb-appena').html(rs['apps']['prefixed']);
                $('.dashb-apppre').html(rs['apps']['enabled']);

                $('.dashb-dbco').html(rs['dbs']['number']);

                $('.dashb-route').html(rs['routes']['number']);
                $('.dashb-routedisa').html(rs['routes']['disabled']);
                $('.dashb-routevisi').html(rs['routes']['public']);

                $('.dashb-reqsuc-dev').html(rs['logs']['dev']['success']);
                $('.dashb-err-dev').html(rs['logs']['dev']['errors']);
                $('.dashb-errcri-dev').html(rs['logs']['dev']['critical']);
                $('.dashb-erroth-dev').html(rs['logs']['dev']['others']);

                $('.dashb-reqsuc-prod').html(rs['logs']['prod']['success']);
                $('.dashb-err-prod').html(rs['logs']['prod']['errors']);
                $('.dashb-errcri-prod').html(rs['logs']['prod']['critical']);
                $('.dashb-erroth-prod').html(rs['logs']['prod']['others']);
            }
        },
        error : function (data) {
            operationError(data);
        }
    })
};

/**
 * Autoloader Statistics
 * @param url Url to have autoloader stats
 */
var autoloaderStatistics = function () {

    var selector = $('.autoloaderStats');
    if (typeof selector.attr("attr-href") === "undefined")
        return (1);
    $.ajax({
        url : selector.attr("attr-href"),
        type : 'POST',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                var rs = data['results'];
                $('.class-auto-dev').html(rs['ccdev']);
                $('.class-auto-prod').html(rs['ccprod']);
                $('.uni-auto').html(rs['ufile']);
                $('.mast-auto').html(rs['appmaster']);
                $('.app-auto').html(rs['appclass']);
            }
        },
        error : function (data) {
            operationError(data);
        }
    })
};

/**
 * export an app
 * @param url Url to export app
 */
var exportApp = function (url) {

    $.ajax({
        url : url,
        type : 'GET',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                getAppListSimple();
                operationSuccess();
            }
        },
        error : function (data) {
            operationError(data);
        }
    })
};


/**
 * install an app
 * @param url Url to install app
 */
var installApp = function (url) {

    var file_data = $('#apppackage').prop('files')[0];
    var form_data = new FormData();
    form_data.append('file', file_data);
    $.ajax({
        url : url,
        type : 'POST',
        data: form_data,
        contentType: false,
        cache: false,
        processData:false,

        success : function(data){
            var ndata = JSON.parse(data);
            if (ndata['code'] === 200)
            {
                getAppListSimple();
                operationSuccess();
                $("#modalManager").find(".modal-body").append("<h5 class='text-center' style='color: limegreen'><em>"+ndata["ext"]+"</em></h5>");
            }
        },
        error : function (data) {
            operationError(data);
            var d = JSON.parse(data["responseText"]);
            $("#modalManager").find(".modal-body").append("<h5 class='text-center' style='color: red'><em>"+d["msg"]+"</em></h5>");
        }
    })
};




/**
 * rebuild js routing file
 * @param url Url to rebuild js routing file
 */
var rebuildJS = function (url) {

    $.ajax({
        url : url,
        type : 'GET',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                getRoutingList();
                operationSuccess();
            }
        },
        error : function (data) {
            operationError(data);
        }
    })
};



/**
 * Clear logs
 * @param url Url to clear logs
 */
var clearLogs = function (url) {
    $.ajax({
        url : url,
        type : 'GET',
        dataType : 'json',
        success : function(data){
            if (data['code'] === 200)
            {
                operationSuccess();
                getUnlimitedLogs();
                getUnlimitedLogs2();
            }
        },
        error : function (data) {
            operationError(data);
        }
    })
};



/**
 * remove an app
 * @param url Url to remove app
 */
var removeApp = function (url) {

    $.ajax({
        url : url,
        type : 'GET',
        dataType : 'json',
        success : function(data){
            var d = data;
            if (d['code'] === 200)
            {
                if (d['msg'] === "RELOAD")
                {
                    noapp = true;
                    operationSuccess();
                    var selecttorModal = $("#modalManager");
                    selecttorModal.find(".modal-body").html("<h4 class='text-center'>No app was registered</h4>");
                    selecttorModal.find(".modal-body").append("<h4 class='text-center'><em>Trying to redirect to iumio installer</em></h4>");
                    selecttorModal.find(".btn-close").hide();
                    selecttorModal.find(".btn-valid").hide();
                    $("html").attr("style", "pointer-events:none;background-color:rgb(71, 98, 190);bottom: 0;left: 0;position: fixed;right: 0;top: 0;");
                    $("body").attr("style", "pointer-events:none;background-color: rgb(71, 98, 190);bottom: 0;left: 0;position: fixed;right: 0;top: 0;");
                    setTimeout(function () {
                        location.reload();
                    }, 5000);

                }
                else
                {
                    getAppListSimple();
                    operationSuccess();
                }
            }

            else
                operationError();
        },
        error : function (data) {
            operationError(data);
        }
    })
};


/**
 * clear all cache
 * @param url Url to remove all cache
 */
var clearAllCache = function (url) {

    $.ajax({
        url : url,
        type : 'GET',
        dataType : 'json',
        success : function(data){
            getAllCacheEnv();
            if (data['code'] === 200)
                operationSuccess();
            else
                operationError();
        },
        error : function (data) {
            operationError(data);
        }
    })
};


/**
 * clear all compile
 * @param url Url to remove all compile
 */
var clearAllCompile = function (url) {

    $.ajax({
        url : url,
        type : 'GET',
        dataType : 'json',
        success : function(data){
            getAllCompileEnv();
            if (data['code'] === 200)
                operationSuccess();
            else
                operationError();
        },
        error : function (data) {
            operationError(data);
        }
    })
};

/**
 * clear cache for specific env
 * @param url Url to clear cache for specific env
 */
var clearCache = function (url) {

    $.ajax({
        url : url,
        type : 'GET',
        dataType : 'json',
        success : function(data){
            getAllCacheEnv();
            if (data['code'] === 200)
                operationSuccess();
            else
                operationError();
        },
        error : function (data) {
            operationError(data);
        }
    })
};


/**
 * clear compile for specific env
 * @param url Url to clear compile for specific env
 */
var clearCompile = function (url) {

    $.ajax({
        url : url,
        type : 'GET',
        dataType : 'json',
        success : function(data){
            getAllCompileEnv();
            if (data['code'] === 200)
                operationSuccess();
            else
                operationError();
        },
        error : function (data) {
            operationError(data);
        }
    })
};


/**
 * remove db configuration
 * @param url Url to remove db
 */
var removeDb = function (url) {

    $.ajax({
        url : url,
        type : 'GET',
        dataType : 'json',
        success : function(data){
            getDatabasesList();
            if (data['code'] === 200)
                operationSuccess();
            else
                operationError();
        },
        error : function (data) {
            operationError(data);
        }
    })
};

/**
 * Publish assets
 * @param url Url to publish
 */
var assetsPublishManager = function (url) {

    $.ajax({
        url : url,
        type : 'GET',
        dataType : 'json',
        success : function(data){
            // getDatabasesList();
            if (data['code'] === 200)
                operationSuccess();
            else
                operationError();
        },
        error : function (data) {
            operationError(data);
        }
    })
};


/**
 * Clear assets
 * @param url Url to clear
 */
var assetsClearManager = function (url) {

    $.ajax({
        url : url,
        type : 'GET',
        dataType : 'json',
        success : function(data){
            // getDatabasesList();
            if (data['code'] === 200)
                operationSuccess();
            else
                operationError();
        },
        error : function (data) {
            operationError(data);
        }
    })
};


$(document).ready(function () {

    getLogs();
    getAppListSimple();
    getUnlimitedLogs();
    getUnlimitedLogs2();
    getDatabasesList();
    getAllCacheEnv();
    getAllCompileEnv();
    getAllSmartyConfigs();
    getAllAssets();
    getRoutingList();
    dashboardStatistics();
    autoloaderStatistics();


    setInterval(function () {
        if (noapp === false)
        {
            getLogs();
            getAppListSimple();
            getDatabasesList();
            getAllCacheEnv();
            getAllCompileEnv();
            getAllSmartyConfigs();
            getAllAssets();
            getRoutingList();
            dashboardStatistics();
            autoloaderStatistics();
        }
    }, 7000);

    setInterval(function () {
        if (noapp === false)
        {
            getUnlimitedLogs();
            getUnlimitedLogs2();
        }
    }, 10000);

    /**
     * Event to switch default app
     */
    $(document).on('click', ".todefaultapp", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var appname = selector.attr("attr-appname");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Switch to default</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to set <strong>"+appname+"</strong> default app ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "switchapp");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to publish all assets for all env
     */
    $(document).on('click', ".publishallassets", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Publish all assets - all environments</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to publish all assets for all environments ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "pallassets");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to publish all assets for dev env
     */
    $(document).on('click', ".publishalldevassets", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Publish all assets - dev environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to publish all assets for dev environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "palldevassets");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to publish all assets for prod env
     */
    $(document).on('click', ".publishallprodassets", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Publish all assets - prod environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to publish all assets for prod environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "pallprodassets");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to clear all assets for all env
     */
    $(document).on('click', ".clearallassets", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear all assets - all environments</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to Clear all assets for all environments ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "callassets");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to clear all assets for dev env
     */
    $(document).on('click', ".clearalldevassets", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear all assets - dev environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to Clear all assets for dev environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "calldevassets");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to clear all assets for prod env
     */
    $(document).on('click', ".clearallprodassets", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear all assets - prod environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to Clear all assets for prod environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "callprodassets");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to delete an app
     */
    $(document).on('click', ".deleteapp", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var appname = selector.attr("attr-appname");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Delete "+appname+"</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to delete <strong>"+appname+"</strong> ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "removeapp");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to delete an database configuration
     */
    $(document).on('click', ".todeletedatabase", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var name = selector.attr("attr-dbconfig");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Delete "+name+"</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to delete <strong>"+name+"</strong> database configuration ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "removedb");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to override js routing
     */
    $(document).on('click', ".rebuildjs", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Rebuild JS Routing</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to rebuild the JS Routing configuration ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "rebuildjsok");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });



    /**
     * Event to validate an event
     */
    $(document).on('click', ".btn-valid", function () {
        var selector = $(this);
        var event = selector.attr("attr-event");
        var href = selector.attr("attr-href");

        switch (event)
        {
            case "switchapp":
                getSwitchApp(href);
                break;
            case "removeapp":
                removeApp(href);
                break;
            case "createvalidapp":
                createOneApp(href);
                break;
            case "clearlogs":
                clearLogs(href);
                break;
            case "removedb":
                removeDb(href);
                break;
            case "editdatabasesave":
                saveDatabaseConfiguration(href);
                break;
            case "createsavedatabase":
                createDatabaseConfiguration(href);
                break;
            case "clearallcache":
                clearAllCache(href);
                break;
            case "clearcache":
                clearCache(href);
                break;
            case "clearallcompile":
                clearAllCompile(href);
                break;
            case "clearcompile":
                clearCompile(href);
                break;
            case "editsmartysave":
                saveSmartyConfiguration(href);
                break;
            case "editappsave":
                saveApp(href);
                break;
            case "rebuildjsok":
                rebuildJS(href);
                break;
            case "removearouting":
                removeRouting(href);
                break;
            case "processtoexportapp":
                exportApp(href);
                break;
            case "installapp":
                installApp(href);
                break;

            case "callprodassets":
            case "calldevassets":
            case "callassets":
                assetsClearManager(href);
                break;
            case "pallprodassets":
            case "palldevassets":
            case "pallassets":
                assetsPublishManager(href);
                break;
            case "bautodev":
            case "bautoprod":
            case "bautoall":
                autoBuildManager(href);
                break;
            case "cautodev":
            case "cautoprod":
            case "cautoall":
                autoClearManager(href);
                break;

        }
    });


    /**
     * Event to show create app modal
     */
    $(document).on('click', ".createapp", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Create one app</strong>");
        selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Fill in the fields to create an application.</h4>");
        selecttorModal.find(".modal-body").append("<br>");
        selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");

        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Name</label><input type='text' name='appname' class='form-control'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Prefix</label><input type='text' name='prefix' class='form-control'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append('<div class="container-new">' +
            '<div class="form-group text-center"> <label>Default template</label> <div class="check"><input id="check" type="checkbox" name="template" style="display: none"/><label for="check"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
            '<div class="form-group text-center"><label>Enabled</label> <div class="check"><input id="check1" name="enabled"  type="checkbox" style="display: none" /><label for="check1"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
            '</div>');

        selecttorModal.find(".btn-close").html("Close");
        selecttorModal.find(".btn-valid").html("Create");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "createvalidapp");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to show edit database modal
     */
    $(document).on('click', ".toeditdatabase", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var href2 = selector.attr("attr-href2");
        var name = selector.attr("attr-dbconfig");
        var result = null;

        $.ajax({
            url : href,
            type : 'GET',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    result = data['results'];
                    var selecttorModal = $("#modalManager");

                    selecttorModal.find(".modal-header").html("<strong class='text-center'>Edit "+name+" configuration</strong>");
                    selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
                    selecttorModal.find(".modal-body").html("<h4 class='text-center'>Edit fields to update database configuration.</h4>");
                    selecttorModal.find(".modal-body").append("<br>");
                    selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");

                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Configuration name</label><input type='text' name='config' class='form-control text-center' value='"+name+"' disabled='disabled'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Name</label><input type='text' name='name' class='form-control text-center' value='"+result['db_name']+"'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Host</label><input type='text' name='host' class='form-control text-center' value='"+result['db_host']+"'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>User name</label><input type='text' name='user' class='form-control text-center' value='"+result['db_user']+"'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>User password</label><input type='text' name='password' class='form-control text-center' value='"+result['db_password']+"'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Port</label><input type='number' name='port' class='form-control text-center' value='"+result['db_port']+"'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Driver</label><input type='text' name='driver' class='form-control text-center' value='"+result['db_driver']+"'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");

                    selecttorModal.find(".btn-close").html("Close");
                    selecttorModal.find(".btn-valid").html("Update");

                    selecttorModal.find(".btn-valid").attr("attr-href", href2);
                    selecttorModal.find(".btn-valid").attr("attr-dbconfig", name);
                    selecttorModal.find(".btn-valid").attr("attr-event", "editdatabasesave");
                    selecttorModal.find(".btn-close").show();
                    selecttorModal.find(".btn-valid").show();

                    modal("show");
                }
                else
                {
                    operationError();
                    return (0);
                }
            }
        });
    });

    /**
     * Event to import an app
     */
    $(document).on('click', ".importapp", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Import an app</strong>");
        selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Select the app package in your computer</h4>");
        selecttorModal.find(".modal-body").append("<br>");
        selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");

        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Package</label><input type='file' id='apppackage' name='apppackage' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
       selecttorModal.find(".modal-body").append("</div></div>");

        selecttorModal.find(".btn-close").html("Close");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "installapp");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").hide();


        modal("show");
    });

    $(document).on("change", "#apppackage", function (e) {
        e.preventDefault();
        var selecttorModal = $("#modalManager");
        selecttorModal.find(".btn-valid").html("Install");
        selecttorModal.find(".btn-valid").show();
    });


    /**
     * Event to show edit app modal
     */
    $(document).on('click', ".toeditapp", function () {
        var selector = $(this);
        var href = selector.attr("attr-href2");
        var prefix = selector.attr("attr-prefix");
        var enabled = selector.attr("attr-enabled");
        var name = selector.attr("attr-appname");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Edit "+name+" app configuration</strong>");
        selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Edit fields to update app configuration.</h4>");
        selecttorModal.find(".modal-body").append("<br>");
        selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");

        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Prefix</label><input type='text' name='prefix' class='form-control text-center' value='"+prefix+"' ></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append('<div class="container-new">' +
            '<div class="form-group text-center"> <label>Enabled</label> <div class="check"><input id="check" type="checkbox" name="enabled" '+((enabled === "yes")? "checked='checked'" : "")+' style="display: none"/><label for="check"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
            '</div>');
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".btn-close").html("Close");
        selecttorModal.find(".btn-valid").html("Update");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-appname", name);
        selecttorModal.find(".btn-valid").attr("attr-event", "editappsave");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");

    });


    /**
     * Event to show edit smarty configuration
     */
    $(document).on('click', ".editsmartyconfig", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var href2 = selector.attr("attr-href2");
        var name = selector.attr("attr-config");
        var result = null;

        $.ajax({
            url : href,
            type : 'GET',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    result = data['results'];
                    var selecttorModal = $("#modalManager");

                    selecttorModal.find(".modal-header").html("<strong class='text-center'>Edit "+name+" configuration</strong>");
                    selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
                    selecttorModal.find(".modal-body").html("<h4 class='text-center'>Edit fields to update smarty configuration.</h4>");
                    selecttorModal.find(".modal-body").append("<br>");
                    selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");

                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Configuration name</label><input type='text' name='config' class='form-control text-center' value='"+name+"' disabled='disabled'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append('<div class="container-new">' +
                        '<div class="form-group text-center"> <label>Debug</label> <div class="check"><input id="check" type="checkbox" name="debug" '+((result['debug'] === true)? "checked='checked'" : "")+' style="display: none"/><label for="check"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
                        '<div class="form-group text-center"><label>Cache</label> <div class="check"><input id="check1" name="cache" '+((result['cache'] === 1)? "checked='checked'" : "")+' type="checkbox" style="display: none" /><label for="check1"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
                        '<div class="form-group text-center"><label>Compile Check</label> <div class="check"><input id="check2" name="compile" '+((result['compile_check'] === true)? "checked='checked'" : "")+' type="checkbox" style="display: none" /><label for="check2"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
                        '<div class="form-group text-center"><label>Force to compile</label> <div class="check"><input id="check3" name="force" '+((result['force_compile'] === true)? "checked='checked'" : "")+' type="checkbox" style="display: none" /><label for="check3"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
                        '<div class="form-group text-center"><label>Smarty Debug</label> <div class="check"><input id="check4" name="sdebug" '+((result['smarty_debug'] === true)? "checked='checked'" : "")+' type="checkbox" style="display: none" /><label for="check4"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
                        '<div class="form-group text-center"><label>Console</label> <div class="check"><input id="check5" name="console" '+((result['console_debug'] === "on")? "checked='checked'" : "")+' type="checkbox" style="display: none" /><label for="check5"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
                        '</div>');
                    selecttorModal.find(".modal-body").append("</div></div>");

                    selecttorModal.find(".btn-close").html("Close");
                    selecttorModal.find(".btn-valid").html("Update");

                    selecttorModal.find(".btn-valid").attr("attr-href", href2);
                    selecttorModal.find(".btn-valid").attr("attr-config", name);
                    selecttorModal.find(".btn-valid").attr("attr-event", "editsmartysave");
                    selecttorModal.find(".btn-close").show();
                    selecttorModal.find(".btn-valid").show();

                    modal("show");
                }
                else
                {
                    operationError();
                    return (0);
                }
            },
            error : function (data) {
                operationError(data);
            }
        });
    });


    /**
     * Event to show routing
     */
    $(document).on('click', ".showrouting", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var appname = selector.attr("attr-appname");
        var filename = selector.attr("attr-filename");
        var result = null;

        $.ajax({
            url : href,
            type : 'GET',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    result = data['results'];
                    var selecttorModal = $("#modalManager");
                    var pu = "";
                    selecttorModal.find(".modal-header").html("<strong class='text-center'>Content of  "+filename+" routing file :  "+appname+"</strong>");
                    selecttorModal.find(".modal-body").html('');
                    $.each(result, function (index, value) {
                        var params = "";
                        var link_gen = "";
                        if (typeof  value['params'] !== "undefined") {
                            var pa = value['params'];
                             pu = value['r_parameters'];
                            for (var i = 0; i < pa.length; i++)
                            {
                                if (typeof  pu[i] !== "undefined")
                                    params += "<tr><td>" + pa[i] + "</td><td>"+pu[i][1]+"</td></tr>";
                                else
                                   params += "<tr><td>" + pa[i] + "</td><td>No requirement</td></tr>";
                            }
                           /* $.each(value['params'], function (index2, value2) {

                            })*/
                        }
                        else
                            params = "<tr><td colspan='2'>No parameters</td></tr>";

                        if ((typeof  value['route_gen'] !== "undefined") && value['visibility'] !== "disabled")
                            link_gen = "<tr><td colspan='2'><a href='"+value['route_gen']+"'><strong>Go to link</strong></a></td></tr>";

                        var titleP = "";
                        if (pu.length > 0)
                             titleP = "<tr><td><strong>Name</strong></td><td><strong>Scalar type</strong></td></tr>";
                        selecttorModal.find(".modal-body").append("<div class='container' style='width: 100%'><div class='row'><table class='table table-bordered table-responsive  table-wrapper'"
                            + "<tr><th colspan='2' class='text-center'>Route name : "+value['routename']+"</th></tr>"+
                            "<tr><td>Path</td> <td> "+value['path']+"</td></tr>" +
                            "<tr><td>Related master</td> <td> "+value['controller']+"Master</td></tr>"
                            +"<tr><td>Visibility</td> <td> "+value['visibility']+"</td></tr>"
                            +"<tr><td>Callable activity</td> <td> "+value['method']+"</td></tr>"
                            +"<tr><td>Method(s) allowed</td> <td> "+value['m_allow']+"</td></tr>"
                            +"<tr><td colspan='2' class='text-center text-info'><strong>Parameters</strong></td></tr>"+
                            titleP + params + link_gen +
                            "</table></div></div><br><br>"
                        );

                    });

                    selecttorModal.find(".btn-close").html("Close");
                    //selecttorModal.find(".btn-valid").html("Edit (Later)");

                    selecttorModal.find(".btn-valid").attr("attr-href", href);
                    //selecttorModal.find(".btn-valid").attr("attr-appname", name);
                    //selecttorModal.find(".btn-valid").attr("attr-event", "editrouting");
                    selecttorModal.find(".btn-close").show();
                    selecttorModal.find(".btn-valid").hide();

                    modal("show");
                }
                else
                {
                    operationError();
                    return (0);
                }
            },
            error : function (data) {
                operationError(data);
            }
        });
    });




    /**
     * Event to show create database config modal
     */
    $(document).on('click', ".createdatabaseconfig", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Create a new database configuration</strong>");
        selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Fill in the fields to create a database configuration.</h4>");
        selecttorModal.find(".modal-body").append("<br>");
        selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");

        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Configuration name</label><input type='text' name='config' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Name</label><input type='text' name='name' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Host</label><input type='text' name='host' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>User name</label><input type='text' name='user' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>User password</label><input type='text' name='password' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Port</label><input type='number' name='port' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Driver</label><input type='text' name='driver' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");

        selecttorModal.find(".btn-close").html("Close");
        selecttorModal.find(".btn-valid").html("Update");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "createsavedatabase");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to show assets options modal
     */
    $(document).on('click', ".showoptionsassets", function () {
        var selector = $(this);
        var hrefcd = selector.attr("attr-href-clear-dev");
        var hrefcp = selector.attr("attr-href-clear-prod");
        var hrefpd = selector.attr("attr-href-publish-dev");
        var hrefpp = selector.attr("attr-href-publish-prod");
        var hrefca = selector.attr("attr-href-clear-all");
        var hrefpa = selector.attr("attr-href-publish-all");
        var appname = selector.attr("attr-appname");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Options for "+appname+" assets</strong>");
        selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Choose the option you want to perform for "+appname+" assets.</h4>");
        selecttorModal.find(".modal-body").append("<br>");

        selecttorModal.find(".modal-body").append(
            '<div class="row center-block text-center manager-options">'
            + '<div class="col-md-4 text-center"><a class="btn-default btn publishappassets" attr-href="'+hrefpd+'"> Publish dev</a></div>'

            +'<div class="col-md-4 text-center"><a class="btn-default btn publishappassets" attr-href="'+hrefpp+'" >Publish prod</a></div>'

            +'<div class="col-md-4 text-center"><a class="btn-default btn publishappassets" attr-href="'+hrefpa+'">Publish all</a></div>'

            +'<div class="col-md-4 text-center"><a class="btn-default btn publishappassets" attr-href="'+hrefcd+'">Clear dev</a></div>'

            +'<div class="col-md-4 text-center"><a class="btn-default btn publishappassets" attr-href="'+hrefcp+'">Clear prod</a></div>'

            +'<div class="col-md-4 text-center"><a class="btn-default btn publishappassets" attr-href="'+hrefca+'">Clear all</a></div>'

            +"</div>");

        selecttorModal.find(".btn-close").html("Close");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").hide();

        modal("show");
    });



    /**
     * Event to clear logs
     */
    $(document).on('click', ".clearlogs", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var env = selector.attr("attr-env");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear log for "+env+" environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Would you like to empty log file for <strong>"+env+"</strong> environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "clearlogs");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to clear all cache
     */
    $(document).on('click', ".clearcache", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var env = selector.attr("attr-env");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear cache for all environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Would you like to empty cache folder for all environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "clearallcache");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to clear all cache
     */
    $(document).on('click', ".clearcachespec", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var env = selector.attr("attr-env");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear cache for "+env+" environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Would you like to empty cache folder for <strong>"+env+"</strong> environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "clearcache");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to clear all compile
     */
    $(document).on('click', ".clearcompile", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var env = selector.attr("attr-env");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear compiled for all environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Would you like to empty compiled folder for all environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "clearallcompile");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to remove a routing file
     */
    $(document).on('click', ".todeleterouting", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var appname = selector.attr("attr-appname");
        var filename = selector.attr("attr-filename");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Remove a routing file</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Would you like to remove "+filename+" routing file related with "+appname+" ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "removearouting");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to export an application
     */
    $(document).on('click', ".exportapp", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var appname = selector.attr("attr-appname");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Export an app</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Would you like to export "+appname+" ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "processtoexportapp");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });



    /**
     * Event to clear all compile
     */
    $(document).on('click', ".clearcompilespec", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var env = selector.attr("attr-env");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear compiled for "+env+" environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Would you like to empty compiled folder for <strong>"+env+"</strong> environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "clearcompile");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });



    /**
     * Event to clear classampp for prod environement
     */
    $(document).on('click', ".clearautoloaderprod", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear ClassMapp - PROD</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to clear the class map file for prod environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "cautoprod");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to build classampp for prod environement
     */
    $(document).on('click', ".buildautoloaderdev", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Build ClassMapp - PROD</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to build the class map file for dev environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "bautodev");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to Build classampp for prod environement
     */
    $(document).on('click', ".buildautoloaderprod", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Build ClassMapp - PROD</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to build the class map file for prod environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "bautoprod");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to build classampp for all environements
     */
    $(document).on('click', ".buildautoloaderall", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Build ClassMapp - All environements</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to build the class map file for each environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "cautoall");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to manage assets (clear, publish)
     */
    $(document).on('click', ".publishappassets", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        $.ajax({
            url : href,
            type : 'GET',
            dataType : 'json',
            success : function(data){
                getAllAssets();
                if (data['code'] === 200)
                    operationSuccess();
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        });

    });
});
