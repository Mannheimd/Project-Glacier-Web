$(document).ready(function() {
    getJenkinsServers();
    bindButtonEvents();
    determineStartPage();

    function determineStartPage() {
        if (localStorage.getItem("isConfigured") != "true") {
            changePage("pageContainer", "glacierConfig");
        }
        else {
            changePage("pageContainer", "glcMainUI");
        }
    }

    function bindButtonEvents() {
        $("#jnkSrvCfgFinishedButton").on("click", function() {
            changePage("pageContainer", "glcMainUI");
            localStorage.setItem("isConfigured", "true");
        })

        $("#glcMainUIMenuConfigButton").on("click", function() {
            changePage("pageContainer", "glacierConfig");
        })

        $("#glcMainUINewLookupButton").on("click", function() {
            changePage("glcMainUIDisplayPage", "glcMainUIDisplayPageNewLookup");
            resetLookup();
        })
        
        $("#glcMainUINewLookupForm").on("submit", function(e) {
            var params = $("#" + e.target.id).serializeArray();
            var server = jenkinsServer.prototype.getServerById(params[0].value)[0];
            jenkinsLookup.prototype.newLookup(server, params[1].value, params[2].value);
            e.preventDefault();
        })
    }
});

// Use pageClass the same way as a Radio input's name; class defines the 'book', ID of each 'page' is used to identify which page you're switching to
function changePage(pageClass, pageContainerId) {
    $("." + pageClass).each(function() {
        if ($(this).attr('id') == pageContainerId) {
            $(this).removeClass('hidden');
        }
        else {
            $(this).addClass('hidden');
        }
    })
}

function resetLookup() {
    $("#glcMainUIDisplayPageNewLookupServers").empty();
    populateJenkinsServers();
    resetLookupByRadio();

    function populateJenkinsServers() {
        for (var i = 0; i < jenkinsServerArray.length; i++) {
            if (jenkinsServerArray[i].currentUser) {
                html = jenkinsServer.prototype.processTemplate($("#jnkSvrLookupListItemTpl").html(), jenkinsServerArray[i]);
                $("#glcMainUIDisplayPageNewLookupServers").append(html);
            }
        }
    }

    function resetLookupByRadio() {
        $("#glcMainUIDisplayPageNewLookupSearchByAccNum").prop("checked", true);
        $("#glcMainUIDisplayPageNewLookupSearchByEmail").prop("checked", false);
        $("#glcMainUIDisplayPageNewLookupSearchBySiteName").prop("checked", false);
        $("#glcMainUIDisplayPageNewLookupSearchBySubNum").prop("checked", false);
        $("#glcMainUIDisplayPageNewLookupSearchByIITID").prop("checked", false);
    }
}